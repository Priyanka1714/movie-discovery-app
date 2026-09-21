import { useState } from "react";

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedQuery = query.trim();

        if (trimmedQuery) {
            onSearch(trimmedQuery);
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />

            <button type="submit">
                Search
            </button>
        </form>
    );
}

export default SearchBar;