path = r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts'

with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "You are a helpful assistant. Follow instructions precisely.",
    "你是一个有用的助手。请严格按照指令回答。"
)

c = c.replace(
    'Describe this image. State: 1) main object, 2) dominant color, 3) approximate count of distinct objects.',
    '请描述这张图片。说明：1) 主要物体，2) 主要颜色，3) 不同物体的大致数量。'
)

c = c.replace(
    'Please read this sentence aloud: "The quick brown fox jumps over the lazy dog. Today is a beautiful day for testing."',
    '请朗读以下句子："敏捷的棕色狐狸跳过了懒狗。今天是测试的好日子。"'
)

# Also translate the standalone multimodal evaluate
c = c.replace(
    "Describe this image. State: 1) main object, 2) dominant color, 3) approximate count of distinct objects.",
    "请描述这张图片。说明：1) 主要物体，2) 主要颜色，3) 不同物体的大致数量。"
)

# Check for any remaining English test prompts
import re
english_prompts = re.findall(r"prompt: '([A-Z][^']{20,})'", c)
if english_prompts:
    print("WARNING: Still have English prompts:")
    for p in english_prompts:
        print(f"  - {p[:80]}...")
else:
    print("All prompts are in Chinese!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("Done!")