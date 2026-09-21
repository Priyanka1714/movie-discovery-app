const express = require("express");

const {
    getPopularMovies,
    getNowPlayingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    searchMovies,
    getMovieDetails
} = require("../services/tmdbService");

const router = express.Router();
const handleTmdbError = (error, res, fallbackMessage) => {
    console.error("TMDB Error:", error.message);

    if (error.response?.status === 429) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later."
        });
    }

    if (error.response?.status >= 500) {
        return res.status(503).json({
            success: false,
            message: "Movie service is temporarily unavailable."
        });
    }

    return res.status(500).json({
        success: false,
        message: fallbackMessage
    });
};


// GET popular movies
router.get("/", async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const data = await getPopularMovies(page);

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
    handleTmdbError(
        error,
        res,
        "Failed to fetch popular movies"
    );
}
});


// SEARCH movies
router.get("/search", async (req, res) => {

    try {

        const query = req.query.query;
        const page = Number(req.query.page) || 1;

        if (!query || !query.trim()) {

            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const data = await searchMovies(query.trim(), page);

        res.json({
            success: true,
            data: data
        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Failed to search movies"
        });
    }
});
router.get("/now-playing", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;

        const data = await getNowPlayingMovies(page);

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
    handleTmdbError(
        error,
        res,
        "Failed to fetch now playing movies"
    );
}
});


router.get("/top-rated", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;

        const data = await getTopRatedMovies(page);

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
    handleTmdbError(
        error,
        res,
        "Failed to fetch top rated movies"
    );
}
});


router.get("/upcoming", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;

        const data = await getUpcomingMovies(page);

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
    handleTmdbError(
        error,
        res,
        "Failed to fetch upcoming movies"
    );
}
});


// GET movie details
router.get("/:id", async (req, res) => {

    try {

        const movieId = Number(req.params.id);

        if (!Number.isInteger(movieId) || movieId <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid movie ID"
            });
        }

        const data = await getMovieDetails(movieId);

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
    handleTmdbError(
        error,
        res,
        "Failed to fetch movie details"
    );
}
});


module.exports = router;