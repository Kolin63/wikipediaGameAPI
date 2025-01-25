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

        for (let match in matches) {
            
        }

        // res.end(JSON.stringify(matches), null, 4);
        console.log(matches.length);
        res.end(link);
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
