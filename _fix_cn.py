import re

path = r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts'

with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# ── Standard test prompts → Chinese ──

c = c.replace(
    "prompt: 'Write a Python function called \"fizzbuzz\" that takes an integer n and returns a list of strings from 1 to n where multiples of 3 become \"Fizz\", multiples of 5 become \"Buzz\", multiples of both become \"FizzBuzz\", others become the number as string. Return ONLY the function code.',",
    "prompt: '请用Python编写一个名为fizzbuzz的函数，输入整数n，返回从1到n的字符串列表：3的倍数返回\"Fizz\"，5的倍数返回\"Buzz\"，同时是3和5的倍数返回\"FizzBuzz\"，其余返回数字字符串。只返回函数代码。',"
)

c = c.replace(
    "prompt: 'This Python function returns the second largest number. It has a bug. Find it:\\n\\ndef second_largest(nums):\\n    unique = list(set(nums))\\n    unique.sort()\\n    return unique[-2]\\n\\nWhen does it fail? Give a one-sentence fix.',",
    "prompt: '以下Python函数用于返回第二大的数，但存在Bug。请找出Bug并用一句话给出修复方案：\\n\\ndef second_largest(nums):\\n    unique = list(set(nums))\\n    unique.sort()\\n    return unique[-2]',"
)

c = c.replace(
    "prompt: 'Implement a Python class for a min-heap with insert() and extract_min() methods. Include a test with 5 elements that inserts [3, 1, 5, 2, 4] and extracts all elements in order. Return ONLY the code.',",
    "prompt: '请用Python实现一个最小堆类，包含insert()和extract_min()方法。写一个测试：依次插入[3, 1, 5, 2, 4]，然后依次取出验证顺序。只返回代码。',"
)

c = c.replace(
    "prompt: 'A rectangle has length 17.5 cm and width 8.4 cm. Calculate: 1) Area in sq cm, 2) Perimeter in cm, 3) Diagonal in cm (2 decimal places). Give answers as: Area=X, Perimeter=Y, Diagonal=Z',",
    "prompt: '一个长方形，长17.5厘米，宽8.4厘米。请计算：1)面积（平方厘米），2)周长（厘米），3)对角线长度（保留2位小数）。格式为：面积=X，周长=Y，对角线=Z',"
)

c = c.replace(
    "prompt: 'Three boxes labeled \"Apples\", \"Oranges\", \"Mixed\" ALL have wrong labels. You pick one fruit from the \"Mixed\" box and it is an apple. What fruit is in each box? Give answers as: Apples box=X, Oranges box=Y, Mixed box=Z',",
    "prompt: '三个箱子分别标着\"苹果\"、\"橘子\"、\"混合\"，但所有标签都是错的。你从\"混合\"箱子中取出一个水果是苹果。请推断每个箱子实际装的是什么。格式：苹果箱=X，橘子箱=Y，混合箱=Z',"
)

c = c.replace(
    "prompt: 'A train leaves station A at 9:00 traveling 60km/h. Another train leaves station B (300km away) at 10:00 traveling 90km/h toward A. At what time do they meet? Show your calculation.',",
    "prompt: '一列火车9:00从A站出发，时速60公里。另一列火车10:00从B站（距A站300公里）出发，时速90公里朝A站行驶。两车何时相遇？请写出计算过程。',"
)

c = c.replace(
    "prompt: 'Respond with EXACTLY this format, no extra text:\\nName: [your model name]\\nDate: [today YYYY-MM-DD]\\nCapability: [one word]\\nCount: [sum of 7+8+9+10+11+12]\\nNothing else.',",
    "prompt: '请严格按照以下格式回复，不要添加任何其他内容：\\n名称: [你的模型名称]\\n日期: [今天的日期 YYYY-MM-DD]\\n能力: [一个词]\\n计算: [7+8+9+10+11+12的和]\\n除此之外不要输出任何内容。',"
)

c = c.replace(
    "prompt: 'First, tell me the capital of France. Then, in the SAME response, tell me: what was the first answer you just gave? This tests if you can maintain context within a single response.',",
    "prompt: '请先告诉我法国的首都是哪里。然后在同一个回答中告诉我：你刚才给出的第一个答案是什么？这是测试你能否在单次回答中保持上下文一致性。',"
)

c = c.replace(
    "prompt: 'List exactly 5 prime numbers between 50 and 100, in descending order, separated by commas. No explanation.',",
    "prompt: '请列出50到100之间恰好5个质数，按从大到小排列，用逗号分隔。不要解释。',"
)

c = c.replace(
    "prompt: 'Respond with ONLY the word \"echo\" and nothing else.',",
    "prompt: '请只回复\"echo\"这个词，不要输出任何其他内容。',"
)

c = c.replace(
    "prompt: 'If you can process audio input, describe what capabilities you have for speech recognition and audio understanding. If you cannot process audio, say \"no audio input support\".',",
    "prompt: '如果你能处理音频输入，请描述你在语音识别和音频理解方面的能力。如果你不能处理音频，请说\"不支持音频输入\"。',"
)

# ── Quick test prompts → Chinese ──

c = c.replace(
    "prompt: 'What is 347 + 258? Give only the number.',",
    "prompt: '347 + 258等于多少？只回答数字。',"
)

# ── Evaluate details → Chinese ──

c = c.replace("'Correct FizzBuzz'", "'FizzBuzz实现正确'")
c = c.replace("'Partial'", "'部分正确'")
c = c.replace("'Incorrect'", "'实现错误'")
c = c.replace("'Found the edge case bug'", "'找到了边界条件Bug'")
c = c.replace("'Did not find the real bug'", "'未找到真正Bug'")
c = c.replace("'Correct deduction'", "'推理正确'")
c = c.replace("'All correct'", "'全部正确'")
c = c.replace("'Exact format match'", "'格式完全匹配'")
c = c.replace("'Maintained context'", "'保持了上下文'")
c = c.replace("'Good instruction following'", "'指令遵循良好'")
c = c.replace("'Fast response'", "'响应速度快'")
c = c.replace("'Correct echo'", "'正确回复echo'")
c = c.replace("'No extra content'", "'无多余内容'")
c = c.replace("'Fast and correct'", "'快速且正确'")

# ── Multimodal evaluate → Chinese ──
c = c.replace("'Good description'", "'描述准确'")
c = c.replace("'Minimal description'", "'描述简略'")
c = c.replace("'Weak or no description'", "'描述不足或无描述'")

# ── Error messages → Chinese ──
c = c.replace("'Error: Promise rejected'", "'错误: 请求失败'")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print('All prompts and results translated to Chinese!')