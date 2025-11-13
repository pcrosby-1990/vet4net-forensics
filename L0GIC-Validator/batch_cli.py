import argparse
from batch_stamper import batch_stamp_folder

def main():
    parser = argparse.ArgumentParser(description="Batch Stamp CLI")
    parser.add_argument("--folder", required=True, help="Folder containing PNG images")
    parser.add_argument("--name", required=True, help="Validator full name")
    parser.add_argument("--id", required=True, help="Validator ID")
    parser.add_argument("--level", choices=["bronze", "silver", "gold", "diamond"], default="silver", help="Validator level")
    parser.add_argument("--alg", choices=["Dilithium2", "Dilithium3", "Dilithium5"], default="Dilithium2", help="Signature algorithm")
    parser.add_argument("--attest", action="store_true", help="Push signatures to smart contract")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without writing files")
    parser.add_argument("--csv", action="store_true", help="Export CSV summary")

    args = parser.parse_args()

    batch_stamp_folder(
        folder_path=args.folder,
        full_name=args.name,
        validator_id=args.id,
        validator_level=args.level,
        algorithm=args.alg,
        attest_on_chain=args.attest,
        dry_run=args.dry_run
    )

if __name__ == "__main__":
    main()
