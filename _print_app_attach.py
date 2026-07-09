from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx''')
text=p.read_text(encoding='utf-8').split('\n')
for line in text:
    if 'AttachmentPreview' in line or 'attach' in line.lower() and ('message' in line.lower() or 'chat' in line.lower()):
        pass
# print blocks around attachments state declaration and message list
for start,end in [(890,926),(1112,1140)]:
    print(f'--- {start}-{end} ---')
    for i in range(start,end+1):
        print(f'{i}: {text[i-1]}')
