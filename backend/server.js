const http = require("http");
const path = require("path");

const { handleGenerateArticle } = require("./routes/generateArticle");
const { handlePublishRecords } = require("./routes/publishRecords");
const { handleDetectAI } = require("./routes/detectAI");

const PORT = Number(process.env.PORT || 3000);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1000000) {
        req.destroy();
        reject(new Error("Request body is too large"));
      }
    });
    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });
  });
}

async function routeRequest(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, { ok: true, service: "ai-marketing-dashboard", root: path.resolve(__dirname, "..") });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/generate-article") {
      const body = await readJsonBody(req);
      sendJson(res, 200, handleGenerateArticle(body));
      return;
    }

    if (url.pathname === "/api/publish-records") {
      const body = req.method === "POST" ? await readJsonBody(req) : {};
      sendJson(res, 200, handlePublishRecords(req.method, body));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/detect-ai") {
      const body = await readJsonBody(req);
      sendJson(res, 200, handleDetectAI(body));
      return;
    }

    sendJson(res, 404, { error: "Not found", path: url.pathname });
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
}

const server = http.createServer(routeRequest);

server.listen(PORT, () => {
  console.log(`AI marketing dashboard API running at http://localhost:${PORT}`);
});
