var express = require("express");
var cors = require("cors");

var app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text());

app.get("/links/:page", async (req, res) => {
    const { page } = req.params;
    let link = "https://en.wikipedia.org/wiki/" + page;
    console.log("POST " + link);

    fetch(link)
    .then(response => {
        return response.text();
    })
    .then(html => {
        const regex = /<a\b[^>]*>(.*?)<\/a>/g;
        const matches = [];
        let match;

        while ((match = regex.exec(html)) !== null) {
            matches.push(match[0]);
        }

        const articleLinks = [];
        const incomps = [
            "User:",
            "Wikipedia:",
            "File:",
            "MediaWiki:",
            "Template:",
            "Help:",
            "Category:",
            "Portal:",
            "Draft:",
            "MOS:",
            "TimedText:",
            "Module:",
            "Special:",
            "Talk:",
            "class=\"interlanguage-link-target\"",
            "Main_Page",
            "/wiki/" + page,
            "wikimedia.org",
            "wikidata.org"
        ];
        for (let i = 0; i < matches.length; i++) {
            let status = true;
            for (let j = 0; j < incomps.length; j++) {
                if (matches[i].includes(incomps[j])) {
                    status = false;
                }
            }
            if (!matches[i].includes("/wiki/")) {
                status = false;
            }

            if (status) {
                const hrefRegex = /href="([^"]*)"/;
                const hrefMatch = hrefRegex.exec(matches[i]);
                if (hrefMatch && hrefMatch[1]) {
                    articleLinks.push(hrefMatch[1]);
                }
            }
        }


        res.end(JSON.stringify(articleLinks), null, 4);
        console.log(matches.length);
    });
});

app.get("/", async (req, res) => {
    console.log("GET /");
    res.end(JSON.stringify({
        "Welcome to": "Wikipedia Game API",
        "By": "Kolin63",
        "About": "Fetch all links that lead out of a Wikipedia Page!",
        "Usage": "TODO",
        "GitHub": "https://github.com/Kolin63/wikipediaGameApi"
    }, null, 4));
})

app.listen(PORT, () => {
    console.log("Server running on Port " + PORT);
})
