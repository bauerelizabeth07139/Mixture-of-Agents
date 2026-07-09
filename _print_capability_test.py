from pathlib import Path
import os
root=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services''')
for name in ['capability-test.ts','capability-test-engine.ts','capability_test.ts']:
    p=root/name
    if p.exists():
        print('FILE',p)
        print(p.read_text(encoding='utf-8'))
        raise SystemExit
print('NO_CAPABILITY_FILE')
