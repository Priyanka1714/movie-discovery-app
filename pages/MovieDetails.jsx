import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getMovieDetails,
    addToWishlist
} from "../services/movieApi";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [wishlistMessage, setWishlistMessage] = useState("");

    useEffect(() => {
        loadMovieDetails();
    }, [id]);

    const loadMovieDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMovieDetails(id);

            setMovie(response.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load movie details.");
        } finally {
            setLoading(false);
        }
    };
    const handleAddToWishlist = async () => {
    try {
        setWishlistMessage("");

        await addToWishlist(movie);

        setWishlistMessage("Movie added to wishlist!");
    } catch (error) {
        if (error.response?.status === 409) {
            setWishlistMessage("Movie is already in your wishlist.");
        } else {
            setWishlistMessage("Failed to add movie to wishlist.");
        }

        console.error(error);
    }
};

    if (loading) {
        return <h2 className="status-message">Loading...</h2>;
    }

    if (error) {
        return <h2 className="status-message">{error}</h2>;
    }

    if (!movie) {
        return <h2 className="status-message">Movie not found.</h2>;
    }

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

    return (
        <div className="details-page">
           <div className="details-navigation">
    <button
        className="back-button"
        onClick={() => navigate(-1)}
    >
        ← Back
    </button>

    <button
        className="home-button"
        onClick={() => navigate("/")}
    >
        🏠 Home
    </button>
</div>

            <div className="details-container">
                <img
                    src={posterUrl}
                    alt={movie.title}
                    className="details-poster"
                />

                <div className="details-info">
                    <h1>{movie.title}</h1>

                    <p>
                        <strong>Rating:</strong>{" "}
                        ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                    </p>
                    <button
    className="wishlist-button"
    onClick={handleAddToWishlist}
>
    ❤️ Add to Wishlist
</button>
{wishlistMessage && (
    <p className="wishlist-message">
        {wishlistMessage}
    </p>
)}

                    <p>
                        <strong>Release Date:</strong>{" "}
                        {movie.release_date || "N/A"}
                    </p>

                    <p>
                        <strong>Runtime:</strong>{" "}
                        {movie.runtime ? `${movie.runtime} minutes` : "N/A"}
                    </p>

                    <p>
                        <strong>Genres:</strong>{" "}
                        {movie.genres?.map((genre) => genre.name).join(", ") || "N/A"}
                    </p>

                    <h2>Overview</h2>

                    <p className="overview">
                        {movie.overview || "No overview available."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;