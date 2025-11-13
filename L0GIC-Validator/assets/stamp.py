def embed_stamp(
    input_path,
    output_path,
    full_name="Patrick Crosby",
    fingerprint="ed25519: 9f2a...c7e1",
    validated_count=1,
    validation_id="00000000",
    signature=None,
    metadata_url="https://etherscan.io/address/0x74191d893DB82BE9955Ed5fB95fe2d8F69D35395",
    qr_img=None,
    validator_level="emerald"  # Options: iron, silver, gold, diamond, emerald
):
    img = Image.open(input_path).convert("RGBA")
    stamp = Image.new("RGBA", (480, 200), (255, 255, 255, 45))
    draw = ImageDraw.Draw(stamp)

    try:
        font = ImageFont.truetype("fonts/arialbd.ttf", 15)
    except:
        font = ImageFont.load_default()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S PDT")
    original_hash = hash_image(input_path)
    hidden_watermark = generate_watermark(full_name, validation_id, timestamp)

    # Draw layout
    draw.text((15, 10), "L0GIC-Validator", fill="white", font=font)
    draw.text((15, 45), f"Validation ID: {validation_id}", fill="white", font=font)
    draw.text((15, 70), f"Validated by: {full_name}", fill="white", font=font)
    draw.text((15, 95), f"Files Validated: {validated_count} as of {timestamp}", fill="white", font=font)
    draw.text((15, 120), "Metadata:", fill="white", font=font)
    draw.text((30, 140), "https://etherscan.io/address/", fill="blue", font=font)
    draw.text((30, 160), "0x74191d893DB82BE9955Ed5fB95fe2d8F69D35395", fill="blue", font=font)

    # Paste QR code
    if qr_img:
        qr_img_resized = qr_img.resize((70, 70))
        stamp.paste(qr_img_resized, (390, 110), qr_img_resized)

    # Badge logic with fallback
    badge_path = f"assets/badges/{validator_level}_badge.png"
    badge_status = "loaded"
    if not os.path.exists(badge_path):
        badge_path = "assets/badges/default_badge.png"
        badge_status = "fallback"
        print(f"[WARN] Badge not found for level '{validator_level}', using default.")

    if os.path.exists(badge_path):
        badge = Image.open(badge_path).convert("RGBA")
        badge_resized = badge.resize((40, 40))
        stamp.paste(badge_resized, (15, 155), badge_resized)

    draw.rectangle([(0, 0), (479, 199)], outline="white", width=2)
    position = (img.width - stamp.width - 10, img.height - stamp.height - 10)
    img.alpha_composite(stamp, position)

    # Metadata block
    metadata_string = (
        f"Signer: {full_name}\n"
        f"Validator Level: {validator_level}\n"
        f"Files Validated: {validated_count}\n"
        f"Timestamp: {timestamp}\n"
        f"Validation ID: {validation_id}\n"
        f"Fingerprint: {fingerprint}\n"
        f"Signature: {signature}\n"
        f"Original SHA256: {original_hash}\n"
        f"Metadata URL: {metadata_url}\n"
        f"BadgeLevel: {validator_level}\n"
        f"BadgeSourcePath: {badge_path}\n"
        f"BadgeStatus: {badge_status}"
    )

    img.save(output_path, format="PNG", pnginfo=create_pnginfo(metadata_string, hidden_watermark))
