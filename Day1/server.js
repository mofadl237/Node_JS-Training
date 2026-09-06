    

//Function
// console.log(process.argv)

// Simple nodejs server
// $env: PORT='3030'
// 
// console.log("This Is Port => ",process.env.PORT)


// 

// connect with DB From Postgres SQL WSL     ====   PORT=5432 |  USERNAME=MOHAMED | DB_NAME=llms_db
// Create File .env   and install dotenv and config all Secret Data

import express from "express";
import dotenv from "dotenv";
import pool from "./db.js";
import cors from "cors";


dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    origin: "http://localhost:3001",
  })
);

app.get("/products", async (req, res) => {

    const result = await pool.query(
        "SELECT * FROM products;"
    );

    res.json(result.rows);

});



app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { title, description, price, stock, image_url } = req.body;

    const result = await pool.query(
      `
      INSERT INTO products
      (title, description, price, stock, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [title, description, price, stock, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, price, stock, image_url } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
      title=$1,
      description=$2,
      price=$3,
      stock=$4,
      image_url=$5
      WHERE id=$6
      RETURNING *;
      `,
      [title, description, price, stock, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});




app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    res.json({
      message: "Deleted Successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});



const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});
