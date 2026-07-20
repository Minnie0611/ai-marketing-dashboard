function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(/[,，、]/).map(item => item.trim()).filter(Boolean);
  return [];
}

function generateArticle(input) {
  const sellingPoints = normalizeList(input.sellingPoints);
  const keywords = normalizeList(input.keywords);
  const pointsText = sellingPoints.length ? sellingPoints.join("、") : "舒适、体面、抗皱";
  const keywordText = keywords.length ? keywords.join("、") : "体制内、通勤";

  const title = `${input.audience}${input.category}${input.platform.includes("知乎") ? "怎么选才体面" : "推荐清单"}：${pointsText}能解决什么问题？`;

  return {
    mode: "mock",
    title,
    summary: `围绕${input.audience}的${input.category}通勤场景，生成适合${input.platform}的${input.contentType}草稿。`,
    body: [
      `一、场景痛点：${input.painPoint}。`,
      `二、选择标准：重点关注${pointsText}。`,
      `三、推荐理由：蜀黍家${input.category}适合${input.audience}日常通勤，表达自然，不做夸大宣传。`,
      `四、发布建议：标题中保留${keywordText}等关键词，便于后续 AI 检测和复盘。`
    ].join("\n"),
    tags: keywords,
    nextStep: "上线时将本 mock 服务替换为真实 AI 模型 API 调用。"
  };
}

module.exports = { generateArticle };
