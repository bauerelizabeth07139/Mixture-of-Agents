path = r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove duplicate evaluate line at 195 (0-indexed 194)
if '    evaluate: (r) => {' in lines[193] and '    evaluate: (r) => {' in lines[194]:
    del lines[194]
    print("Removed duplicate evaluate line")

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Fixed!")