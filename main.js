var express = require("express");
var cors = require("cors");

var app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text());

async function getLinks(page) {
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
                        if (hrefMatch[1].startsWith("/wiki/")) {
                            hrefMatch[1] = "https://en.wikipedia.org" + hrefMatch[1];
                        }
                        articleLinks.push(hrefMatch[1]);
                    }
                }
            }

            return articleLinks;
        });
}

app.get("/links/:page", async (req, res) => {
    const { page } = req.params;
    let link = "https://en.wikipedia.org/wiki/" + page;
    console.log("GET LINKS " + link);

    res.end(JSON.stringify(await getLinks(page), null, 4));
});

app.get("/links/:page/:filter", async (req, res) => {
    const { page, filter } = req.params;
    let link = "https://en.wikipedia.org/wiki" + page;
    console.log("GET FILTERED " + link);

    const links = await getLinks(page);
    const matches = [];

    for (let i = 0; i < links.length; i++) {
        if (links[i].includes(filter)) {
            matches.push(links[i]);
        }
    }

    res.end(JSON.stringify(await getLinks(page), null, 4));
})

app.get("/", async (req, res) => {
    console.log("GET /");
    res.end(JSON.stringify({
        "Welcome to": "Wikipedia Game API",
        "By": "Kolin63",
        "About": "Fetch all links that lead out of a Wikipedia Page!",
        "Usage": {
            "GET  This Home Page": "curl https://wgapi.kolin63.com",
            "GET  All Links Leading Out of a Page": {
                "curl   ": "curl https://wgapi.kolin63.com/links/Article_Name",
                "example": "curl https://wgapi.kolin63.com/links/Flying_Spaghetti_Monster"
            }
        },
        "GitHub": "https://github.com/Kolin63/wikipediaGameApi"
    }, null, 4));
})

app.listen(PORT, () => {
    console.log("Server running on Port " + PORT);
})
