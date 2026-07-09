from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx''')
b=p.read_bytes()
# BOM check
print('bom_utf8', b[:3]==b'\xef\xbb\xbf')
print('size', len(b))
# Try encodings for snippet around line 715 byte offset maybe
text_utf8=b.decode('utf-8')
line715=text_utf8.splitlines()[714]
print('LINE715_UTF8', line715)
# Try if file is actually GBK
try:
    text_gbk=b.decode('gbk')
    line715g=text_gbk.splitlines()[714]
    print('LINE715_GBK', line715g)
except Exception as e:
    print('GBK_FAIL', e)
