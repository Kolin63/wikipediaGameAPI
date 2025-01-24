var express = require("express");
var cors = require("cors");

var app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.post("/links", async (req, res) => {
    let link = "en.wikipedia.org/wiki/" + req.body;
    console.log(link);
});

app.get("/", async (req, res) => {
    console.log("TEST");
})

app.listen(PORT, () => {
    console.log("Server running on Port " + PORT);
})
