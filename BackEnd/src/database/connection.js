const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ecommerce.db");

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  db.run(`CREATE TABLE IF NOT EXISTS Usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS Produto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL NOT NULL,
        estoque INTEGER DEFAULT 0,
        id_usuario_vendedor INTEGER NOT NULL,
        FOREIGN KEY(id_usuario_vendedor) REFERENCES Usuario(id)
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS Compra (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario_comprador INTEGER NOT NULL,
        id_produto INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        data_compra TEXT NOT NULL,
        FOREIGN KEY(id_usuario_comprador) REFERENCES Usuario(id),
        FOREIGN KEY(id_produto) REFERENCES Produto(id)
    )`);
});

module.exports = db;
