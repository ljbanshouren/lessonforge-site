# LessonForge · 部署与冷启动清单

## 项目结构
```
index.html        落地页(Interactive-first:选年级/学科+输入课题→免费生成开场)
api/generate.js   Vercel Serverless:调 LLM 生成,密钥在服务端不暴露
```

## 部署(15 分钟)
1. 这两个文件推到一个 GitHub 新仓库(名 lessonforge)。
2. Vercel → Add New Project → 导入仓库 → Framework 选 Other → Deploy。
3. Vercel 项目 → Settings → Environment Variables → 加:
   - `YAI_API_KEY` = 你的中转站 key
   - `MODEL_NAME` = `gpt-4o-mini`(或中转站任何便宜 chat 模型)
4. 绑域名(如 lessonforge.app / teachforge.io)。免费档可先用 vercel.app 域名测。

## 冷启动(上线当周)
1. **目录提交(全部免费,一份文案复用)**:theresanaiforthat.com(你已注册)、Futurepedia、AIToolsDirectory、ToolFinder、ThereIsAnAIForThat 的 just-released 自动收录;Product Hunt 排期周二/周三。
2. **GEO 页**:FAQ 已内置结构化数据;再加一篇 "/blog/ai-lesson-opening-examples" 长文(8 个真实开场例子),让 ChatGPT 引用。
3. **Build in public**:X(原 Twitter)开号,每天发一张"生成的开场 vs 传统开场"对比图;r/Teachers 版规允许的话发免费工具帖(注意先读版规)。
4. **Reddit 目标版**:r/TeachersInTransition 慎用;优先 r/education、教师 Facebook 群(教师群对免费工具接受度高)。

## 数据指标(上线 30 天)
- 访问→生成转化 ≥40%(交互首屏就该高)
- 生成→邮箱/付费 ≥3%
- API 成本占收入 <25%(gpt-4o-mini 一次约 $0.002,毛利极厚)
- 止损:3 个月 MRR<$200 换切口

## 待办(v1.1)
- 接 Lemon Squeezy / Dodo Payments(中国个人可注册的 MoR,见调研档案收款段)
- 用户账号(Supabase)+ 生成历史
- DOCX 导出(用 docx npm 包)
- 更多学科模板(语文/地理已留位)
