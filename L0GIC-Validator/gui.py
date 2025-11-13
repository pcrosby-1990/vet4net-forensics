#!/usr/bin/env python3
"""
Validator Dashboard GUI (upgraded)

This is a corrected and improved version of gui.py with:
- Fixed indentation, structure, and imports.
- Tabbed layout (ttk.Notebook) with Stamp & Sign, Batch, Registry, Audit tabs.
- Hormonal cycle tracker integrated as an optional utility panel in the Stamp tab.
- All build_* methods accept a parent container.
- Background threads for long-running tasks; GUI updates marshalled to the main thread.
- Basic keyboard shortcuts (Ctrl+O to open image).
- Better error handling and consistent logging.
- Places for HSM-aware signing / anchoring hooks remain as external dependencies.
- Minimal UI accessibility improvements (button widths, labels).
- Small convenience: recent files remembered in-memory during session.
"""

from __future__ import annotations
import threading
import traceback
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk
import qrcode
import pyperclip
import datetime
import json
import os
import webbrowser
from typing import Optional

# External modules that must exist in your project
from validator.stamp import embed_stamp
from sign_trace import sign_trace_with_dilithium  # should support HSM usage optionally
from registry import push_to_registry
from batch_stamper import batch_stamp_folder
from contract import attest_to_contract

# Optional cycle tracker (ensure the module name and class exist)
try:
    from hormonal_cycle import HormonalCycle
except Exception:
    HormonalCycle = None

PUBLIC_KEY_URL = "https://etherscan.io/address/0x74191d893DB82BE9955Ed5fB95fe2d8F69D35395"
AUDIT_LOG_PATH = "audit.log"


class ValidatorGUI:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("L0GIC Validator Dashboard")
        self.root.geometry("1100x760")
        self.root.minsize(900, 640)
        self.root.resizable(True, True)

        # state
        self.image_path: Optional[str] = None
        self.output_path: Optional[str] = None
        self.signature: Optional[str] = None
        self.last_sign_result: Optional[dict] = None
        self.recent_files: list[str] = []

        # form variables
        self.name_var = tk.StringVar()
        self.id_var = tk.StringVar()
        self.level_var = tk.StringVar(value="silver")
        self.alg_var = tk.StringVar(value="Dilithium2")
        self.attest_on_chain_var = tk.BooleanVar(value=False)
        self.dry_run_var = tk.BooleanVar(value=False)

        # optional cycle tracker state
        self.cycle_tracker = HormonalCycle() if HormonalCycle is not None else None
        self.cycle_start_var = tk.StringVar(value=datetime.date.today().isoformat())

        # Build UI
        self.build_header()
        self.build_notebook()
        self.build_log_panel()

        # Keyboard shortcuts
        self.root.bind_all("<Control-o>", lambda e: self.select_image())

        # initial status
        self.update_status("Ready")

    # -----------------------
    # Top-level UI
    # -----------------------
    def build_header(self):
        header = tk.Frame(self.root, pady=6)
        header.pack(fill="x")
        tk.Label(header, text="L0GIC Validator Dashboard", font=("Inter", 18, "bold")).pack(side="left", padx=12)
        pub_label = tk.Label(header, text=f"Public Key: {PUBLIC_KEY_URL}", fg="blue", cursor="hand2")
        pub_label.pack(side="right", padx=12)
        pub_label.bind("<Button-1>", lambda e: webbrowser.open(PUBLIC_KEY_URL))

    def build_notebook(self):
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True, padx=8, pady=6)

        self.tab_stamp = tk.Frame(self.notebook)
        self.tab_batch = tk.Frame(self.notebook)
        self.tab_registry = tk.Frame(self.notebook)
        self.tab_audit = tk.Frame(self.notebook)

        self.notebook.add(self.tab_stamp, text="Stamp & Sign")
        self.notebook.add(self.tab_batch, text="Batch Mode")
        self.notebook.add(self.tab_registry, text="Registry")
        self.notebook.add(self.tab_audit, text="Audit Log")

        # Stamp tab layout: left form, center preview, right QR & controls
        self.build_form(self.tab_stamp)
        self.build_preview(self.tab_stamp)
        self.build_qr_preview(self.tab_stamp)
        self.build_buttons(self.tab_stamp)
        self.build_cycle_tracker(self.tab_stamp)

        # Batch
        self.build_batch_controls(self.tab_batch)

        # Registry tab
        tk.Button(self.tab_registry, text="Open Registry Viewer", width=24, command=self.launch_registry_viewer).pack(pady=20)
        tk.Button(self.tab_registry, text="Reload Registry (if available)", width=24, command=self._threaded(self._reload_registry_stub)).pack(pady=6)

        # Audit tab
        self.build_audit_tab(self.tab_audit)

    # -----------------------
    # Hormonal cycle tracker (optional)
    # -----------------------
    def build_cycle_tracker(self, parent):
        """
        Small optional utility included in the Stamp tab to demonstrate integrating the HormonalCycle.
        This panel is hidden if HormonalCycle is not available.
        """
        if self.cycle_tracker is None:
            return

        frame = tk.LabelFrame(parent, text="Cycle Tracker (optional)", padx=8, pady=8)
        frame.pack(side="bottom", fill="x", padx=12, pady=(6, 12))

        tk.Label(frame, text="Cycle Start Date (YYYY-MM-DD):").grid(row=0, column=0, sticky="w")
        tk.Entry(frame, textvariable=self.cycle_start_var, width=14).grid(row=0, column=1, sticky="w", padx=6)
        tk.Button(frame, text="Show Today's Phase", command=self._threaded(self.show_cycle_phase)).grid(row=0, column=2, padx=8)

        self.cycle_output = tk.Text(frame, height=6, width=90, state="disabled")
        self.cycle_output.grid(row=1, column=0, columnspan=3, pady=(8, 0), sticky="w")

    def show_cycle_phase(self):
        """
        Compute and display cycle phase using HormonalCycle instance.
        Runs in background thread but updates GUI on main thread.
        """
        try:
            start_str = self.cycle_start_var.get()
            start_date = datetime.datetime.strptime(start_str, "%Y-%m-%d").date()
        except Exception:
            self._safe_messagebox("Cycle Error", "Invalid date format. Use YYYY-MM-DD.")
            return

        def worker():
            try:
                phase = self.cycle_tracker.get_today_phase(start_date)
                output = (
                    f"Today's Phase: {phase.name}\n"
                    f"Day Range: {phase.start_day}-{phase.end_day}\n"
                    f"Dominant Hormones: {', '.join(phase.dominant_hormones)}\n"
                    f"Description: {phase.description}\n"
                )
            except Exception as e:
                output = f"Cycle computation failed: {e}"
            # marshal update to main thread
            self.root.after(0, lambda: self._set_cycle_output(output))

        threading.Thread(target=worker, daemon=True).start()

    def _set_cycle_output(self, text: str):
        self.cycle_output.configure(state="normal")
        self.cycle_output.delete("1.0", "end")
        self.cycle_output.insert("end", text)
        self.cycle_output.configure(state="disabled")

    # -----------------------
    # Stamp tab building blocks (all accept parent)
    # -----------------------
    def build_form(self, parent):
        frm = tk.Frame(parent, padx=12, pady=6)
        frm.pack(side="left", anchor="n", fill="y")

        # Name / ID / Level / Algorithm
        tk.Label(frm, text="Full Name").grid(row=0, column=0, sticky="e", padx=4, pady=4)
        tk.Entry(frm, textvariable=self.name_var, width=36).grid(row=0, column=1, padx=4, pady=4)

        tk.Label(frm, text="Validation ID").grid(row=1, column=0, sticky="e", padx=4, pady=4)
        tk.Entry(frm, textvariable=self.id_var, width=36).grid(row=1, column=1, padx=4, pady=4)

        tk.Label(frm, text="Validator Level").grid(row=2, column=0, sticky="e", padx=4, pady=4)
        ttk.Combobox(frm, textvariable=self.level_var, values=["bronze", "silver", "gold", "diamond"], width=34).grid(row=2, column=1, padx=4, pady=4)

        tk.Label(frm, text="Signature Algorithm").grid(row=3, column=0, sticky="e", padx=4, pady=4)
        ttk.Combobox(frm, textvariable=self.alg_var, values=["Dilithium2", "Dilithium3", "Dilithium5"], width=34).grid(row=3, column=1, padx=4, pady=4)

        # Toggles for batch behavior
        toggles = tk.Frame(frm)
        toggles.grid(row=4, column=0, columnspan=2, pady=6)
        tk.Checkbutton(toggles, text="Attest on-chain (batch)", variable=self.attest_on_chain_var).pack(side="left", padx=6)
        tk.Checkbutton(toggles, text="Dry run (no writes)", variable=self.dry_run_var).pack(side="left", padx=6)

    def build_preview(self, parent):
        frame = tk.Frame(parent, pady=8)
        frame.pack(side="left", padx=8, pady=6, fill="both", expand=False)

        tk.Label(frame, text="Stamped Image Preview", font=("Arial", 12)).pack()
        self.canvas = tk.Canvas(frame, width=520, height=380, bg="gray")
        self.canvas.pack(padx=6, pady=6)

    def build_qr_preview(self, parent):
        right = tk.Frame(parent, pady=8)
        right.pack(side="left", padx=8, pady=6, fill="y")

        tk.Label(right, text="Public Key / Signature QR Code", font=("Arial", 12)).pack()
        self.qr_canvas = tk.Canvas(right, width=200, height=200, bg="white")
        self.qr_canvas.pack(padx=6, pady=6)

        # QR control buttons
        ctrls = tk.Frame(right)
        ctrls.pack()
        tk.Button(ctrls, text="Show Public Key URL", command=lambda: self.show_qr(PUBLIC_KEY_URL)).pack(side="left", padx=6)
        tk.Button(ctrls, text="Show Last Public Key", command=lambda: self.show_qr(self.last_sign_result.get("public_key") if self.last_sign_result else PUBLIC_KEY_URL)).pack(side="left", padx=6)
        tk.Button(ctrls, text="Copy Last Signature", command=self._copy_last_signature).pack(side="left", padx=6)

    def build_buttons(self, parent):
        btn_row = tk.Frame(parent, pady=8)
        btn_row.pack(side="left", padx=12, anchor="n")

        tk.Button(btn_row, text="Select Image", width=18, command=self.select_image).grid(row=0, column=0, padx=6, pady=4)
        tk.Button(btn_row, text="Stamp & Sign", width=18, command=self._threaded(self.stamp_and_sign)).grid(row=0, column=1, padx=6, pady=4)
        tk.Button(btn_row, text="Push to Registry", width=18, command=self._threaded(self.push_registry)).grid(row=0, column=2, padx=6, pady=4)
        tk.Button(btn_row, text="Batch Stamp Folder", width=18, command=self._threaded(self.batch_stamp)).grid(row=1, column=0, padx=6, pady=4)
        tk.Button(btn_row, text="Smart Contract Attest", width=18, command=self._threaded(self.attest_contract)).grid(row=1, column=1, padx=6, pady=4)
        tk.Button(btn_row, text="Open Registry Viewer", width=18, command=self.launch_registry_viewer).grid(row=1, column=2, padx=6, pady=4)

    # -----------------------
    # Batch tab
    # -----------------------
    def build_batch_controls(self, parent):
        frm = tk.Frame(parent, padx=12, pady=12)
        frm.pack(fill="both", expand=True)

        tk.Label(frm, text="Batch Stamping", font=("Arial", 14)).pack(anchor="w", pady=(0, 8))
        tk.Button(frm, text="Select Folder and Start Batch", width=28, command=self._threaded(self.batch_stamp)).pack(pady=6)
        tk.Label(frm, text="Batch options are controlled on the Stamp & Sign tab (Attest on-chain, Dry-run).").pack(anchor="w", pady=4)

        tk.Label(frm, text="Batch Output (recent):", font=("Arial", 12)).pack(anchor="w", pady=(10, 4))
        self.batch_output_text = tk.Text(frm, height=8, state="disabled")
        self.batch_output_text.pack(fill="both", expand=True)

    # -----------------------
    # Audit tab
    # -----------------------
    def build_audit_tab(self, parent):
        tk.Label(parent, text="Audit Log Viewer", font=("Arial", 14)).pack(pady=8)
        self.audit_text = tk.Text(parent, height=20, wrap="word", state="disabled")
        self.audit_text.pack(fill="both", expand=True, padx=12, pady=6)
        tk.Button(parent, text="Reload Audit Log", command=self._threaded(self.reload_audit_log)).pack(pady=6)
        # initial load
        self.reload_audit_log()

    # -----------------------
    # Activity log & status
    # -----------------------
    def build_log_panel(self):
        frame = tk.Frame(self.root)
        frame.pack(fill="both", expand=False, padx=12, pady=6)
        left = tk.Frame(frame)
        left.pack(fill="both", expand=True, side="left")

        tk.Label(left, text="Activity Log", font=("Arial", 12)).pack(anchor="w")
        self.log_text = tk.Text(left, height=8, wrap="word", state="disabled")
        self.log_text.pack(fill="both", expand=True)

        status_frame = tk.Frame(self.root)
        status_frame.pack(fill="x", padx=12, pady=(0, 12))
        self.status_label = tk.Label(status_frame, text="Status: Ready", anchor="w")
        self.status_label.pack(fill="x")

    def update_status(self, msg: str):
        # Always call from main thread; safe to call from background via root.after
        def _update():
            self.status_label.config(text=f"Status: {msg}")
            self.log(msg)
        self.root.after(0, _update)

    def log(self, msg: str):
        ts = datetime.datetime.utcnow().isoformat() + "Z"
        line = f"[{ts}] {msg}\n"
        try:
            self.log_text.configure(state="normal")
            self.log_text.insert("end", line)
            self.log_text.see("end")
            self.log_text.configure(state="disabled")
        except Exception:
            # If called early, just print
            print(line)

    # -----------------------
    # Thread helpers
    # -----------------------
    def _threaded(self, func):
        """Return a wrapped callable that runs func in a background thread and disables UI while running."""
        def wrapper(*args, **kwargs):
            t = threading.Thread(target=self._run_with_catch, args=(func, args, kwargs), daemon=True)
            t.start()
        return wrapper

    def _run_with_catch(self, func, args, kwargs):
        try:
            self._set_ui_enabled(False)
            func(*args, **kwargs)
        except Exception as e:
            tb = traceback.format_exc()
            self.log(f"Error: {e}\n{tb}")
            self._safe_messagebox("Error", f"{e}\n\nSee Activity Log for details.")
        finally:
            self._set_ui_enabled(True)

    def _set_ui_enabled(self, enabled: bool):
        state = "normal" if enabled else "disabled"
        # enable/disable buttons across the notebook
        for child in self.root.winfo_children():
            for w in child.winfo_children():
                try:
                    if isinstance(w, tk.Button) or isinstance(w, ttk.Button):
                        w.config(state=state)
                except Exception:
                    pass
        # keep log writable only by code
        try:
            self.log_text.config(state="normal" if enabled else "disabled")
        except Exception:
            pass
        if not enabled:
            self.update_status("Working...")

    def _safe_messagebox(self, title: str, message: str):
        self.root.after(0, lambda: messagebox.showinfo(title, message))

    # -----------------------
    # Actions
    # -----------------------
    def launch_registry_viewer(self):
        try:
            subprocess = __import__("subprocess")
            subprocess.Popen(["python", "registry_viewer.py"])
            self.update_status("Opened registry viewer")
        except Exception as e:
            self.log(f"Failed to open registry viewer: {e}")
            messagebox.showerror("Launch Error", f"Could not open registry viewer:\n{e}")

    def select_image(self):
        path = filedialog.askopenfilename(filetypes=[("PNG Images", "*.png"), ("JPEG Images", "*.jpg;*.jpeg"), ("All Files", "*.*")])
        if not path:
            return
        self.image_path = path
        # remember recent files in-session
        if path not in self.recent_files:
            self.recent_files.insert(0, path)
            self.recent_files = self.recent_files[:10]
        self.show_preview(path)
        self.update_status(f"Selected image: {os.path.basename(path)}")

    def show_preview(self, path: str):
        try:
            img = Image.open(path)
            img.thumbnail((520, 380), Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.ANTIALIAS)
            self.tk_img = ImageTk.PhotoImage(img)
            self.canvas.delete("all")
            self.canvas.create_image(0, 0, anchor="nw", image=self.tk_img)
        except Exception as e:
            self.log(f"Preview error: {e}")
            self._safe_messagebox("Preview Error", str(e))

    def show_qr(self, data: str):
        try:
            qr = qrcode.QRCode(version=2, box_size=4, border=2)
            qr.add_data(data)
            qr.make(fit=True)
            img_qr = qr.make_image(fill_color="black", back_color="white")
            img_qr = img_qr.resize((200, 200))
            self.tk_qr = ImageTk.PhotoImage(img_qr)
            self.qr_canvas.delete("all")
            self.qr_canvas.create_image(0, 0, anchor="nw", image=self.tk_qr)
            self.update_status("QR displayed")
        except Exception as e:
            self.log(f"QR error: {e}")

    def _copy_last_signature(self):
        if not self.signature:
            messagebox.showinfo("No Signature", "No signature available to copy.")
            return
        pyperclip.copy(self.signature)
        messagebox.showinfo("Copied", "Signature copied to clipboard.")

    # -----------------------
    # Stamp & Sign flow
    # -----------------------
    def stamp_and_sign(self):
        if not self.image_path:
            messagebox.showerror("Error", "No image selected.")
            return
        if not self.name_var.get() or not self.id_var.get():
            messagebox.showerror("Error", "Name and ID are required.")
            return

        try:
            self.update_status("Stamping image...")
            os.makedirs("assets/stamped", exist_ok=True)
            out_name = f"stamped_{self.id_var.get()}.png"
            self.output_path = os.path.join("assets/stamped", out_name)

            # embed_stamp may be slow; executed in background thread already
            embed_stamp(
                input_path=self.image_path,
                output_path=self.output_path,
                full_name=self.name_var.get(),
                validation_id=self.id_var.get(),
                validator_level=self.level_var.get()
            )
            self.update_status("Image stamped. Signing...")

            with open(self.output_path, "rb") as f:
                blob = f.read()

            # sign_trace_with_dilithium should support HSM-backed signing if implemented upstream
            result = sign_trace_with_dilithium(blob, algorithm=self.alg_var.get())
            if not isinstance(result, dict) or "signature" not in result:
                raise RuntimeError("Signing failed or returned unexpected result.")

            self.signature = result.get("signature")
            self.last_sign_result = result

            # update GUI from main thread
            self.root.after(0, lambda: self.show_preview(self.output_path))
            pk = result.get("public_key")
            self.root.after(0, lambda: self.show_qr(pk if pk else PUBLIC_KEY_URL))

            self.update_status("Stamping and signing complete.")
            self.root.after(0, lambda: self.show_signature_popup(result))
            self.log(f"Signed using {result.get('algorithm')}: signature length {len(self.signature or '')}")
        except Exception as e:
            tb = traceback.format_exc()
            self.log(f"Stamp & Sign failed: {e}\n{tb}")
            self._safe_messagebox("Error", f"Stamp & Sign failed: {e}")

    def show_signature_popup(self, result: dict):
        popup = tk.Toplevel(self.root)
        popup.title("Signature Metadata")
        popup.geometry("700x360")

        tk.Label(popup, text="Signature Metadata", font=("Arial", 14)).pack(pady=10)

        public_key = result.get("public_key", "N/A")
        sig = result.get("signature", "N/A")
        alg = result.get("algorithm", self.alg_var.get())

        meta_lines = [
            ("Trace ID", self.id_var.get()),
            ("Validator", self.name_var.get()),
            ("Algorithm", alg),
            ("Public Key (truncated)", (public_key[:96] + "...") if len(public_key) > 96 else public_key),
            ("Signature (truncated)", (sig[:96] + "...") if len(sig) > 96 else sig),
            ("Timestamp", datetime.datetime.utcnow().isoformat() + "Z"),
        ]

        frm = tk.Frame(popup, padx=12, pady=8)
        frm.pack(fill="both", expand=True)
        txt = tk.Text(frm, wrap="word", height=10)
        for k, v in meta_lines:
            txt.insert("end", f"{k}: {v}\n")
        txt.configure(state="disabled")
        txt.pack(fill="both", expand=True, padx=6, pady=6)

        btns = tk.Frame(popup)
        btns.pack(pady=6)
        tk.Button(btns, text="Copy Signature", command=lambda: self._copy_to_clipboard(sig)).pack(side="left", padx=8)
        tk.Button(btns, text="Export Entry JSON", command=lambda: self._export_entry_json(result)).pack(side="left", padx=8)
        tk.Button(btns, text="Close", command=popup.destroy).pack(side="left", padx=8)

    def _copy_to_clipboard(self, txt: str):
        if not txt:
            messagebox.showinfo("Nothing", "No data to copy.")
            return
        pyperclip.copy(txt)
        messagebox.showinfo("Copied", "Copied to clipboard.")

    def _export_entry_json(self, result: dict):
        entry = {
            "trace_id": self.id_var.get(),
            "validator": self.name_var.get(),
            "level": self.level_var.get(),
            "algorithm": result.get("algorithm", self.alg_var.get()),
            "public_key": result.get("public_key"),
            "signature": result.get("signature"),
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        }
        path = filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("JSON", "*.json")],
                                            initialfile=f"{self.id_var.get()}_entry.json")
        if not path:
            return
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(entry, f, indent=2)
            self.update_status(f"Exported registry entry to {path}")
        except Exception as e:
            self.log(f"Export error: {e}")
            messagebox.showerror("Export Error", str(e))

    # -----------------------
    # Registry interactions
    # -----------------------
    def push_registry(self):
        if not self.output_path or not self.signature:
            messagebox.showerror("Error", "No signed image to push.")
            return

        entry = {
            "trace_id": self.id_var.get(),
            "validator": self.name_var.get(),
            "level": self.level_var.get(),
            "algorithm": self.alg_var.get(),
            "signature": self.signature,
            "public_key": self.last_sign_result.get("public_key") if self.last_sign_result else None,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        }

        try:
            self.update_status("Pushing to registry...")
            push_to_registry(entry)  # expect this to raise on error if configured
            self.update_status("Entry pushed to registry.")
            messagebox.showinfo("Registry", "Entry pushed to registry.")
            self.log(f"Pushed registry entry for {entry['trace_id']}")
        except Exception as e:
            tb = traceback.format_exc()
            self.log(f"Registry push failed: {e}\n{tb}")
            messagebox.showerror("Registry Error", str(e))

    # -----------------------
    # Batch stamping
    # -----------------------
    def batch_stamp(self):
        folder = filedialog.askdirectory()
        if not folder:
            return

        attest = self.attest_on_chain_var.get()
        dry_run = self.dry_run_var.get()

        if not messagebox.askokcancel("Batch Confirm",
                                      f"Process all files in {folder}?\nAttest on-chain: {attest}\nDry-run: {dry_run}"):
            return

        def _batch():
            try:
                self.update_status("Starting batch stamping...")
                summary = batch_stamp_folder(
                    folder_path=folder,
                    full_name=self.name_var.get(),
                    validator_id=self.id_var.get(),
                    validator_level=self.level_var.get(),
                    algorithm=self.alg_var.get(),
                    attest_on_chain=attest,
                    dry_run=dry_run,
                    progress_callback=lambda s: self._append_batch_output(s)
                )
                self.update_status("Batch stamping complete.")
                self.root.after(0, lambda: messagebox.showinfo("Batch", f"Batch stamping complete.\nSummary: {summary}"))
                self.log(f"Batch stamping completed for folder {folder}: {summary}")
            except Exception as e:
                tb = traceback.format_exc()
                self.log(f"Batch stamping failed: {e}\n{tb}")
                self._safe_messagebox("Batch Error", str(e))

        threading.Thread(target=_batch, daemon=True).start()

    def _append_batch_output(self, text: str):
        self.batch_output_text.configure(state="normal")
        self.batch_output_text.insert("end", f"{now_iso()} {text}\n")
        self.batch_output_text.see("end")
        self.batch_output_text.configure(state="disabled")

    # -----------------------
    # Smart contract attestation
    # -----------------------
    def attest_contract(self):
        if not self.signature:
            messagebox.showerror("Error", "No signature to attest.")
            return
        try:
            self.update_status("Attesting on-chain...")
            tx_hash = attest_to_contract(self.id_var.get(), self.signature)
            self.update_status("Attestation complete.")
            messagebox.showinfo("Smart Contract", f"Attested on-chain.\nTx Hash: {tx_hash}")
            self.log(f"Attested {self.id_var.get()} on-chain: {tx_hash}")
        except Exception as e:
            tb = traceback.format_exc()
            self.log(f"Contract attestation failed: {e}\n{tb}")
            messagebox.showerror("Contract Error", str(e))

    # -----------------------
    # Audit log reload
    # -----------------------
    def reload_audit_log(self):
        try:
            if not os.path.exists(AUDIT_LOG_PATH):
                self.audit_text.configure(state="normal")
                self.audit_text.delete("1.0", "end")
                self.audit_text.insert("end", "No audit log found yet.\n")
                self.audit_text.configure(state="disabled")
                return
            with open(AUDIT_LOG_PATH, "r", encoding="utf-8") as f:
                lines = f.read()
            self.audit_text.configure(state="normal")
            self.audit_text.delete("1.0", "end")
            self.audit_text.insert("end", lines)
            self.audit_text.configure(state="disabled")
            self.update_status("Audit log reloaded")
        except Exception as e:
            self.log(f"Reload audit log failed: {e}")
            self._safe_messagebox("Audit Error", str(e))

    # -----------------------
    # Registry stub reload (placeholder)
    # -----------------------
    def _reload_registry_stub(self):
        # If you have a registry viewer reload endpoint, call it here.
        self.update_status("Registry reload requested (stub).")
        self.log("Registry reload stub called. Implement reload logic to fetch registry state.")

# small helper for timestamps used in batch output
def now_iso():
    return datetime.datetime.utcnow().isoformat() + "Z"


# --- Launch GUI ---
def main():
    root = tk.Tk()
    app = ValidatorGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()