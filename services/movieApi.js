import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getPopularMovies = async (page = 1) => {
    const response = await API.get("/movies", {
        params: {
            page: page,
        },
    });

    return response.data;
};
export const getNowPlayingMovies = async (page = 1) => {
    const response = await API.get("/movies/now-playing", {
        params: {
            page: page,
        },
    });

    return response.data;
};

export const getTopRatedMovies = async (page = 1) => {
    const response = await API.get("/movies/top-rated", {
        params: {
            page: page,
        },
    });

    return response.data;
};

export const getUpcomingMovies = async (page = 1) => {
    const response = await API.get("/movies/upcoming", {
        params: {
            page: page,
        },
    });

    return response.data;
};

export const searchMovies = async (query, page = 1, signal) => {
    const response = await API.get("/movies/search", {
        params: {
            query: query,
            page: page,
        },
        signal: signal,
    });

    return response.data;
};

export const getMovieDetails = async (id) => {
    const response = await API.get(`/movies/${id}`);

    return response.data;
};
export const getWishlist = async () => {
    const response = await API.get("/wishlist");

    return response.data;
};

export const addToWishlist = async (movie) => {
    const response = await API.post("/wishlist", {
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
    });

    return response.data;
};

export const removeFromWishlist = async (id) => {
    const response = await API.delete(`/wishlist/${id}`);

    return response.data;
};