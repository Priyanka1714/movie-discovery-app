require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./database");

const movieRoutes = require("./routes/movieRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Movie Discovery API is running"
    });
});

app.use("/api/movies", movieRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});