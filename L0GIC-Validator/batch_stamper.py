import os
import csv
import datetime
from PIL import Image
import qrcode

from validator.stamp import embed_stamp
from sign_trace import sign_trace_with_dilithium
from registry import create_registry_entry, save_registry_entry
from contract import push_to_contract

def batch_stamp_folder(
    folder_path: str,
    full_name: str,
    validator_id: str,
    validator_level: str,
    algorithm: str = "Dilithium2",
    attest_on_chain: bool = False,
    dry_run: bool = False
):
    """
    Stamps and signs all PNG images in a folder.

    Args:
        folder_path (str): Path to folder containing .png files.
        full_name (str): Validator's full name.
        validator_id (str): Unique validator ID.
        validator_level (str): bronze, silver, gold, diamond.
        algorithm (str): Dilithium variant.
        attest_on_chain (bool): Whether to push each signature to a smart contract.
        dry_run (bool): If True, simulate without writing files.
    """
    stamped_dir = "assets/stamped"
    qr_dir = "assets/qr"
    os.makedirs(stamped_dir, exist_ok=True)
    os.makedirs(qr_dir, exist_ok=True)

    files = [f for f in os.listdir(folder_path) if f.lower().endswith(".png")]
    if not files:
        print("❌ No PNG files found in folder.")
        return

    summary = []
    print(f"\n📦 Starting batch stamp for {len(files)} images...\n")

    for filename in files:
        try:
            trace_id = os.path.splitext(filename)[0]
            input_path = os.path.join(folder_path, filename)
            output_path = os.path.join(stamped_dir, f"stamped_{trace_id}.png")
            qr_path = os.path.join(qr_dir, f"qr_{trace_id}.png")

            if not dry_run:
                # Step 1: Embed stamp
                embed_stamp(
                    input_path=input_path,
                    output_path=output_path,
                    full_name=full_name,
                    validation_id=validator_id,
                    validator_level=validator_level
                )

            # Step 2: Sign with Dilithium
            with open(input_path if dry_run else output_path, "rb") as f:
                digest = f.read()

            result = sign_trace_with_dilithium(digest, algorithm)

            # Step 3: Save to registry
            entry = create_registry_entry(
                trace_id=trace_id,
                digest=digest,
                signature=result["signature"],
                public_key=result["public_key"],
                algorithm=result["algorithm"]
            )

            if not dry_run:
                save_registry_entry(entry)

            # Step 4: Optional smart contract attestation
            tx_hash = ""
            if attest_on_chain and not dry_run:
                tx_hash = push_to_contract(
                    trace_id=trace_id,
                    digest=digest.hex(),
                    signature=result["signature"],
                    public_key=result["public_key"],
                    algorithm=result["algorithm"]
                )
                print(f"🪙 Attested {trace_id} → TX: {tx_hash}")

            # Step 5: Generate QR code
            if not dry_run:
                qr = qrcode.QRCode(version=1, box_size=4, border=2)
                qr.add_data(f"https://etherscan.io/address/0x{result['public_key'][:40]}")
                qr.make(fit=True)
                img_qr = qr.make_image(fill="black", back_color="white")
                img_qr.save(qr_path)

            # Step 6: Add to summary
            summary.append({
                "trace_id": trace_id,
                "validator": full_name,
                "level": validator_level,
                "algorithm": algorithm,
                "signature": result["signature"],
                "public_key": result["public_key"],
                "tx_hash": tx_hash,
                "timestamp": datetime.datetime.utcnow().isoformat()
            })

            print(f"✅ Processed: {filename}")

        except Exception as e:
            print(f"❌ Failed: {filename} — {e}")

    # Step 7: Export CSV summary
    if not dry_run:
        csv_path = os.path.join(stamped_dir, "batch_summary.csv")
        with open(csv_path, "w", newline="") as csvfile:
            fieldnames = ["trace_id", "validator", "level", "algorithm", "signature", "public_key", "tx_hash", "timestamp"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(summary)
        print(f"\n📄 Summary CSV saved to: {csv_path}")

    print(f"\n🎉 Batch complete. {len(summary)} images processed.")
    if dry_run:
        print("🧪 Dry run mode: no files were written.")

