from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx''')
lines=p.read_text(encoding='utf-8').splitlines()
# find ChatMessage function
for idx,line in enumerate(lines,1):
    if 'function ChatMessage' in line:
        start=max(1, idx-2); end=min(len(lines), idx+120)
        print(f'--- {start}-{end} ---')
        for i in range(start,end+1):
            print(f'{i}: {lines[i-1]}')
        break
