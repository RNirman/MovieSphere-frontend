import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function MovieDetail() {
    // Get the 'id' parameter from the URL path (/movies/:id)
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        // GET request is public, so no auth header is needed here
        axios.get(`http://localhost:8080/api/v1/movies/${id}`)
            .then(response => {
                setMovie(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Could not find movie with ID: ' + id);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="text-center">
                    <div className="inline-block w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 text-lg">Loading movie...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">Movie not found</h3>
                    <p className="text-slate-400 mb-4">{error}</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                        ← Back to All Movies
                    </Link>
                </div>
            </div>
        );
    }

    // Determine the YouTube embed URL
    const youtubeEmbedUrl = movie.trailerYoutubeId 
        ? `https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=0`
        : null;

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12">
            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-6 flex items-center gap-4">
                    <h1 className="text-3xl font-bold">{movie.title}</h1>
                    <div className="text-slate-400">•</div>
                    <div className="text-slate-400">{movie.releaseYear}</div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden p-6 lg:p-8">
                    <div className="lg:flex lg:gap-8">
                        {/* POSTER SECTION */}
                        <div className="lg:w-1/3 flex-shrink-0 mb-6 lg:mb-0">
                            <img
                                src={movie.posterUrl || 'https://via.placeholder.com/400x600?text=No+Poster'}
                                alt={`Poster for ${movie.title}`}
                                className="w-full h-auto rounded-lg border border-slate-700 shadow-lg object-cover"
                            />
                        </div>

                        {/* DETAILS SECTION */}
                        <div className="lg:flex-1">
                            <div className="mb-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm border border-violet-500/30">
                                    Genre: {movie.genre}
                                </span>
                            </div>

                            {movie.director && (
                                <p className="text-slate-400 mb-4"><strong>Director:</strong> {movie.director}</p>
                            )}
                            
                            {movie.synopsis && (
                                <p className="text-slate-300 mb-6 leading-relaxed border-l-4 border-slate-700 pl-3">
                                    {movie.synopsis}
                                </p>
                            )}
                            
                            {/* YOUTUBE TRAILER INTEGRATION */}
                            {youtubeEmbedUrl && (
                                <div className="mt-6">
                                    <h5 className="text-xl font-semibold text-slate-300 mb-3">Trailer</h5>
                                    <div className="ratio ratio-16x9">
                                        <iframe 
                                            // The core YouTube embed URL using the ID
                                            src={youtubeEmbedUrl}
                                            title={`Trailer for ${movie.title}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-80 rounded-lg shadow-xl"
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                                <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-800 transition">
                                    ← Back to All Movies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;