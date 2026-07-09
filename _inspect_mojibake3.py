from pathlib import Path
p=Path(r"C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx")
text=p.read_text(encoding='utf-8')
keys=['快速测试','标准测试','测试管理','开始快速测试','开始标准测试','快速评测','标准评测','testName','DETAIL_CN']
for k in keys:
    print('\n###',k)
    count=0
    for i,line in enumerate(text.splitlines(),1):
        if k in line:
            print(f'{i}: {line}')
            count+=1
            if count>=10:
                print('... truncated')
                break
