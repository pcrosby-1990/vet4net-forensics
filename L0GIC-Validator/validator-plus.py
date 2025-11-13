import argparse, blake3, hmac, hashlib, os, json, datetime, csv, logging
from web3 import Web3

# --- Setup Logging ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# --- Registry I/O ---
def load_registry(path):
    return json.load(open(path)) if os.path.exists(path) else {}

def save_registry(registry, path):
    json.dump(registry, open(path, "w"), indent=2)

# --- Hashing Utilities ---
def hash_file(path):
    return blake3.blake3(open(path, "rb").read()).hexdigest()

def hash_snapshot_metadata(name, link, system, timestamp):
    combined = f"{name}|{link}|{system}|{timestamp}"
    return hashlib.sha256(combined.encode()).hexdigest()

# --- Signature Utilities ---
def sign_hash(hash_val, secret):
    return hmac.new(secret.encode(), hash_val.encode(), hashlib.sha256).hexdigest()

def verify_signature(hash_val, signature, secret):
    return hmac.compare_digest(sign_hash(hash_val, secret), signature)

# --- Subcommand: validate file or snapshot ---
def validate(args, registry):
    timestamp = args.timestamp or (datetime.datetime.utcnow().isoformat() + "Z")
    if args.file:
        label = os.path.basename(args.file)
        hash_val = hash_file(args.file)
        entry_data = {"hash": hash_val, "timestamp": timestamp}
    elif all([args.name, args.link, args.system]):
        label = args.name
        hash_val = hash_snapshot_metadata(args.name, args.link, args.system, timestamp)
        entry_data = {
            "hash": hash_val,
            "name": args.name,
            "link": args.link,
            "system": args.system,
            "timestamp": timestamp
        }
    else:
        logging.error("Missing required input. Provide either --file or snapshot metadata.")
        return

    logging.info(f"✅ Label: {label}")
    logging.info(f"🔑 Hash: {hash_val}")
    logging.info(f"🕒 Timestamp: {timestamp}")

    if args.sign:
        signature = sign_hash(hash_val, args.sign)
        entry_data["signature"] = signature
        registry[label] = entry_data
        save_registry(registry, args.registry)
        logging.info(f"✍️ Signature: {signature}")
        logging.info(f"📁 Registry updated: {args.registry}")
    elif args.verify:
        entry = registry.get(label)
        if not entry:
            logging.error(f"Entry '{label}' not found in registry.")
            return
        valid = verify_signature(hash_val, entry.get("signature", ""), args.verify)
        logging.info(f"🔐 Signature Valid: {'✅ Yes' if valid else '❌ No'}")

# --- Subcommand: batch ---
def batch(args):
    results = []
    for fname in os.listdir(args.batch):
        fpath = os.path.join(args.batch, fname)
        if not os.path.isfile(fpath):
            continue
        hash_val = hash_file(fpath)
        signature = sign_hash(hash_val, args.sign) if args.sign else None
        results.append({
            "filename": fname,
            "hash": hash_val,
            "signature": signature,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        })
    if args.export:
        with open(args.export, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=results[0].keys())
            writer.writeheader()
            writer.writerows(results)
        logging.info(f"✅ Batch results exported to {args.export}")

# --- Subcommand: snapshot CSV ---
def snapshot_csv(args):
    results = []
    with open(args.csv, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            hash_val = hash_snapshot_metadata(row["name"], row["link"], row["system"], row["timestamp"])
            signature = sign_hash(hash_val, args.sign) if args.sign else None
            results.append({
                "name": row["name"],
                "link": row["link"],
                "system": row["system"],
                "timestamp": row["timestamp"],
                "hash": hash_val,
                "signature": signature
            })
    if args.export:
        with open(args.export, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=results[0].keys())
            writer.writeheader()
            writer.writerows(results)
        logging.info(f"✅ Snapshot results exported to {args.export}")

# --- Subcommand: verify from registry ---
def verify_registry(args, registry):
    entry = registry.get(args.label)
    if not entry:
        logging.error(f"Entry '{args.label}' not found.")
        return
    hash_val = (
        hash_snapshot_metadata(entry["name"], entry["link"], entry["system"], entry["timestamp"])
        if all(k in entry for k in ["name", "link", "system", "timestamp"])
        else entry.get("hash")
    )
    valid = verify_signature(hash_val, entry.get("signature", ""), args.secret)
    logging.info(f"\n✅ Label: {args.label}")
    logging.info(f"🔑 Hash: {hash_val}")
    logging.info(f"🕒 Timestamp: {entry.get('timestamp', 'N/A')}")
    logging.info(f"📁 Registry Match: ✅ Yes")
    logging.info(f"🔐 Signature Valid: {'✅ Yes' if valid else '❌ No'}")

# --- Subcommand: push to Ethereum ---
def push_to_chain(args, registry):
    entry = registry.get(args.label)
    if not entry:
        logging.error(f"Entry '{args.label}' not found.")
        return
    hash_val = entry["hash"]
    w3 = Web3(Web3.HTTPProvider(args.rpc))
    acct = w3.eth.account.from_key(args.key)
    with open(args.abi) as f:
        abi = json.load(f)
    contract = w3.eth.contract(address=args.contract, abi=abi)
    tx = contract.functions.verifyMetadata(Web3.toBytes(hexstr=hash_val)).build_transaction({
        "from": acct.address,
        "nonce": w3.eth.get_transaction_count(acct.address),
        "gas": 200000,
        "gasPrice": w3.eth.gas_price
    })
    signed = acct.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    logging.info(f"🌐 Pushed hash on-chain: {tx_hash.hex()}")

# --- Subcommand: clear ---
def clear_entry(args, registry):
    if args.label in registry:
        del registry[args.label]
        save_registry(registry, args.registry)
        logging.info(f"🧹 Cleared '{args.label}' from registry.")
    else:
        logging.error(f"❌ '{args.label}' not found in registry.")

# --- Main CLI ---
def main():
    parser = argparse.ArgumentParser(description="Validator Plus CLI")
    parser.add_argument("--registry", default="registry.json", help="Registry file path")
    subparsers = parser.add_subparsers(dest="command")

    # Validate
    validate_cmd = subparsers.add_parser("validate")
    validate_cmd.add_argument("--file")
    validate_cmd.add_argument("--name")
    validate_cmd.add_argument("--link")
    validate_cmd.add_argument("--system")
    validate_cmd.add_argument("--timestamp")
    validate_cmd.add_argument("--sign")
    validate_cmd.add_argument("--verify")

    # Batch
    batch_cmd = subparsers.add_parser("batch")
    batch_cmd.add_argument("--batch", required=True)
    batch_cmd.add_argument("--sign")
    batch_cmd.add_argument("--export")

    # Snapshot CSV
    csv_cmd = subparsers.add_parser("snapshot")
    csv_cmd.add_argument("--csv", required=True)
    csv_cmd.add_argument("--sign")
    csv_cmd.add_argument("--export")

    # Verify from registry
    verify_cmd = subparsers.add_parser("verify")
    verify_cmd.add_argument("--label", required=True)
    verify_cmd.add_argument("--secret", required=True)

    # Push to Ethereum
    push_cmd = subparsers.add_parser("push")
    push_cmd.add_argument("--label", required=True)
    push_cmd.add_argument("--rpc", required=True)
    push_cmd.add_argument("--contract", required=True)
    push_cmd.add_argument("--abi", required=True)
    push_cmd.add_argument("--key", required=True)

    # Clear
    clear_cmd = subparsers.add_parser("clear")
    clear_cmd.add_argument("--label", required=True)

    args = parser.parse_args()
    registry = load_registry(args.registry)

    if args.command == "validate":
        validate(args, registry)
    elif args.command == "batch":
        batch(args)
    elif args.command == "snapshot":
        snapshot_csv(args)
    elif args.command == "verify":
        verify_registry(args, registry)
    elif args.command == "push":
        push_to_chain(args, registry)
    elif args.command == "clear":
        clear_entry(args, registry)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
