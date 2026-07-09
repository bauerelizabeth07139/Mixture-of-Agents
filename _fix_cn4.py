path = r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 150 (0-indexed 149) - train problem
lines[149] = "    prompt: '一列火车9:00从A站出发，时速60公里。另一列火车10:00从B站（距A站300公里）出发，时速90公里朝A站行驶。两车何时相遇？请写出计算过程。',\n"

# Line 192 (0-indexed 191) - context test
lines[191] = "    prompt: '请先告诉我法国的首都是哪里。然后在同一个回答中告诉我：你刚才给出的第一个答案是什么？回答格式：\\n答案1: [首都]\\n答案2: [你重复的第一个答案]',\n"

# Also fix the evaluate regexes for the context test to accept Chinese format
lines[194] = "      if (/答案1.*Paris|答案1.*巴黎|Answer\\s*1.*Paris/i.test(r)) score += 3;\n"
lines[195] = "      if (/答案2.*Paris|答案2.*巴黎|Answer\\s*2.*Paris/i.test(r)) score += 4;\n"

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

# Verify
import re
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()
remaining = re.findall(r"prompt: '([A-Z][^']{20,})'", c)
if remaining:
    print(f"Still {len(remaining)} English prompts")
    for p in remaining: print(f"  {p[:80]}")
else:
    print("All prompts in Chinese!")