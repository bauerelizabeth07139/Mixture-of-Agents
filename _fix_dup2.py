with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove lines 811-1082 (0-indexed 810-1081) which is the first App function
# Keep lines 1-810 (0-indexed 0-809) which is the component/helper code
# Keep lines 1083+ (0-indexed 1082+) which is the second (our) App function

# Find where ExtensionsPanel ends (before line 811)
# Line 810 should be blank or "// -- Main App --"
print(f"Line 810: {lines[809].rstrip()}")
print(f"Line 811: {lines[810].rstrip()}")

# Remove lines 811 to 1082 (inclusive)
new_lines = lines[:810] + lines[1082:]
print(f"Original: {len(lines)} lines, new: {len(new_lines)} lines")

with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Fixed!")