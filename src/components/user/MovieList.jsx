import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Film, ChevronLeft, ChevronRight } from 'lucide-react';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [featuredIndex, setFeaturedIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);

    const pickRandomMovies = (movieArray, count = 5) => {
        const shuffled = [...movieArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    const currentFeatured = featuredMovies[featuredIndex] || null;

    // Fetch function accepts an optional query argument
    const fetchMovies = useCallback(async (query = '') => {
        setLoading(true);
        try {
            let apiUrl = '';

            if (query) {
                // 1. Search (user-initiated TMDb search)
                apiUrl = `http://localhost:8080/api/v1/movies/public/search?title=${encodeURIComponent(query)}`;
            } else {
                // 2. Initial Load (popular TMDb movies)
                // Use the new public popular endpoint when no search query is present
                apiUrl = `http://localhost:8080/api/v1/movies/public/popular`; 
            }

            const response = await axios.get(apiUrl);
            const results = response.data || [];
            setMovies(results);
            const randomMovies = pickRandomMovies(results, 5);
            setFeaturedMovies(randomMovies);
            setFeaturedIndex(0);
            setLoading(false);
            console.log('Fetched movies:', response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
            setMovies([]); 
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

    const nextFeatured = () => {
        if (featuredMovies.length < 2) return;
        setFeaturedIndex(prev => (prev + 1) % featuredMovies.length);
    };

    const prevFeatured = () => {
        if (featuredMovies.length < 2) return;
        setFeaturedIndex(prev => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    };

    useEffect(() => {
        if (featuredMovies.length < 2) return;

        const autoCycle = setInterval(() => {
            setFeaturedIndex(prev => (prev + 1) % featuredMovies.length);
        }, 6000);

        return () => clearInterval(autoCycle);
    }, [featuredMovies]);

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
                    <label htmlFor="movie-search" className="sr-only">Search movies</label>
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
                        {loading ? 'Searching...' : 'Search'}
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

            {/* Featured Banner Slider */}
            {currentFeatured && (
                <div className="relative mb-10 overflow-hidden rounded-3xl bg-slate-950 shadow-2xl shadow-slate-900/50">
                    <div
                        className="relative h-[420px] sm:h-[460px] lg:h-[520px] w-full bg-cover bg-center"
                        style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9) 20%, rgba(15, 23, 42, 0.35) 60%, rgba(15, 23, 42, 0.9) 100%), url(${currentFeatured.backdropUrl || currentFeatured.posterUrl || currentFeatured.fullPosterUrl || 'https://via.placeholder.com/1400x500?text=No+Image'})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/20 to-slate-950/90"></div>
                        <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12 lg:px-20 text-white">
                            <span className="inline-flex items-center gap-2 mb-4 text-sm uppercase tracking-[0.3em] text-violet-300">
                                Featured Movie
                            </span>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight max-w-3xl mb-5">
                                {currentFeatured.title}
                            </h2>
                            <p className="max-w-xl text-slate-200 text-base sm:text-lg leading-relaxed mb-8">
                                {currentFeatured.synopsis ? `${currentFeatured.synopsis.substring(0, 190)}${currentFeatured.synopsis.length > 190 ? '…' : ''}` : 'Explore the full movie page for more details, trailers, and cast information.'}
                            </p>
                            <div className="flex flex-wrap gap-3 items-center">
                                <Link
                                    to={currentFeatured.release_date && !currentFeatured.release_year ? `/tmdb-details/${currentFeatured.id}` : `/movies/${currentFeatured.id}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 transition"
                                >
                                    View Details
                                </Link>
                                <span className="text-slate-400 text-sm">
                                    {currentFeatured.releaseYear || (currentFeatured.release_date ? String(currentFeatured.release_date).substring(0, 4) : 'N/A')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {featuredMovies.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prevFeatured}
                                className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white shadow-lg shadow-black/40 hover:bg-black/60 transition"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={nextFeatured}
                                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white shadow-lg shadow-black/40 hover:bg-black/60 transition"
                            >
                                <ChevronRight size={20} />
                            </button>

                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                {featuredMovies.map((_, dotIndex) => (
                                    <button
                                        key={dotIndex}
                                        type="button"
                                        onClick={() => setFeaturedIndex(dotIndex)}
                                        className={`h-2.5 w-2.5 rounded-full transition ${featuredIndex === dotIndex ? 'bg-violet-400' : 'bg-slate-500/70 hover:bg-slate-200/80'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

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
            {/* {movies.length > 0 && (
                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm">
                        Showing {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
                    </p>
                </div>
            )} */}
        </div>
    );
}

export default MovieList;