with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\orchestrator\orchestrator.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix line 412 (0-indexed 411) - rename the map variable to avoid collision
old = '        model: m,'
new = '        _model: m,'
# But we also need to update references to scored[0].model
# Actually, the issue is that findProviderForModel returns {model, provider, apiKey}
# and we also have model: m. The spread ...this.poolManager.findProviderForModel(m.id)!
# overwrites model: m with the found model.
# The fix is to not include model: m since findProviderForModel already returns it.
old_block = '''      const scored = ms.map(m => ({
        model: m,
        score: ModelCapabilityScorer.computeSelectionScore(m.capabilities, this.preferences.costEfficiencyRatio, "general"),
        ...this.poolManager.findProviderForModel(m.id)!,
      })).filter(x => x.provider && x.apiKey);'''

new_block = '''      const scored = ms.map(m => {
        const found = this.poolManager.findProviderForModel(m.id)!;
        return {
          ...found,
          score: ModelCapabilityScorer.computeSelectionScore(m.capabilities, this.preferences.costEfficiencyRatio, "general"),
        };
      }).filter(x => x.provider && x.apiKey);'''

content = ''.join(lines)
if old_block in content:
    content = content.replace(old_block, new_block)
    with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\orchestrator\orchestrator.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Fixed orchestrator.ts')
else:
    print('Pattern not found')