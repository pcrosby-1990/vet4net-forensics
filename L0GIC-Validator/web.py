from flask import Flask, request, render_template, jsonify
import os, json, datetime, blake3, hmac, hashlib

app = Flask(__name__)
REGISTRY_PATH = "registry.json"

# Load registry
def load_registry():
    if os.path.exists(REGISTRY_PATH):
        with open(REGISTRY_PATH, "r") as f:
            return json.load(f)
    return {}

# Save registry
def save_registry(registry):
    with open(REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=2)

# Hash file contents
def hash_file(data):
    return blake3.blake3(data).hexdigest()

# Sign hash with secret key
def sign_hash(hash_val, secret_key):
    return hmac.new(secret_key.encode(), hash_val.encode(), hashlib.sha256).hexdigest()

# Luhn check for ID validation
def luhn_check(id_str):
    digits = [int(d) for d in id_str if d.isdigit()]
    checksum = 0
    reverse = digits[::-1]
    for i, d in enumerate(reverse):
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        checksum += d
    return checksum % 10 == 0

# Dashboard route
@app.route("/", methods=["GET"])
def dashboard():
    return render_template("dashboard.html")

# File validation and registration
@app.route("/validate", methods=["POST"])
def validate_contract():
    file = request.files.get("contract")
    secret = request.form.get("secret")
    if not file or not secret:
        return "Missing file or secret", 400

    data = file.read()
    filename = file.filename
    hash_val = hash_file(data)
    signature = sign_hash(hash_val, secret)
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"

    registry = load_registry()
    if filename in registry:
        return f"{filename} already exists in registry.", 409

    registry[filename] = {
        "hash": hash_val,
        "signature": signature,
        "timestamp": timestamp
    }
    save_registry(registry)

    return jsonify({
        "filename": filename,
        "hash": hash_val,
        "signature": signature,
        "timestamp": timestamp,
        "status": "Registered"
    })

# Registry viewer route
@app.route("/registry")
def registry_view():
    registry = load_registry()
    return render_template("registry.html", registry=registry)

# Luhn validation route
@app.route("/luhn", methods=["POST"])
def validate_luhn():
    id_str = request.form.get("id")
    if not id_str:
        return "Missing ID", 400

    is_valid = luhn_check(id_str)
    return jsonify({
        "id": id_str,
        "valid": is_valid
    })

if __name__ == "__main__":
    app.run(debug=True)
