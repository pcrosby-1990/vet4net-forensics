import argparse
import os
from validator.stamp import embed_stamp

def main():
    parser = argparse.ArgumentParser(description="L0GIC Validator Stamp Engine")
    parser.add_argument("--input", required=True, help="Path to input image")
    parser.add_argument("--output", required=True, help="Path to save stamped image")
    parser.add_argument("--name", required=True, help="Full name of validator")
    parser.add_argument("--id", required=True, help="Validation ID")
    parser.add_argument("--level", choices=["bronze", "silver", "gold", "diamond"], default="silver", help="Validator level")
    args = parser.parse_args()

    # Validate input file
    if not os.path.isfile(args.input):
        raise FileNotFoundError(f"Input file not found: {args.input}")

    # Create output directory if needed
    os.makedirs(os.path.dirname(args.output), exist_ok=True)

    # Run stamp embedding
    embed_stamp(
        input_path=args.input,
        output_path=args.output,
        full_name=args.name,
        validation_id=args.id,
        validator_level=args.level
    )

    print(f"✅ Stamp embedded successfully for {args.name} (Level: {args.level})")
    print(f"📁 Output saved to: {args.output}")

if __name__ == "__main__":
    main()
