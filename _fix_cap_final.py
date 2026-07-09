from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts''')
lines=p.read_text(encoding='utf-8').splitlines()

# Line 170 (0-indexed 169): runFullTest capabilities - add visionScore/audioScore before pricing
for i,line in enumerate(lines):
    if i==169:
        lines[i]="      multimodal: model.capabilities.multimodal, visionScore: 0, audioScore: 0, pricing: model.capabilities.pricing,"
    # Line 208 (0-indexed 207): runQuickTest capabilities - fix duplicate
    if i==207:
        lines[i]="        multimodal: model.capabilities.multimodal, visionScore: 0, audioScore: 0, pricing: model.capabilities.pricing,"

p.write_text('\n'.join(lines), encoding='utf-8')
print('fixed')
