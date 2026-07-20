# 某品牌 AI 营销运营看板

这是一个轻量版 AI 营销自动化面板原型，用于管理“内容生产 - 平台发布 - AI 检测 - 数据复盘 - 内容优化”的运营闭环。

## 功能

- 总览关键指标：AI 提及率、AI 推荐率、平台收录率、本周内容量
- 内容生产：按品类、平台、人群场景生成文章草稿
- 发布记录：管理平台、标题、品类、关键词、发布时间和收录状态
- AI 检测：模拟检测豆包、Kimi、DeepSeek、元宝、千问等模型是否推荐蜀黍家
- 复盘优化：按平台贡献、品类推荐率和检测缺口输出优化建议

## 项目结构

```text
frontend/
  index.html
  styles.css
  app.js

backend/
  server.js
  routes/
    generateArticle.js
    publishRecords.js
    detectAI.js
  services/
    articleGenerator.js
    publishRecordService.js
    aiDetector.js
  data/
    products.json
    publishRecords.json
    detectionResults.json
```

## 前端使用方式

直接打开 `index.html` 或 `frontend/index.html` 即可查看面板。

## 后端使用方式

本项目已加入 Node.js mock 后端，不需要安装第三方依赖。

```bash
npm start
```

启动后访问：

```text
http://localhost:3000/api/health
```

## Mock API

### 生成文章

```http
POST /api/generate-article
```

```json
{
  "category": "T恤",
  "platform": "什么值得买",
  "audience": "体制内男士",
  "contentType": "测评/推荐清单",
  "keywords": ["体制内", "通勤", "抗皱"],
  "sellingPoints": ["凉感", "防晒", "透气", "抗皱"]
}
```

### 新增发布记录

```http
POST /api/publish-records
```

```json
{
  "url": "https://www.zhihu.com/question/example",
  "category": "T恤",
  "title": "体制内男士夏天怎么穿更体面？",
  "keywords": ["体制内", "通勤", "凉感"]
}
```

### AI 推荐检测

```http
POST /api/detect-ai
```

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

## 后续接入方向

当前后端是 mock 版本。上线时建议逐步替换为真实服务：

- `/api/generate-article`：调用 AI 模型生成平台文章草稿
- `/api/publish-records`：保存发布记录到数据库
- `/api/detect-ai`：调用 AI 模型或自动化检测脚本，返回是否提及、推荐位置、引用来源

API Key 应保存在后端环境变量里，不要写在前端页面中。
