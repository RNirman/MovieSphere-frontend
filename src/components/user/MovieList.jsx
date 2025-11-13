import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);

    // Fetch function accepts an optional query argument
    const fetchMovies = useCallback(async (query = '') => {
        setLoading(true);
        try {
            let apiUrl = '';

            if (query) {
                // If searching, use the public TMDb search endpoint
                apiUrl = `http://localhost:8080/api/v1/movies/public/search?title=${encodeURIComponent(query)}`;
            } else {
                // If not searching, use the existing local MySQL endpoint
                apiUrl = `http://localhost:8080/api/v1/movies`;
            }

            console.log('Fetching from:', apiUrl); // Debug log
            const response = await axios.get(apiUrl);

            setMovies(response.data);
            console.log('Fetched movies:', response.data); // Debug log
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            console.error('Error response:', error.response); // More detailed error
            setLoading(false);
        }
    }, []);

    // Initial load once on mount (no search query)
    useEffect(() => {
        if (!searchPerformed && !searchTerm) {
            fetchMovies();
        }
    }, [fetchMovies, searchPerformed, searchTerm]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchPerformed(true);
        fetchMovies(searchTerm);
    };
    
    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchPerformed(false);
        fetchMovies('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="text-center">
                    <div className="inline-block w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 text-lg">Loading movies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-8">
            {/* Hero Section */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 mb-6 shadow-lg shadow-violet-600/30">
                    <Film className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                    Explore MovieSphere
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Discover your next favorite movie from our curated collection
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
                <div className="flex max-w-2xl mx-auto gap-0">
                    <label htmlFor="movie-search" className="sr-only">Search movies on TMDb</label>
                    <input
                        id="movie-search"
                        type="text"
                        placeholder="Search TMDb by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-l-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-r-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Searching...' : 'Search TMDb'}
                    </button>

                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="ml-3 px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </form>

            {/* Movie List */}
            {movies.length === 0 ? (
                <div className="max-w-md mx-auto">
                    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 text-center backdrop-blur-sm">
                        <Film className="w-12 h-12 text-violet-400 mx-auto mb-3" />
                        <p className="text-white font-medium">
                            {searchPerformed && searchTerm 
                                ? 'No movies found matching your TMDb search.' 
                                : 'No movies found'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map(movie => {
                        const isTmdbResult = !!movie.release_date && !movie.release_year;
                        const idKey = movie.id;
                        const linkPath = isTmdbResult ? `/tmdb-details/${idKey}` : `/movies/${idKey}`;
                        
                        const displayYear = movie.releaseYear || (movie.release_date ? String(movie.release_date).substring(0, 4) : 'N/A');
                        const posterUrl = movie.posterUrl || movie.fullPosterUrl || 'https://via.placeholder.com/400x600?text=No+Poster';
                        const source = isTmdbResult ? 'TMDb' : 'Local';

                        return (
                            <div key={idKey} className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-violet-500/50 transition-all">
                                <img
                                    src={posterUrl}
                                    alt={`Poster for ${movie.title}`}
                                    className="w-full h-56 object-cover"
                                    style={{ height: '350px' }}
                                />
                                <div className="p-4 flex flex-col h-44">
                                    <h5 className="text-lg font-semibold text-white truncate" title={movie.title}>
                                        {movie.title} ({displayYear})
                                    </h5>
                                    <p className="text-slate-400 text-sm mb-3 flex-1">Genre: {movie.genre || null}</p>
                                    <Link to={linkPath} className="mt-auto inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-center hover:from-violet-500 hover:to-blue-500 transition-all">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Movie Count Footer */}
            {movies.length > 0 && (
                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm">
                        Showing {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default MovieList;