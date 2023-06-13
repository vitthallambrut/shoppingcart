const express = require("express");
const app = express();
const port = 3000;
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "shopping_cart",
  password: "postgres",
  port: 5432,
});

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.shopping_card_details");
    const shoppingCart = result.rows;
    res.render("index", { shoppingCart });
  } catch (error) {
    console.error("Error retrieving shopping cart items:", error);
    res.status(500).send("Error retrieving shopping cart items");
  }
});

app.post("/addItem", async (req, res) => {
  const { name, price } = req.body;
  console.log("name",name);
  try {
    await pool.query(
      "INSERT INTO public.shopping_card_details (name, price) VALUES ($1, $2)",
      [name, price]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error adding item to shopping cart:", error);
    res.status(500).send("Error adding item to shopping cart");
  }
});

app.post("/removeItem", async (req, res) => {
  const { id } = req.body;
  console.log("id",id);
  try {
    await pool.query("DELETE FROM public.shopping_card_details WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.error("Error removing item from shopping cart:", error);
    res.status(500).send("Error removing item from shopping cart");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

