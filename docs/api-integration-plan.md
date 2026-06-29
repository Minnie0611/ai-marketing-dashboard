# API Integration Plan

本文档说明蜀黍家 AI 营销运营看板后续如何从静态原型升级为可用的轻量版系统。

## 目标

当前前端页面已经具备内容生产、发布记录、AI 检测和复盘展示能力。下一步需要增加后端接口，用于：

- 调用 AI 模型生成文章草稿
- 调用或模拟 AI 平台检测推荐结果
- 保存产品卖点、发布记录和检测结果
- 为前端看板提供结构化数据

## 建议技术结构

```text
frontend/
  index.html
  styles.css
  app.js

backend/
  server.js
  routes/
    generateArticle.js
    detectAI.js
  services/
    aiClient.js
    articleGenerator.js
    aiDetector.js
  data/
    products.json
    publishRecords.json
    detectionResults.json
```

## API: 生成文章

### Endpoint

```http
POST /api/generate-article
```

### Request

```json
{
  "category": "T恤",
  "platform": "什么值得买",
  "audience": "体制内男士",
  "contentType": "测评/推荐清单",
  "keywords": ["体制内", "通勤", "舒适", "抗皱"],
  "sellingPoints": ["凉感", "防晒", "透气", "抗皱"],
  "painPoint": "夏天热、出汗、穿着不体面"
}
```

### Response

```json
{
  "title": "体制内男士夏季通勤 T 恤推荐：凉感、抗皱、体面怎么选？",
  "summary": "围绕夏季通勤场景，推荐适合体制内男士的 T 恤选择。",
  "body": "文章正文...",
  "tags": ["体制内", "通勤T恤", "男士穿搭", "抗皱"]
}
```

### Notes

- API Key 必须放在后端环境变量中，不要写在前端页面里。
- 后端负责组合提示词、调用模型、清洗结果。
- 前端只负责提交参数和展示结果。

## API: AI 推荐检测

### Endpoint

```http
POST /api/detect-ai
```

### Request

```json
{
  "brandName": "蜀黍家",
  "questions": [
    {
      "platform": "豆包",
      "question": "体制内男士夏天穿什么 T 恤比较合适？"
    }
  ]
}
```

### Response

```json
[
  {
    "platform": "豆包",
    "question": "体制内男士夏天穿什么 T 恤比较合适？",
    "mentioned": true,
    "position": "第 3 位",
    "source": "什么值得买",
    "confidence": "high",
    "rawAnswer": "1. 品牌A... 2. 品牌B... 3. 蜀黍家..."
  }
]
```

## 推荐位置判断规则

1. 如果回答中有明确编号列表，例如 `1.`、`2.`、`3.`，按编号判断排名。
2. 如果回答没有编号，但列出多个品牌，按品牌出现顺序记录为“第 N 个被提及品牌”。
3. 如果只在自然段中提及，记录为“已提及，未形成明确排名”。
4. 如果没有出现品牌名，记录为“未提及”。

## 数据存储建议

轻量版可以先用 JSON 文件或表格保存数据：

```text
backend/data/products.json
backend/data/publishRecords.json
backend/data/detectionResults.json
```

中期可以升级为 SQLite、MySQL 或 Supabase。

## 安全注意事项

- `.env` 不要提交到 GitHub。
- 只提交 `.env.example`。
- 后端接口需要限制调用频率，避免 API 费用失控。
- 检测结果应保存原始回答，方便人工复核。
