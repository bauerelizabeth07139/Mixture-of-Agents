from pathlib import Path
import re
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts''')
text=p.read_text(encoding='utf-8')
for m in re.finditer(r"name:\s*'([^']+)'", text):
    print('NAME', m.group(1))
print('---DETAILS---')
for m in re.finditer(r"details:\s*'([^']+)'", text):
    print('DETAIL', m.group(1))
