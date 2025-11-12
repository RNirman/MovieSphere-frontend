import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Film, Calendar, Tag, Eye, Star } from 'lucide-react';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch movies from the Spring Boot API
        axios.get('http://localhost:8080/api/v1/movies') 
            .then(response => {
                setMovies(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching movie list:', error);
                setLoading(false);
            });
    }, []);

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

            {/* Movies Grid */}
            {movies.length === 0 ? (
                <div className="max-w-md mx-auto">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
                        <Film className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <p className="text-blue-300 font-medium">No movies found</p>
                        <p className="text-slate-400 text-sm mt-2">Please add some via the Admin Panel</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {movies.map(movie => (
                        <div 
                            key={movie.id}
                            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-600/20 hover:-translate-y-1"
                        >
                            {/* Movie Poster */}
                            <div className="relative overflow-hidden aspect-[2/3] bg-slate-800">
                                <img 
                                    src={movie.posterUrl || 'https://via.placeholder.com/400x600?text=No+Poster'} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                    alt={`Poster for ${movie.title}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Rating Badge (if you have rating data) */}
                                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-700/50">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm font-semibold text-white">
                                        {movie.rating || '8.5'}
                                    </span>
                                </div>
                            </div>

                            {/* Movie Info */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
                                    {movie.title}
                                </h3>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>{movie.releaseYear}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                                        <Tag className="w-4 h-4" />
                                        <span>{movie.genre}</span>
                                    </div>
                                </div>

                                {/* Description Preview (if available) */}
                                {movie.description && (
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                        {movie.description}
                                    </p>
                                )}

                                <Link 
                                    to={`/movies/${movie.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-200 font-semibold text-white shadow-lg shadow-violet-600/20"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
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