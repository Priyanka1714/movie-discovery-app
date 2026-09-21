const Database = require("better-sqlite3");

const db = new Database("wishlist.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT,
        vote_average REAL,
        release_date TEXT
    )
`).run();

console.log("SQLite database connected");

module.exports = db;