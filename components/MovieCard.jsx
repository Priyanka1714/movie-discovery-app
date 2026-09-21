import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
    const navigate = useNavigate();

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

    return (
        <div
    className="movie-card"
    onClick={() => navigate(`/movies/${movie.id}`)}
    role="button"
    tabIndex={0}
    onKeyDown={(event) => {
        if (event.key === "Enter") {
            navigate(`/movies/${movie.id}`);
        }
    }}
>
            <img
                src={imageUrl}
                alt={movie.title}
                className="movie-poster"
            />

            <div className="movie-info">
                <h3>{movie.title}</h3>

                <p>
                    ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                </p>

                <p>
                    {movie.release_date || "Release date unavailable"}
                </p>
            </div>
        </div>
    );
}

export default MovieCard;