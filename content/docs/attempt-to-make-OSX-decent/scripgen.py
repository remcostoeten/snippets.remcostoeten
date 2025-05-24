#!/usr/bin/env python3

from pathlib import Path

def say_echo(message: str) -> str:
    return f'echo "\\033[1;36m▶ {message}\\033[0m"'

def main():
    print("🔧 Shell Script Generator")

    program = input("📦 Program name (e.g. Homebrew): ").strip()
    command = input("💻 Command to run (multiline allowed, end with empty line):\n")

    lines = []
    print("➡️  Type command lines (one per line), empty line to finish:")
    while True:
        line = input("> ")
        if line.strip() == "":
            break
        lines.append(line.strip())

    extra = input("📝 Additional context or setup (optional): ").strip()

    # Build script content
    out = []
    out.append("#!/bin/bash")
    out.append("")
    out.append(say_echo(f"Installing {program}"))
    out += lines
    if extra:
        out.append("")
        out.append(say_echo("Additional setup"))
        out.append(extra)
    out.append("")
    out.append(say_echo("✅ Done"))

    # Save
    filename = f"install_{program.lower().replace(' ', '_')}.sh"
    Path(filename).write_text("\n".join(out))
    print(f"\n✅ Script written to: {filename}")

if __name__ == "__main__":
    main()

