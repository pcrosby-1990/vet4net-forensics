import tkinter as tk
from tkinter import ttk, messagebox
import json
import os
import pyperclip
from PIL import Image, ImageTk

REGISTRY_PATH = "assets/registry.json"
STAMPED_DIR = "assets/stamped"
QR_DIR = "assets/qr"

class RegistryViewer:
    def __init__(self, root):
        self.root = root
        self.root.title("Registry Viewer")
        self.root.geometry("1000x600")

        self.entries = self.load_registry()
        self.filtered = self.entries.copy()

        self.build_filters()
        self.build_table()
        self.build_preview()

    def load_registry(self):
        if not os.path.exists(REGISTRY_PATH):
            return []
        with open(REGISTRY_PATH, "r") as f:
            return json.load(f)

    def build_filters(self):
        frame = tk.Frame(self.root)
        frame.pack(pady=10)

        self.search_var = tk.StringVar()
        tk.Label(frame, text="Filter by Validator:").pack(side="left")
        tk.Entry(frame, textvariable=self.search_var, width=30).pack(side="left", padx=5)
        tk.Button(frame, text="Apply Filter", command=self.apply_filter).pack(side="left", padx=5)
        tk.Button(frame, text="Reset", command=self.reset_filter).pack(side="left", padx=5)

    def build_table(self):
        self.tree = ttk.Treeview(self.root, columns=("trace_id", "validator", "algorithm", "timestamp"), show="headings")
        self.tree.heading("trace_id", text="Trace ID")
        self.tree.heading("validator", text="Validator")
        self.tree.heading("algorithm", text="Algorithm")
        self.tree.heading("timestamp", text="Timestamp")
        self.tree.pack(fill="both", expand=True)
        self.tree.bind("<Double-1>", self.show_details)

        self.refresh_table()

    def build_preview(self):
        self.preview_frame = tk.Frame(self.root)
        self.preview_frame.pack(pady=10)

        self.image_label = tk.Label(self.preview_frame, text="Stamped Image Preview")
        self.image_label.pack()
        self.image_canvas = tk.Canvas(self.preview_frame, width=400, height=300, bg="gray")
        self.image_canvas.pack()

        self.qr_label = tk.Label(self.preview_frame, text="QR Code Preview")
        self.qr_label.pack()
        self.qr_canvas = tk.Canvas(self.preview_frame, width=150, height=150, bg="white")
        self.qr_canvas.pack()

    def refresh_table(self):
        for row in self.tree.get_children():
            self.tree.delete(row)
        for entry in self.filtered:
            self.tree.insert("", "end", values=(entry["trace_id"], entry["validator"], entry["algorithm"], entry["timestamp"]))

    def apply_filter(self):
        query = self.search_var.get().lower()
        self.filtered = [e for e in self.entries if query in e["validator"].lower()]
        self.refresh_table()

    def reset_filter(self):
        self.search_var.set("")
        self.filtered = self.entries.copy()
        self.refresh_table()

    def show_details(self, event):
        selected = self.tree.focus()
        if not selected:
            return
        values = self.tree.item(selected, "values")
        trace_id = values[0]

        entry = next((e for e in self.entries if e["trace_id"] == trace_id), None)
        if not entry:
            return

        # Show image preview
        img_path = os.path.join(STAMPED_DIR, f"stamped_{trace_id}.png")
        if os.path.exists(img_path):
            img = Image.open(img_path).resize((400, 300))
            self.tk_img = ImageTk.PhotoImage(img)
            self.image_canvas.create_image(0, 0, anchor="nw", image=self.tk_img)

        # Show QR preview
        qr_path = os.path.join(QR_DIR, f"qr_{trace_id}.png")
        if os.path.exists(qr_path):
            qr = Image.open(qr_path).resize((150, 150))
            self.tk_qr = ImageTk.PhotoImage(qr)
            self.qr_canvas.create_image(0, 0, anchor="nw", image=self.tk_qr)

        # Show metadata popup
        meta = f"""
Trace ID: {entry['trace_id']}
Validator: {entry['validator']}
Algorithm: {entry['algorithm']}
Public Key: {entry['public_key'][:64]}...
Signature: {entry['signature'][:64]}...
Timestamp: {entry['timestamp']}
        """.strip()

        popup = tk.Toplevel(self.root)
        popup.title("Trace Metadata")
        popup.geometry("600x300")

        text = tk.Text(popup, wrap="word", height=10)
        text.insert("1.0", meta)
        text.pack(padx=10, pady=10)

        def copy_sig():
            pyperclip.copy(entry["signature"])
            messagebox.showinfo("Copied", "Signature copied to clipboard.")

        tk.Button(popup, text="Copy Signature", command=copy_sig).pack(pady=5)

# --- Launch Viewer ---
if __name__ == "__main__":
    root = tk.Tk()
    app = RegistryViewer(root)
    root.mainloop()
