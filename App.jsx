import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Wishlist from "./pages/Wishlist";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/movies/:id"
                    element={<MovieDetails />}
                />
                <Route
    path="/wishlist"
    element={<Wishlist />}
/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;