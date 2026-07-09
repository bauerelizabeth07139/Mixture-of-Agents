with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the second "// --- Main App ---" or second "interface ChatMsg" and remove everything from there to end
# Keep only up to line 809 (the ExtensionsPanel closing) + the worker's App component (lines 810+)

# Find the first "export default function App()" or "export default App;"
first_export = None
second_export = None
for i, line in enumerate(lines):
    if 'export default' in line and 'App' in line:
        if first_export is None:
            first_export = i
        else:
            second_export = i
            break

print(f"First export at line {first_export + 1}, second at line {(second_export or 0) + 1}")

if second_export is not None:
    # Find where the second App section starts - look for "// -- Main App --" or "interface ChatMsg" before it
    # Go backwards from second_export to find the start of the duplicate block
    start_remove = None
    for i in range(second_export, first_export, -1):
        if '// --- Main App ---' in lines[i] or '// ─── Main App ───' in lines[i]:
            start_remove = i
            break
        if lines[i].startswith('interface ChatMsg') or lines[i].startswith('// ChatMsg'):
            start_remove = i
            break
    
    if start_remove is None:
        # Just remove from the blank line before the second interface ChatMsg
        for i in range(second_export, first_export, -1):
            if 'interface ChatMsg' in lines[i]:
                start_remove = i
                break
    
    if start_remove is not None:
        print(f"Removing lines {start_remove + 1} to {len(lines)} (keeping 1 to {start_remove})")
        lines = lines[:start_remove]
        
        with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Fixed!")
    else:
        print("Could not find start of duplicate block")
else:
    print("No duplicate found")