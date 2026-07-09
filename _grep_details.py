from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts''')
for i,line in enumerate(p.read_text(encoding='utf-8').splitlines(),1):
    if 'details:' in line:
        print(f'{i}: {line}')
