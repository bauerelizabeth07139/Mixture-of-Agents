from pathlib import Path
p=Path(r"C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx")
text=p.read_text(encoding='utf-8')
patterns=['鈿欙笍','馃','鈻?','鈼?','鈼︼笍','鎻','鐜','閫','涓','锛?']
for pat in patterns:
    if pat in text:
        print('FOUND', repr(pat))
print('=== mojibake lines ===')
for i,line in enumerate(text.splitlines(),1):
    if any(pat in line for pat in patterns):
        print(i, line)
