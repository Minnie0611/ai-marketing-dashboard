const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "publishRecords.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf8");
}

function readRecords() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeRecords(records) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2) + "\n", "utf8");
}

function detectPlatform(url) {
  const value = String(url).toLowerCase();
  if (value.includes("zhihu.com")) return "知乎";
  if (value.includes("smzdm.com")) return "什么值得买";
  if (value.includes("163.com")) return "网易";
  if (value.includes("toutiao.com")) return "今日头条";
  if (value.includes("mp.weixin.qq.com")) return "微信公众号";
  if (value.includes("xiaohongshu.com")) return "小红书";
  if (value.includes("douyin.com")) return "抖音";
  return "其他平台";
}

function createPublishRecord(input) {
  const records = readRecords();
  const record = {
    id: `pub_${Date.now()}`,
    status: "已发布",
    platform: detectPlatform(input.url),
    title: input.title || `${input.category}内容发布记录`,
    category: input.category,
    keywords: Array.isArray(input.keywords) ? input.keywords : [String(input.keywords || "通勤")],
    publishedAt: new Date().toISOString(),
    url: input.url,
    indexedStatus: "未检测"
  };

  records.unshift(record);
  writeRecords(records);
  return record;
}

function listPublishRecords() {
  return readRecords();
}

module.exports = { createPublishRecord, listPublishRecords, detectPlatform };
