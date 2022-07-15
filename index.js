require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const isNumber = require("is-number");
const dns = require("dns");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

app.post("/api/shorturl/", (req, res) => {
  let hostname;
  try {
    hostname = new URL(req.body.url).hostname;
  } catch (error) {
    hostname = req.body.url;
  }
  dns.lookup(hostname, (err) => {
    if (err) return res.json({ error: "invalid url" });
    const short_url = shortUrls.push(req.body.url) - 1;
    const body = { original_url: req.body.url, short_url: short_url };
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

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT)
});
