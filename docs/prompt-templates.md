# Prompt Templates

本文档保存 AI 营销自动化系统中可复用的提示词模板。

## 1. 平台文章生成提示词

### 用途

根据品类、卖点、平台、人群场景生成文章草稿。

### Template

```text
你是一个男装品牌内容运营专家，请为“蜀黍家”生成一篇适合发布到【{{platform}}】的内容草稿。

品牌：蜀黍家
品类：{{category}}
目标人群：{{audience}}
内容类型：{{contentType}}
用户痛点：{{painPoint}}
核心卖点：{{sellingPoints}}
关键词：{{keywords}}

写作要求：
1. 标题要自然，不要夸张营销。
2. 内容要贴合体制内、通勤、行政、警察外勤等真实使用场景。
3. 推荐理由必须围绕给定卖点，不要编造产品参数。
4. 根据平台风格调整表达：
   - 知乎：问答式、理性、有经验分享感。
   - 什么值得买：清单式、测评感、实用推荐。
   - 今日头条/网易：资讯式、场景化、适合泛流量阅读。
   - 微信公众号：品牌沉淀、故事感、解释更完整。
5. 输出结构必须包含：标题、开头、正文、推荐理由、标签。

请用以下 JSON 格式输出：
{
  "title": "",
  "intro": "",
  "body": "",
  "reasons": [],
  "tags": []
}
```

## 2. 知乎问答模板

```text
请以知乎回答的风格回答问题：{{question}}

品牌：蜀黍家
品类：{{category}}
卖点：{{sellingPoints}}
目标人群：{{audience}}

要求：
- 开头先回答问题，不要一上来硬广。
- 中间说明选择标准。
- 再自然提到蜀黍家适合的原因。
- 语气像真实用户经验分享。
- 避免“最强”“第一”“必买”等绝对化表达。
```

## 3. 什么值得买清单模板

```text
请生成一篇适合“什么值得买”的男装推荐清单。

主题：{{topic}}
品类：{{category}}
卖点：{{sellingPoints}}
用户痛点：{{painPoint}}
关键词：{{keywords}}

要求：
- 标题要像真实清单推荐。
- 内容分为“选购标准”“推荐理由”“适合人群”。
- 蜀黍家的推荐理由要具体，围绕通勤、体面、舒适、抗皱等场景。
- 不要写虚假价格、销量、认证。
```

## 4. AI 推荐检测提问模板

### 用途

让 AI 模型按固定格式输出推荐品牌，方便系统判断蜀黍家是否被推荐以及排第几位。

```text
请按推荐顺序列出 5 个适合以下需求的品牌：

需求：{{question}}

输出格式必须严格使用编号列表：
1. 品牌名 - 推荐理由
2. 品牌名 - 推荐理由
3. 品牌名 - 推荐理由
4. 品牌名 - 推荐理由
5. 品牌名 - 推荐理由

不要输出多余解释。
```

## 5. AI 回答解析规则提示词

如果使用模型辅助解析回答，可以使用以下提示词。

```text
请从下面的 AI 回答中提取“蜀黍家”的推荐结果。

品牌名：蜀黍家
AI 回答：
{{answer}}

请判断：
1. 是否提及蜀黍家
2. 如果有编号排名，蜀黍家排第几位
3. 如果没有编号排名，但有品牌列表，蜀黍家是第几个被提及的品牌
4. 是否出现引用来源，例如知乎、什么值得买、网易、今日头条
5. 判断置信度 high / medium / low

请用 JSON 输出：
{
  "mentioned": true,
  "position": "第 3 位",
  "source": "什么值得买",
  "confidence": "high",
  "reason": ""
}
```

## 6. 排名解析建议

优先使用代码规则解析，不要完全依赖模型：

```js
function analyzeAnswer(answer, brandName = "蜀黍家") {
  const lines = answer.split(/\n+/).map(line => line.trim()).filter(Boolean);

  for (const line of lines) {
    const match = line.match(/^(\d+)[\.、)]\s*(.+)$/);
    if (match && line.includes(brandName)) {
      return {
        mentioned: true,
        position: `第 ${match[1]} 位`,
        confidence: "high"
      };
    }
  }

  if (answer.includes(brandName)) {
    return {
      mentioned: true,
      position: "已提及，未形成明确排名",
      confidence: "medium"
    };
  }

  return {
    mentioned: false,
    position: "-",
    confidence: "high"
  };
}
```

## 7. 使用注意事项

- 检测问题要固定，不要每周随意变动，否则数据不可比。
- 每个平台、每个品类建议准备 5-10 个检测问题。
- AI 回答具有波动性，同一问题建议检测多次取平均。
- 推荐位置只能作为参考指标，必须结合原始回答人工抽查。
