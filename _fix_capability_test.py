from pathlib import Path
p=Path(r'''C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\backend\src\services\capability-test.ts''')
text=p.read_text(encoding='utf-8')
old1="multimodal: model.capabilities.multimodal, pricing: model.capabilities.pricing,\n      };\n    }\n    const codeResults"
new1="multimodal: model.capabilities.multimodal, visionScore: 0, audioScore: 0, pricing: model.capabilities.pricing,\n      };\n    }\n    const codeResults"
text=text.replace(old1,new1,1)
old2="multimodal: model.capabilities.multimodal, pricing: model.capabilities.pricing,\n      },\n    };\n  }\n\n  static async testMultimodal"
new2="multimodal: model.capabilities.multimodal, visionScore: 0, audioScore: 0, pricing: model.capabilities.pricing,\n      },\n    };\n  }\n\n  static async testMultimodal"
text=text.replace(old2,new2,1)
# Also fix in runQuickTest
old3="multimodal: model.capabilities.multimodal, pricing: model.capabilities.pricing,\n      },\n    };\n  }\n\n  static async testMultimodal"
# there might be only one occurrence, check
if old3 not in text:
    # try broader
    old3b = "pricing: model.capabilities.pricing,\n      },\n    };\n  }\n\n  static async testMultimodal"
    if old3b in text:
        new3b = "visionScore: 0, audioScore: 0, pricing: model.capabilities.pricing,\n      },\n    };\n  }\n\n  static async testMultimodal"
        text=text.replace(old3b,new3b,1)
p.write_text(text, encoding='utf-8')
print('done')
