import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getWishlist,
    removeFromWishlist
} from "../services/movieApi";

function Wishlist() {
  const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getWishlist();

            setMovies(response.data || []);
        } catch (error) {
            console.error(error);
            setError("Failed to load wishlist.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeFromWishlist(id);

            setMovies((currentMovies) =>
                currentMovies.filter((movie) => movie.id !== id)
            );
        } catch (error) {
            console.error(error);
            setError("Failed to remove movie.");
        }
    };

    if (loading) {
        return <h2 className="status-message">Loading wishlist...</h2>;
    }

    if (error) {
        return <h2 className="status-message">{error}</h2>;
    }

    return (
        <div className="home-page">

            <h1>❤️ My Wishlist</h1>
            <Link to="/" className="home-button wishlist-home-button">
    🏠 Home
</Link>

            {movies.length === 0 ? (
                <h3 className="status-message">
                    Your wishlist is empty.
                </h3>
            ) : (
                <div className="movie-grid">
                    {movies.map((movie) => {
                        const imageUrl = movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Poster";

                        return (
                            <div
    className="movie-card"
    key={movie.id}
    onClick={() => navigate(`/movies/${movie.movie_id}`)}
    role="button"
    tabIndex={0}
>
                                <img
                                    src={imageUrl}
                                    alt={movie.title}
                                    className="movie-poster"
                                />

                                <div className="movie-info">

                                    <h3>{movie.title}</h3>

                                    <p>
                                        ⭐{" "}
                                        {movie.vote_average
                                            ? movie.vote_average.toFixed(1)
                                            : "N/A"}
                                    </p>

                                    <p>
                                        {movie.release_date || "N/A"}
                                    </p>

                                    <button
    className="remove-button"
    onClick={(event) => {
        event.stopPropagation();
        handleRemove(movie.id);
    }}
>
    Remove
</button>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}

export default Wishlist;