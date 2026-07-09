from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts''')
lines=p.read_text(encoding='utf-8').splitlines()
for start,end in [(155,170),(195,215)]:
    print(f'--- {start}-{end} ---')
    for i in range(start,end+1):
        print(f'{i}: {lines[i-1]}')
