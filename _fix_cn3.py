path = r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts'

with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# These two were missed because they have different prefix patterns
c = c.replace(
    "prompt: 'A train leaves station A at 9:00 traveling 60km/h. Another train leaves station B (300km away) at 10:00 traveling 90km/h toward A. At what time do they meet? Show your calculation.',",
    "prompt: '一列火车9:00从A站出发，时速60公里。另一列火车10:00从B站（距A站300公里）出发，时速90公里朝A站行驶。两车何时相遇？请写出计算过程。',"
)

c = c.replace(
    "prompt: 'First, tell me the capital of France. Then, in the SAME response, tell me: what was the first answer you just gave? This tests if you can maintain context within a single response.',",
    "prompt: '请先告诉我法国的首都是哪里。然后在同一个回答中告诉我：你刚才给出的第一个答案是什么？这是测试你能否在单次回答中保持上下文一致性。',"
)

# Verify
import re
remaining = re.findall(r"prompt: '([A-Z][^']{20,})'", c)
if remaining:
    print("Still English:")
    for p in remaining:
        print(f"  {p[:100]}")
else:
    print("All clean!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("Done!")