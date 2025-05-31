import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

await db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {

    const result = await db.query("SELECT * from items ORDER BY id asc;");
    let todoItems = result.rows;

    res.render("index.ejs", {
        todoItems: todoItems,
    });
});

app.post("/add", async (req, res) => {

    await db.query("INSERT INTO items (title) VALUES ($1)", [req.body.todoItem]);

    res.redirect("/");

});


app.post("/delete", async (req, res) => {

    await db.query("DELETE from items WHERE id = $1", [req.body.itemId]);

    res.redirect("/");
});

app.post("/edit", async (req, res) => {

    await db.query("UPDATE items set title = $1 where id = $2", [req.body.title, req.body.id]);

    res.redirect("/")

});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});