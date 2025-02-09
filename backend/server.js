import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

// Crea il database SQLite
const db = new sqlite3.Database("cookbook.db");

// Crea le tabelle se non esistono
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      ingredients TEXT,
      instructions TEXT,
      user_id INTEGER
    )
  `);
});

// Registrazione
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ error: "Email già in uso" });
      }
      res.json({ message: "Registrazione completata" });
    }
  );
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Utente non trovato" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Password non valida" });
    }

    const token = jwt.sign({ id: user.id }, "secretkey");
    res.json({ token, userId: user.id });
  });
});

// Aggiungi ricetta
app.post("/api/recipes", (req, res) => {
  const { title, ingredients, instructions, userId } = req.body;

  db.run(
    "INSERT INTO recipes (title, ingredients, instructions, user_id) VALUES (?, ?, ?, ?)",
    [title, ingredients, instructions, userId],
    function (err) {
      if (err) {
        return res.status(400).json({ error: "Errore nel salvare la ricetta" });
      }
      res.json({ message: "Ricetta salvata", recipeId: this.lastID });
    }
  );
});

// Ottieni le ricette dell'utente loggato
app.get("/api/recipes", (req, res) => {
  const userId = req.query.userId;

  if (userId) {
    // Se c'è un userId, restituisci solo le ricette di quell'utente
    db.all(
      "SELECT recipes.*, users.email FROM recipes JOIN users ON recipes.user_id = users.id WHERE recipes.user_id = ?",
      [userId],
      (err, recipes) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Errore nel recuperare le ricette" });
        }
        res.json(recipes);
      }
    );
  } else {
    // Se non c'è userId, restituisci tutte le ricette (per la pagina pubblica)
    db.all(
      "SELECT recipes.*, users.email FROM recipes JOIN users ON recipes.user_id = users.id",
      (err, recipes) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Errore nel recuperare le ricette" });
        }
        res.json(recipes);
      }
    );
  }
});

// Elimina ricetta
app.delete("/api/recipes/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId;

  // Prima verifica se la ricetta esiste e appartiene all'utente
  db.get(
    "SELECT * FROM recipes WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, recipe) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Errore nella verifica della ricetta" });
      }
      if (!recipe) {
        return res
          .status(404)
          .json({ error: "Ricetta non trovata o non autorizzato" });
      }

      // Se la ricetta esiste e appartiene all'utente, eliminala
      db.run(
        "DELETE FROM recipes WHERE id = ? AND user_id = ?",
        [id, userId],
        function (err) {
          if (err) {
            return res
              .status(400)
              .json({ error: "Errore nella cancellazione della ricetta" });
          }
          res.json({ message: "Ricetta eliminata con successo" });
        }
      );
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
