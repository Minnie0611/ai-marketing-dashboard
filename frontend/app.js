const products = [
  { name: "T恤", points: ["凉感", "防晒", "透气", "抗皱"], pain: "夏天热、出汗、穿着不体面" },
  { name: "POLO", points: ["体面", "商务", "亲肤", "抗皱"], pain: "T 恤不够正式，衬衫又太热" },
  { name: "通勤裤", points: ["垂顺", "抗皱", "舒适", "有型"], pain: "久坐不舒服、裤子皱、显臃肿" },
  { name: "通勤鞋", points: ["舒适", "防滑", "轻便", "适合久站"], pain: "走路累、鞋底硬、不够正式" },
  { name: "衬衫", points: ["免烫", "透气", "正式"], pain: "容易皱、打理麻烦" }
];

const templates = [
  { platform: "知乎", type: "问答型内容", note: "适合覆盖体制内穿什么类搜索问题" },
  { platform: "什么值得买", type: "测评/推荐清单", note: "适合产品种草、榜单、实用推荐" },
  { platform: "网易/今日头条", type: "资讯型文章", note: "适合趋势、穿搭指南、场景化推荐" },
  { platform: "微信公众号", type: "品牌沉淀内容", note: "适合品牌故事和产品深度介绍" }
];

const publishData = [
  ["已发布", "什么值得买", "夏季男士通勤 T 恤推荐：凉感与抗皱怎么选", "T恤", "体制内, 通勤", "06-24 10:30", "已引用"],
  ["已发布", "知乎", "体制内男士夏天怎么穿更体面？", "T恤", "体面, 凉感", "06-24 15:10", "观察中"],
  ["待审核", "今日头条", "男士通勤裤怎么选：久坐舒适和有型兼顾", "通勤裤", "公务员, 抗皱", "待排期", "未检测"],
  ["已发布", "网易", "警察外勤通勤鞋选购指南", "通勤鞋", "警察, 舒适", "06-25 11:20", "已引用"],
  ["待审核", "什么值得买", "公务员上班 POLO 推荐：正式但不闷热", "POLO", "POLO, 体制内", "待排期", "未检测"]
];

const detectData = [
  ["豆包", "体制内男士夏天穿什么 T 恤比较合适？", "是", "第 3 位", "什么值得买"],
  ["Kimi", "男士通勤裤哪个品牌好？", "是", "第 4 位", "知乎"],
  ["DeepSeek", "警察外勤穿什么鞋舒服？", "是", "第 2 位", "网易"],
  ["腾讯元宝", "公务员上班穿什么 POLO 比较体面？", "否", "-", "-"],
  ["通义千问", "男士免烫衬衫推荐什么品牌？", "否", "-", "-"],
  ["文心一言", "夏季男士通勤穿搭有哪些推荐？", "是", "第 5 位", "今日头条"]
];

const platformScores = [["什么值得买", 46], ["知乎", 31], ["网易/头条", 18], ["公众号", 5]];
const categoryScores = [["T恤", 58], ["通勤裤", 44], ["通勤鞋", 39], ["POLO", 22], ["衬衫", 18]];

function renderBars(id, data) {
  document.getElementById(id).innerHTML = data.map(([label, value]) => `
    <div class="bar-row"><span>${label}</span><div class="bar"><span style="width:${value}%"></span></div><b>${value}%</b></div>
  `).join("");
}

function renderProducts() {
  document.getElementById("productList").innerHTML = products.map(item => `
    <div><b>${item.name}</b><p>${item.points.join("、")}</p><small>${item.pain}</small></div>
  `).join("");

  document.getElementById("templateList").innerHTML = templates.map(item => `
    <div><b>${item.platform}</b><p>${item.type}</p><small>${item.note}</small></div>
  `).join("");
}

function renderPublish(status = "all") {
  const rows = publishData.filter(row => status === "all" || row[0] === status);
  document.getElementById("publishRows").innerHTML = rows.map(row => `
    <tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td><td>${row[6]}</td></tr>
  `).join("");
}

function renderDetect() {
  document.getElementById("detectRows").innerHTML = detectData.map(row => `
    <tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td></tr>
  `).join("");

  document.getElementById("aiCards").innerHTML = [
    ["豆包", "推荐命中较好，适合继续补充清单与问答内容。", "42%"],
    ["Kimi", "对知乎和什么值得买引用敏感，可增加评测型标题。", "36%"],
    ["DeepSeek", "品牌提及稳定，但推荐理由需要更集中在核心卖点。", "31%"],
    ["元宝/千问", "当前提及偏弱，需补充腾讯系和资讯平台内容。", "18%"]
  ].map(item => `<div><b>${item[0]} ${item[2]}</b><p>${item[1]}</p></div>`).join("");
}

function generateTopic() {
  const category = document.getElementById("categorySelect").value;
  const platform = document.getElementById("platformSelect").value;
  const audience = document.getElementById("audienceSelect").value;
  const tone = document.getElementById("toneSelect").value;
  const product = products.find(item => item.name === category) || products[0];
  const pointText = product.points.slice(0, 3).join("、");
  const platformAngle = platform.includes("知乎") ? "怎么选才体面" : platform.includes("值得买") ? "推荐清单" : "穿搭指南";
  document.getElementById("generatedTitle").textContent = `${audience}${category}${platformAngle}：${pointText}能解决什么问题？`;
  document.getElementById("generatedText").textContent = `已按 ${tone} 生成文章草稿：围绕“${product.pain}”展开，正文重点突出蜀黍家 ${category} 的${pointText}卖点，并输出适合${platform}的标题、开头、正文结构、推荐理由和标签。`;
}

function switchView(name) {
  document.querySelectorAll(".view").forEach(view => view.classList.add("hidden"));
  document.getElementById(`view-${name}`).classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.view === name));
}

async function runAiDetection() {
  const button = document.getElementById("runDetectBtn");
  button.disabled = true;
  button.textContent = "检测中";
  document.getElementById("detectRows").innerHTML = detectData.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>检测中</td><td>-</td><td>-</td></tr>`).join("");

  // 上线时替换为真实后端接口：fetch('/api/detect-ai')
  await new Promise(resolve => setTimeout(resolve, 800));
  renderDetect();
  button.disabled = false;
  button.textContent = "运行检测";
}

function exportReport() {
  const report = [
    "蜀黍家 AI 营销轻量版周报",
    `AI 提及率：${document.getElementById("mentionRate").textContent}`,
    `AI 推荐率：${document.getElementById("recommendRate").textContent}`,
    `平台收录率：${document.getElementById("indexRate").textContent}`,
    "建议：加码什么值得买清单内容，补齐知乎问答口径，增加 POLO 与衬衫内容铺设。"
  ].join("\n");
  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "蜀黍家AI营销周报.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

function bindEvents() {
  document.querySelectorAll(".nav-btn").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.view)));
  document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    renderPublish(tab.dataset.status);
  }));
  document.getElementById("generateBtn").addEventListener("click", generateTopic);
  document.getElementById("categorySelect").addEventListener("change", generateTopic);
  document.getElementById("platformSelect").addEventListener("change", generateTopic);
  document.getElementById("runDetectBtn").addEventListener("click", runAiDetection);
  document.getElementById("exportBtn").addEventListener("click", exportReport);
  document.getElementById("refreshBtn").addEventListener("click", () => {
    document.getElementById("mentionRate").textContent = `${38 + Math.floor(Math.random() * 13)}%`;
    document.getElementById("recommendRate").textContent = `${24 + Math.floor(Math.random() * 10)}%`;
    document.getElementById("indexRate").textContent = `${30 + Math.floor(Math.random() * 12)}%`;
    document.getElementById("contentCount").textContent = 20 + Math.floor(Math.random() * 9);
  });
}

renderBars("platformBars", platformScores);
renderBars("categoryBars", categoryScores);
renderProducts();
renderPublish();
renderDetect();
generateTopic();
bindEvents();
