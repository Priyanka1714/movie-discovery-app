const axios = require("axios");

const tmdbClient = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params: {
        api_key: process.env.TMDB_API_KEY
    }
});

async function getPopularMovies(page = 1) {

    const response = await tmdbClient.get("/movie/popular", {
        params: {
            language: "en-US",
            page: page
        }
    });

    return response.data;
}

async function searchMovies(query, page = 1) {

    const response = await tmdbClient.get("/search/movie", {
        params: {
            query: query,
            language: "en-US",
            page: page,
            include_adult: false
        }
    });

    return response.data;
}

async function getMovieDetails(movieId) {

    const response = await tmdbClient.get(`/movie/${movieId}`, {
        params: {
            language: "en-US"
        }
    });

    return response.data;
}
async function getNowPlayingMovies(page = 1) {
    const response = await tmdbClient.get("/movie/now_playing", {
        params: {
            language: "en-US",
            page: page
        }
    });

    return response.data;
}

async function getTopRatedMovies(page = 1) {
    const response = await tmdbClient.get("/movie/top_rated", {
        params: {
            language: "en-US",
            page: page
        }
    });

    return response.data;
}

async function getUpcomingMovies(page = 1) {
    const response = await tmdbClient.get("/movie/upcoming", {
        params: {
            language: "en-US",
            page: page
        }
    });

    return response.data;
}

module.exports = {
    getPopularMovies,
    getNowPlayingMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    searchMovies,
    getMovieDetails
};