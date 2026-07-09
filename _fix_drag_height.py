import re

# ── Fix 1: CSS - taller prompt input ──
css_path = r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\styles\global.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Change min-height from 24px to 44px for a taller default
css = css.replace(
    '.prompt-input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  color: var(--text-primary);\n  font-size: 14px;\n  line-height: 1.5;\n  resize: none;\n  outline: none;\n  min-height: 24px;\n  max-height: 200px;',
    '.prompt-input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  color: var(--text-primary);\n  font-size: 14px;\n  line-height: 1.5;\n  resize: none;\n  outline: none;\n  min-height: 44px;\n  max-height: 240px;'
)

# Also make the prompt-wrapper padding a bit taller
css = css.replace(
    '.prompt-wrapper {\n  display: flex;\n  align-items: flex-end;\n  gap: 8px;\n  background: var(--bg-tertiary);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-lg);\n  padding: 8px 12px;',
    '.prompt-wrapper {\n  display: flex;\n  align-items: flex-end;\n  gap: 8px;\n  background: var(--bg-tertiary);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-lg);\n  padding: 10px 14px;'
)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print('CSS fixed: min-height 24->44px, padding increased')


# ── Fix 2: App.tsx - fix drag-drop and textarea height ──
app_path = r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

changed = 0

for i, line in enumerate(lines):
    # Fix dragover: add dropEffect to actually allow drops
    if "const onOver = (e: DragEvent)" in line and "dropEffect" not in line:
        lines[i] = line.replace(
            "e.preventDefault(); e.stopPropagation(); if (e.dataTransfer?.types.includes('Files')) setDragging(true);",
            "e.preventDefault(); e.stopPropagation(); if (e.dataTransfer) { e.dataTransfer.dropEffect = 'copy'; setDragging(true); }"
        )
        changed += 1
        print(f"Fixed dragover at line {i+1}")

    # Fix dragenter: same
    if "const onEnter = (e: DragEvent)" in line and "dropEffect" not in line:
        lines[i] = line.replace(
            "e.preventDefault(); dragCounterRef.current++; if (e.dataTransfer?.types.includes('Files')) setDragging(true);",
            "e.preventDefault(); dragCounterRef.current++; if (e.dataTransfer) { e.dataTransfer.dropEffect = 'copy'; setDragging(true); }"
        )
        changed += 1
        print(f"Fixed dragenter at line {i+1}")

    # Fix textarea height: change Math.max(24, ...) to Math.max(44, ...)
    if "Math.min(120, Math.max(24," in line:
        lines[i] = line.replace("Math.max(24,", "Math.max(44,")
        changed += 1
        print(f"Fixed textarea height at line {i+1}")

    # Fix rows={1} to rows={2}
    if 'rows={1} style={{ height: Math' in line:
        lines[i] = line.replace('rows={1}', 'rows={2}')
        changed += 1
        print(f"Fixed rows at line {i+1}")

with open(app_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print(f'Total changes: {changed}')