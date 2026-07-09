from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\index.ts''')
lines=p.read_text(encoding='utf-8').splitlines()
for i in range(max(1,len(lines)-40), len(lines)+1):
    print(f'{i}: {lines[i-1]}')
