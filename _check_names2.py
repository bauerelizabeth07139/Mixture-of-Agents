import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        stripped = line.strip()
        if stripped.startswith('name:') and not stripped.startswith('name: string') and i < 360:
            print(f'{i}: {stripped}')