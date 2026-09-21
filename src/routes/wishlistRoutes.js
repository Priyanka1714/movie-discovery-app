console.log("WISHLIST ROUTES FILE LOADED");
const express = require("express");
const db = require("../database");

const router = express.Router();

// Get all wishlist movies
router.get("/", (req, res) => {
    try {
        const movies = db
            .prepare("SELECT * FROM wishlist ORDER BY id DESC")
            .all();

        res.json({
            success: true,
            data: movies
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist"
        });
    }
});

// Add movie to wishlist
router.post("/", (req, res) => {
    try {
        const {
            movie_id,
            title,
            poster_path,
            vote_average,
            release_date
        } = req.body;

        if (!movie_id || !title) {
            return res.status(400).json({
                success: false,
                message: "movie_id and title are required"
            });
        }

        const existing = db
            .prepare("SELECT * FROM wishlist WHERE movie_id = ?")
            .get(movie_id);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Movie already exists in wishlist",
                data: existing
            });
        }

        const result = db
            .prepare(`
                INSERT INTO wishlist
                (movie_id, title, poster_path, vote_average, release_date)
                VALUES (?, ?, ?, ?, ?)
            `)
            .run(
                movie_id,
                title,
                poster_path || null,
                vote_average ?? null,
                release_date || null
            );

        const movie = db
            .prepare("SELECT * FROM wishlist WHERE id = ?")
            .get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            data: movie
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Failed to add movie to wishlist"
        });
    }
});

// Remove movie from wishlist
router.delete("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid wishlist ID"
            });
        }

        const result = db
            .prepare("DELETE FROM wishlist WHERE id = ?")
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Movie not found in wishlist"
            });
        }

        res.json({
            success: true,
            message: "Movie removed from wishlist"
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Failed to remove movie from wishlist"
        });
    }
});

module.exports = router;