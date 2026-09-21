import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getPopularMovies,
    getNowPlayingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    searchMovies
} from "../services/movieApi";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState("popular");
    const [totalPages, setTotalPages] = useState(1);

   useEffect(() => {
    const controller = new AbortController();

    const loadMovies = async () => {
        try {
            setLoading(true);
            setError("");

            let response;

            if (searchQuery) {
                response = await searchMovies(
                    searchQuery,
                    page,
                    controller.signal
                );
            } else if (category === "popular") {
                response = await getPopularMovies(page);
            } else if (category === "now-playing") {
                response = await getNowPlayingMovies(page);
            } else if (category === "top-rated") {
                response = await getTopRatedMovies(page);
            } else if (category === "upcoming") {
                response = await getUpcomingMovies(page);
            }

            setMovies(response.data.results || []);
            setTotalPages(response.data.total_pages || 1);
        } catch (error) {
            if (error.name === "CanceledError") {
                return;
            }

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load movies. Please try again."
            );
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };

    loadMovies();

    return () => {
        controller.abort();
    };
}, [page, category, searchQuery]);
    
   const handleSearch = (query) => {
    setPage(1);
    setSearchQuery(query);
};

    return (
        <div className="home-page">
            <h1>Movie Discovery App</h1>

<Link to="/wishlist" className="wishlist-link">
    ❤️ My Wishlist
</Link>

            <SearchBar onSearch={handleSearch} />
            <div className="category-buttons">

    <button
    className={category === "popular" ? "active-category" : ""}
    onClick={() => {
        setCategory("popular");
        setPage(1);
        setSearchQuery("");
    }}
>
    🎬 Popular
</button>

    <button
    className={category === "now-playing" ? "active-category" : ""}
    onClick={() => {
        setCategory("now-playing");
        setPage(1);
        setSearchQuery("");
    }}
>
    🔥 Now Playing
</button>

    <button
    className={category === "top-rated" ? "active-category" : ""}
    onClick={() => {
        setCategory("top-rated");
        setPage(1);
        setSearchQuery("");
    }}
>
    ⭐ Top Rated
</button>

    <button
    className={category === "upcoming" ? "active-category" : ""}
    onClick={() => {
        setCategory("upcoming");
        setPage(1);
        setSearchQuery("");
    }}
>
    📅 Upcoming
</button>

</div>

            <h2>
    {searchQuery
        ? `Search results for "${searchQuery}"`
        : category === "popular"
            ? "Popular Movies"
            : category === "now-playing"
                ? "Now Playing"
                : category === "top-rated"
                    ? "Top Rated Movies"
                    : "Upcoming Movies"}
</h2>

            {loading && (
                <h3 className="status-message">
                    Loading movies...
                </h3>
            )}

            {error && (
                <h3 className="status-message">
                    {error}
                </h3>
            )}

            {!loading && !error && movies.length === 0 && (
    <h3 className="status-message">
        {searchQuery
            ? `No movies found for "${searchQuery}". Try another search.`
            : "No movies found."}
    </h3>
)}

            {!loading && !error && movies.length > 0 && (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                        />
                    ))}
                </div>
            )}
            {!loading && !error && movies.length > 0 && (
    <div className="pagination">

        <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
        >
            Previous
        </button>

        <span>Page {page}</span>

        <button
    onClick={() => setPage(page + 1)}
    disabled={page >= totalPages}
>
    Next
</button>

    </div>
)}
        </div>
    );
}

export default Home;