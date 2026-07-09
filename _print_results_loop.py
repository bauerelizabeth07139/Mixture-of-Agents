from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx''')
text=p.read_text(encoding='utf-8')
# print surrounding of 'r.results?.map(' in both table and detail views
import re
for m in re.finditer(r"r\.results\?\.\map\(", text):
    idx = m.start()
    line = text[:idx].count('\n')+1
    print('\nFOUND at line', line)
    start = max(0, idx-500); end=min(len(text), idx+1200)
    snippet = text[start:end]
    for i,l in enumerate(snippet.splitlines(), text[:start].count('\n')+1):
        print(f'{i}: {l}')
