var express = require("express");
var cors = require("cors");

var app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text());

app.post("/links", async (req, res) => {
    let link = "https://en.wikipedia.org/wiki/" + req.body;
    console.log("POST " + link);

    fetch(link)
    .then(response => {
        return response.text();
    })
    .then(html => {
        console.log(html);
    });

    res.end(link);
});

app.get("/", async (req, res) => {
    console.log("GET /");
    res.end(JSON.stringify({
        "Welcome to": "Wikipedia Game API",
        "By": "Kolin63",
        "About": "Fetch all links that lead out of a Wikipedia Page!",
        "Usage": "TODO",
        "GitHub": "https://github.com/Kolin63/wikipediaGameApi"
    }, null, 3));
})

app.listen(PORT, () => {
    console.log("Server running on Port " + PORT);
})
