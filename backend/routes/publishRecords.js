const { listPublishRecords, createPublishRecord } = require("../services/publishRecordService");

function handlePublishRecords(method, body) {
  if (method === "GET") {
    return { records: listPublishRecords() };
  }

  if (method === "POST") {
    if (!body.url) {
      throw new Error("Missing required field: url");
    }

    const record = createPublishRecord({
      url: body.url,
      category: body.category || "T恤",
      title: body.title,
      keywords: body.keywords || ["体制内", "通勤"]
    });

    return { record, records: listPublishRecords() };
  }

  throw new Error(`Unsupported method for publish records: ${method}`);
}

module.exports = { handlePublishRecords };
