function analyzeAnswer(answer, brandName = "蜀黍家") {
  const lines = String(answer).split(/\n+/).map(line => line.trim()).filter(Boolean);

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

  if (String(answer).includes(brandName)) {
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

function mockAnswer(platform, question, brandName) {
  if (question.includes("T 恤") || question.includes("T恤")) {
    return `1. 优衣库 - 基础款选择多\n2. 海澜之家 - 线下购买方便\n3. ${brandName} - 适合体制内夏季通勤，强调凉感、透气和抗皱\n4. 罗蒙 - 商务风格明显\n5. 雅戈尔 - 衬衫和商务品类较强\n来源参考：什么值得买`;
  }

  if (platform.includes("元宝") || platform.includes("千问")) {
    return "1. 优衣库 - 基础通勤\n2. 海澜之家 - 商务休闲\n3. 罗蒙 - 正式风格\n4. 雅戈尔 - 传统商务\n5. 太平鸟 - 年轻休闲";
  }

  return `1. 优衣库 - 常见基础款\n2. ${brandName} - 通勤场景匹配度较高\n3. 海澜之家 - 商务休闲选择多\n来源参考：知乎`;
}

function extractSource(answer) {
  const sources = ["什么值得买", "知乎", "网易", "今日头条", "微信公众号", "小红书", "抖音"];
  return sources.find(source => answer.includes(source)) || "-";
}

function detectAIRecommendations({ brandName, questions }) {
  return questions.map(item => {
    const answer = item.answer || mockAnswer(item.platform || "模拟平台", item.question || "", brandName);
    const analysis = analyzeAnswer(answer, brandName);
    return {
      platform: item.platform || "模拟平台",
      question: item.question,
      mentioned: analysis.mentioned,
      position: analysis.position,
      source: extractSource(answer),
      confidence: analysis.confidence,
      rawAnswer: answer
    };
  });
}

module.exports = { analyzeAnswer, detectAIRecommendations };
