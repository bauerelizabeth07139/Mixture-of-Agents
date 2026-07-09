from pathlib import Path
import sys
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx''')
lines=p.read_text(encoding='utf-8').splitlines()
for start,end in [(465,530),(586,640),(641,706),(720,732)]:
    print(f'--- {start}-{end} ---')
    for i in range(start,end+1):
        print(f'{i}: {lines[i-1]}')
