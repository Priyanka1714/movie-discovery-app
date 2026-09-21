# movie-discovery-app
A full-stack movie discovery application built with React, Node.js, Express, SQLite, and the TMDB API.
# Movie Discovery App

A full-stack movie discovery application built with **React, Node.js, Express, SQLite, and the TMDB API**.

The application allows users to browse popular and categorized movies, search for movies, view detailed information, paginate through results, and maintain a persistent personal wishlist.


## 1. Project Overview

The Movie Discovery App is designed as a real-world movie browsing experience with a separate frontend and backend.

The React frontend communicates only with the Node.js backend. The backend acts as an abstraction layer between the application and the third-party TMDB API.

### Main Features

* Browse popular movies
* Browse Now Playing movies
* Browse Top Rated movies
* Browse Upcoming movies
* Search movies
* Pagination
* Movie details page
* Movie ratings, release dates, genres, runtime, and overview
* Add movies to wishlist
* Remove movies from wishlist
* Persistent wishlist using SQLite
* Wishlist remains available after application restart
* Back and Home navigation
* Responsive UI for desktop and mobile
* Loading states
* Empty-result states
* API error handling
* TMDB rate-limit handling
* Request cancellation for rapid search changes

---

## 2. Tech Stack

### Frontend

* React
* React Router
* Axios
* CSS
* Vite

### Backend

* Node.js
* Express.js
* Axios
* CORS
* dotenv

### Database

* SQLite
* better-sqlite3

### External API

* TMDB (The Movie Database) API

---

## 3. Project Structure

```text
movie-discovery-app/
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── database.js
│   │   │
│   │   ├── routes/
│   │   │   ├── movieRoutes.js
│   │   │   └── wishlistRoutes.js
│   │   │
│   │   └── services/
│   │       └── tmdbService.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── wishlist.db
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MovieCard.jsx
│   │   │   └── SearchBar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── services/
│   │   │   └── movieApi.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

## 4. Architecture

The application follows a simple three-layer architecture:

```text
React Frontend
      |
      | HTTP requests
      v
Node.js / Express Backend
      |
      | TMDB API requests
      v
TMDB API

Node.js Backend
      |
      | SQLite queries
      v
SQLite Database
```

### Data Flow

For movie discovery:

```text
User
 ↓
React UI
 ↓
Axios
 ↓
Express API
 ↓
TMDB Service
 ↓
TMDB API
 ↓
Express Backend
 ↓
React UI
```

For wishlist operations:

```text
User
 ↓
React UI
 ↓
Express Wishlist API
 ↓
SQLite Database
 ↓
Express Backend
 ↓
React UI
```

---

## 5. Backend as an Abstraction Layer

The React application does not directly call the TMDB movie API.

Instead:

```text
React
  ↓
/api/movies
  ↓
Express Routes
  ↓
TMDB Service
  ↓
TMDB
```

This provides several advantages:

* Keeps the TMDB API key on the server
* Prevents exposing the API key in the frontend
* Centralizes third-party API integration
* Makes error handling easier
* Makes it easier to replace TMDB in the future
* Keeps frontend code independent from TMDB-specific implementation details

---

## 6. TMDB Service

The backend contains a dedicated service:

```text
backend/src/services/tmdbService.js
```

This service handles requests for:

* Popular movies
* Now Playing movies
* Top Rated movies
* Upcoming movies
* Movie search
* Movie details

The API key is loaded using environment variables.

Example:

```env
TMDB_API_KEY=your_tmdb_api_key
PORT=5000
```

The `.env` file is excluded from Git using `.gitignore`.

---

## 7. Backend API Endpoints

### Popular Movies

```http
GET /api/movies?page=1
```

### Search Movies

```http
GET /api/movies/search?query=batman&page=1
```

### Now Playing

```http
GET /api/movies/now-playing?page=1
```

### Top Rated

```http
GET /api/movies/top-rated?page=1
```

### Upcoming

```http
GET /api/movies/upcoming?page=1
```

### Movie Details

```http
GET /api/movies/:id
```

Example:

```http
GET /api/movies/550
```

### Get Wishlist

```http
GET /api/wishlist
```

### Add to Wishlist

```http
POST /api/wishlist
```

Example request body:

```json
{
  "movie_id": 550,
  "title": "Fight Club",
  "poster_path": "/path.jpg",
  "vote_average": 8.4,
  "release_date": "1999-10-15"
}
```

### Remove from Wishlist

```http
DELETE /api/wishlist/:id
```

---

## 8. Database

SQLite is used for wishlist persistence.

The database contains a `wishlist` table:

```sql
CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    vote_average REAL,
    release_date TEXT
);
```

### Why SQLite?

SQLite was selected because:

* The project is relatively small
* No separate database server is required
* It is simple to configure
* Data persists between application restarts
* It is suitable for a local assignment/demo application
* It keeps the project easy to run and review

The `movie_id` field is unique so that the same movie cannot be added twice.

---

## 9. Frontend Pages

### Home

The Home page provides:

* Popular movies
* Category navigation
* Search
* Pagination
* Movie cards
* Wishlist navigation

### Movie Details

The details page displays:

* Movie poster
* Title
* Rating
* Release date
* Runtime
* Genres
* Overview
* Add to Wishlist
* Back navigation
* Home navigation

### Wishlist

The Wishlist page provides:

* Saved movies
* Persistent storage
* Movie details navigation
* Remove functionality
* Home navigation
* Empty wishlist state

---

## 10. Search and Pagination

Search requests are handled through the backend.

The application supports pagination using the TMDB `page` parameter.

The frontend stores:

```text
current page
total pages
search query
selected category
```

The Next button is disabled when the user reaches the final available page.

The Previous button is disabled on page 1.

---

## 11. Rapid Request Handling

Rapid search/filter changes can create multiple requests.

To avoid outdated search requests overwriting newer results, the frontend uses `AbortController`.

Example flow:

```text
Search A
   ↓
Request A

User quickly searches B
   ↓
Request A cancelled
   ↓
Request B continues
```

This reduces unnecessary processing and prevents stale results from replacing the latest search results.

---

## 12. Error Handling

The application handles several failure cases.

### Frontend

The UI displays appropriate states for:

* Loading
* Empty results
* Failed requests
* Backend errors
* TMDB service errors

### Backend

The backend handles:

* Invalid movie IDs
* Missing search queries
* TMDB API errors
* Rate limiting
* Temporary third-party service failures

For example, TMDB HTTP `429` responses are converted into a user-friendly message:

```text
Too many requests. Please try again later.
```

Temporary server-side failures are returned as:

```text
Movie service is temporarily unavailable.
```

---

## 13. Responsive Design

The application uses responsive CSS to support different screen sizes.

The movie grid automatically adapts to available screen width.

On smaller screens:

* Movie cards use fewer columns
* Search controls become vertically stacked
* Movie detail layout changes from horizontal to vertical
* Poster dimensions adapt to the screen

The application was designed to handle:

* Desktop screens
* Laptop screens
* Tablet-sized screens
* Mobile-sized screens

---

## 14. Loading and Empty States

The application provides feedback while data is loading.

Example:

```text
Loading movies...
```

When no movies are found:

```text
No movies found.
```

For an unsuccessful search:

```text
No movies found for "search-term". Try another search.
```

This prevents blank screens and gives users clear feedback.

---

## 15. Wishlist Persistence

Wishlist data is stored in SQLite rather than only in React state or browser memory.

Therefore:

```text
Add movie
   ↓
SQLite
   ↓
Close application
   ↓
Restart application
   ↓
Wishlist still available
```

This satisfies the persistence requirement across application restarts.

---

## 16. Environment Variables

The backend uses environment variables for configuration.

Create:

```text
backend/.env
```

Example:

```env
TMDB_API_KEY=your_tmdb_api_key
PORT=5000
```

Do not commit the actual `.env` file to Git.

The project `.gitignore` contains:

```text
node_modules/
.env
```

---

## 17. Installation and Setup

### Prerequisites

Install:

* Node.js
* npm
* A TMDB API key

---

### Backend Setup

Open a terminal:

```bash
cd movie-discovery-app/backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
backend/.env
```

Add:

```env
TMDB_API_KEY=your_tmdb_api_key
PORT=5000
```

Start the backend:

```bash
node src/app.js
```

The backend runs on:

```text
http://localhost:5000
```

---

### Frontend Setup

Open another terminal:

```bash
cd movie-discovery-app/frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the URL displayed by Vite in the terminal.

The frontend may use a port such as:

```text
http://localhost:5173
```

or another available Vite port.

---

## 18. Testing Checklist

Before submission, verify the following:

### Movie Discovery

* [ ] Popular movies load
* [ ] Now Playing works
* [ ] Top Rated works
* [ ] Upcoming works
* [ ] Movie posters load
* [ ] Ratings display correctly
* [ ] Release dates display correctly

### Search

* [ ] Search works
* [ ] Empty search is prevented
* [ ] Search results display
* [ ] Search pagination works
* [ ] Empty search results show a helpful message
* [ ] Rapid searches do not display stale results

### Movie Details

* [ ] Movie details open
* [ ] Poster displays
* [ ] Rating displays
* [ ] Release date displays
* [ ] Runtime displays
* [ ] Genres display
* [ ] Overview displays
* [ ] Back button works
* [ ] Home button works

### Wishlist

* [ ] Movie can be added
* [ ] Duplicate movie cannot be added
* [ ] Wishlist page loads
* [ ] Wishlist persists after restart
* [ ] Wishlist movie opens details
* [ ] Remove button works
* [ ] Remove does not open details
* [ ] Empty wishlist state works

### Error Handling

* [ ] Backend unavailable state is handled
* [ ] API errors display a message
* [ ] Empty results are handled
* [ ] Invalid movie ID is handled
* [ ] Rate-limit response is handled

### Responsive Design

* [ ] Desktop layout works
* [ ] Mobile layout works
* [ ] Search bar adapts
* [ ] Movie cards adapt
* [ ] Movie details adapt

---

## 19. Design and Technical Decisions

### React

React was selected for component-based UI development and efficient state-driven rendering.

### Express

Express provides a lightweight backend API layer and clean route organization.

### Axios

Axios is used for HTTP communication between frontend/backend and backend/TMDB.

### SQLite

SQLite provides simple persistent storage without requiring a separate database server.

### Service Layer

TMDB integration is isolated inside:

```text
services/tmdbService.js
```

This improves maintainability and keeps external API logic separate from route handling.

---

## 20. Assumptions

* TMDB is available during normal application usage.
* Users have an active internet connection for movie discovery.
* The TMDB API key is configured correctly.
* SQLite is sufficient for the expected scale of this assignment.
* Wishlist data is intended for the local application environment.
* TMDB movie metadata is treated as the source of truth for movie information.

---

## 21. Limitations

Current limitations include:

* Wishlist is stored locally in SQLite and is not associated with individual user accounts.
* There is no authentication system.
* Movie discovery depends on TMDB availability.
* TMDB API limits can affect request availability.
* Movie poster images are served using TMDB image URLs.
* The application is primarily designed as a single-user/local assignment application.

---

## 22. Future Improvements

Possible future enhancements include:

* User authentication
* User-specific wishlists
* Genre filtering
* Sorting by rating or release date
* Debounced search
* Server-side caching
* Redis caching for popular queries
* More advanced recommendation features
* Infinite scrolling
* Better accessibility support
* Automated frontend and backend tests
* Production deployment
* Centralized logging and monitoring

---

## 23. AI Usage Disclosure

AI tools were used during development as an assistance tool for:

* Understanding assignment requirements
* Generating and refining code suggestions
* Debugging implementation issues
* Improving error handling
* Reviewing application structure
* Preparing documentation
* Explaining technical concepts

The application was implemented, tested, and modified based on the project's actual requirements and behavior.

AI assistance does not replace the developer's responsibility for understanding, testing, debugging, and explaining the implementation.

---

## 24. Maintainability

The project separates responsibilities into different layers:

```text
Frontend Components
        ↓
Frontend API Service
        ↓
Backend Routes
        ↓
TMDB Service / Database
```

This separation makes it easier to:

* Modify the UI without changing API integration
* Replace TMDB with another movie provider
* Add new movie categories
* Add additional database features
* Add authentication later
* Add automated tests
* Introduce caching

---

## 25. Conclusion

The Movie Discovery App provides a complete full-stack movie discovery workflow with:

* React-based responsive UI
* Node.js/Express backend
* TMDB API integration
* SQLite persistence
* Search
* Categories
* Pagination
* Movie details
* Persistent wishlist
* Error handling
* Request cancellation
* Mobile-responsive design

The architecture keeps third-party API communication inside the backend while providing a clean and maintainable interface for the React frontend.

