from nacl.signing import SigningKey

# Generate a new key pair
signing_key = SigningKey.generate()
verify_key = signing_key.verify_key

# Save keys as hex
private_key_hex = signing_key.encode().hex()
public_key_hex = verify_key.encode().hex()

print("Private Key:", 9104426b4506a2bec6e1be537c2d923064d45dfe1bf9d87e9ea5336ed9ad3cbb)
print("Public Key:", 74191d893DB82BE9955Ed5fB95fe2d8F69D35395)
