const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

let students = [];
const SECRET = "student123";

app.post("/register", async (req, res) => {
    let {name, email, password} = req.body;

    if (students.find(s => s.email === email))
        return res.send("Already registered");

    let hash = await bcrypt.hash(password, 10);
    students.push({name, email, password: hash});

    res.send("Registration successful");
});

app.post("/login", async (req, res) => {
    let s = students.find(x => x.email === req.body.email);

    if (!s || !await bcrypt.compare(req.body.password, s.password))
        return res.status(401).send("Invalid login");

    let token = jwt.sign({email: s.email}, SECRET);
    res.json({token});
});

app.get("/profile", (req, res) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let user = jwt.verify(token, SECRET);
        let s = students.find(x => x.email === user.email);

        res.json({name: s.name, email: s.email});
    } catch {
        res.status(401).send("Invalid token");
    }
});

app.get("/courses", (req, res) => {
    res.json(["Biochemistry", "Microbiology", "Genetics", "Cell Biology"]);
});

app.listen(5000, () => console.log("Server running on port 5000"));