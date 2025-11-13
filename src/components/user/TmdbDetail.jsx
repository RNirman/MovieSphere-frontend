import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function TmdbDetail() {
    // Fetches the ID from the URL parameter (This ID IS the TMDb ID)
    const { id } = useParams(); 
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Endpoint must match the new Spring Boot public TMDb detail path
    const TMDB_DETAIL_API = `http://localhost:8080/api/v1/movies/public/tmdb/details/${id}`; 

    useEffect(() => {
        setLoading(true);
        axios.get(TMDB_DETAIL_API)
            .then(response => {
                setMovie(response.data);
                setLoading(false);
                console.log('TMDb Movie Details:', response.data); // Debug log
            })
            .catch(err => {
                console.error('TMDb Fetch Error:', err);
                setError('Could not fetch full TMDb movie details. The movie might not exist.');
                setLoading(false);
            });
    }, [id]);

    // --- Loading and Error JSX (omitted for brevity, use your existing Tailwind JSX) ---
    if (loading) { /* ... */ return <p>Loading TMDb movie details...</p>; }
    if (error) { /* ... */ return <p className="alert-danger">{error}</p>; }

    // --- Trailer URL Helper ---
    const youtubeEmbedUrl = movie.trailerYoutubeId 
        ? `https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=0`
        : null;

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold">{movie.title} (Source: TMDb)</h1>
                <h4 className="text-slate-400 mt-2">Director: {movie.director || 'N/A'}</h4>
                
                <div className="mt-6 bg-slate-900/50 rounded-xl p-6 lg:flex lg:gap-8">
                    {/* Poster */}
                    <div className="lg:w-1/3">
                        <img src={movie.posterUrl || 'https://via.placeholder.com/400x600'} alt={`Poster for ${movie.title}`} className="w-full rounded-lg shadow-lg" />
                    </div>

                    {/* Details */}
                    <div className="lg:flex-1 mt-6 lg:mt-0">
                        <p className="text-slate-300 mb-6 leading-relaxed border-l-4 border-violet-500 pl-3">
                            **Synopsis:** {movie.synopsis || 'No synopsis available.'}
                        </p>
                        <p className="text-slate-400">**Released:** {movie.releaseYear}</p>
                        
                        {/* Trailer */}
                        {youtubeEmbedUrl && (
                            <div className="mt-6">
                                <h5 className="text-xl font-semibold text-slate-300 mb-3">Trailer</h5>
                                <div className="ratio ratio-16x9">
                                    <iframe src={youtubeEmbedUrl} title={`Trailer for ${movie.title}`} allowFullScreen className="w-full h-80 rounded-lg shadow-xl"></iframe>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-6 pt-4 border-t border-slate-800">
                            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200">
                                ← Back to Search Results
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TmdbDetail;