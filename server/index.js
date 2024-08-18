const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; img-src 'self';"
  );
  next();
});

const requestTimestamps = [];
function globalRateLimiter(req, res, next) {
  const currentTime = Date.now();

  requestsFiltered = requestTimestamps.filter(
    (timestamp) => currentTime - timestamp < 1000
  );
  if (requestsFiltered.length >= 5) {
    return res.status(429).json({ error: "Too many requests, please try again later." });
  }

  requestTimestamps.push(currentTime);
  next();
}

app.post("/fetch-metadata", globalRateLimiter, async (req, res) => {
  const urls = req.body.urls;

  if (!urls || urls.length === 0) {
    return res.status(400).json({ error: "No URLs provided!" });
  }

  const metadata = [];

  for (const url of urls) {
    try {
      if (isValidHttpUrl(url)) {
        let response;

        try {
          response = await fetch(url);

          if (!response.ok) {
            metadata.push({
              url,
              title: "No title",
              description: `Failed to fetch metadata for ${url}: ${response.statusText}`,
              image: "No image",
            });
            continue;
          }
        } catch (fetchError) {
          metadata.push({
            url,
            title: "No title",
            description: `Error fetching metadata for ${url}: ${fetchError}`,
            image: "No image",
          });
          continue;
        }

        const html = await response.text();

        const titleMatch = html.match(/<title>([^<]*)<\/title>/);
        const title = titleMatch ? titleMatch[1] : "No title found";

        const descriptionMatch = html.match(/<meta name="description" content="([^"]*)"/);
        const description = descriptionMatch
          ? descriptionMatch[1]
          : "No description found";

        const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"/);
        const image = imageMatch ? imageMatch[1] : "No image found";

        metadata.push({ url, title, description, image });
      } else {
        metadata.push({
          url,
          title: "No title",
          description: `${url} format or address is invalid`,
          image: "No image",
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(200).json(metadata);
});

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}
