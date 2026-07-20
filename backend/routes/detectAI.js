const { detectAIRecommendations } = require("../services/aiDetector");

function handleDetectAI(body) {
  const brandName = body.brandName || process.env.BRAND_NAME || "蜀黍家";
  const questions = body.questions || [];

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Missing required field: questions");
  }

  return {
    brandName,
    results: detectAIRecommendations({ brandName, questions })
  };
}

module.exports = { handleDetectAI };
