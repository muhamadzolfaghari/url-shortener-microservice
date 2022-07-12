require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const isNumber = require("is-number");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const shortUrls = [""];

const PROJECT_URL = "http://localhost:3000";

app.post("/api/shorturl/", (req, res) => {
  const url = req.body.url;
  dns.lookup(url, (err) => {
    if (!url.includes(PROJECT_URL) && err) {
      return res.json({ error: "invalid url" });
    }
    const short_url = shortUrls.push(url) - 1;
    const body = { original_url: url, short_url: short_url };
    res.json(body);
  });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = req.params.short_url;

  if (!isNumber(shortUrl) || !shortUrls[shortUrl]) {
    return res.json({});
  }

  res.redirect(shortUrls[shortUrl]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
