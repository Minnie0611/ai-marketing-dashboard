const { generateArticle } = require("../services/articleGenerator");

function handleGenerateArticle(body) {
  const required = ["category", "platform"];
  for (const key of required) {
    if (!body[key]) {
      throw new Error(`Missing required field: ${key}`);
    }
  }

  return generateArticle({
    category: body.category,
    platform: body.platform,
    audience: body.audience || "体制内男士",
    contentType: body.contentType || "测评/推荐清单",
    keywords: body.keywords || ["体制内", "通勤", "舒适", "抗皱"],
    sellingPoints: body.sellingPoints || [],
    painPoint: body.painPoint || "通勤穿搭需要兼具体面、舒适和易打理"
  });
}

module.exports = { handleGenerateArticle };
