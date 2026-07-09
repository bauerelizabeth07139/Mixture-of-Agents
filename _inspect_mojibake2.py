from pathlib import Path
p=Path(r"C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx")
text=p.read_text(encoding='utf-8')
keys=['placeholder','新建对话','备注','测试','评测','快速测试','标准测试','模型名','多模态','答案']
for k in keys:
    print('\n###',k)
    for i,line in enumerate(text.splitlines(),1):
        if k in line:
            print(i, line)
