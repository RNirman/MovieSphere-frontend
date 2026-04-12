import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Film, ArrowLeft } from 'lucide-react'; // Added icons for better UI

function TmdbDetail() {
    const { id } = useParams(); 
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const TMDB_DETAIL_API = `http://localhost:8080/api/v1/movies/public/tmdb/details/${id}`; 

    useEffect(() => {
        setLoading(true);
        axios.get(TMDB_DETAIL_API)
            .then(response => {
                setMovie(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('TMDb Fetch Error:', err);
                setError('Could not fetch full TMDb movie details.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
        </div>
    );
    
    if (error) return <div className="min-h-screen bg-slate-950 text-red-400 p-10 text-center">{error}</div>;

    const youtubeEmbedUrl = movie.trailerYoutubeId 
        ? `https://www.youtube.com/embed/${movie.trailerYoutubeId}`
        : null;

    const backgroundImageUrl = movie.backdropUrl || movie.posterUrl || '';
    const backgroundStyle = backgroundImageUrl ? {
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.86)), url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    } : {};

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12" style={backgroundStyle}>
            <div className="max-w-5xl mx-auto px-4">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                    <div className="flex flex-wrap gap-4 text-slate-400 items-center">
                        <span className="flex items-center gap-1">
                            <Calendar size={18} /> {movie.releaseYear}
                        </span>
                        <span className="flex items-center gap-1">
                            <User size={18} /> Director: <span className="text-violet-400">{movie.director || 'N/A'}</span>
                        </span>
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-300">TMDB SOURCE</span>
                    </div>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="lg:flex">
                        {/* Left Column: Poster */}
                        <div className="lg:w-1/3 p-6">
                            <img 
                                src={movie.posterUrl || 'https://via.placeholder.com/400x600'} 
                                alt={movie.title} 
                                className="w-full rounded-xl shadow-2xl border border-slate-700 hover:scale-[1.02] transition-transform duration-300"
                            />
                        </div>

                        {/* Right Column: Details & Trailer */}
                        <div className="lg:w-2/3 p-8">
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3 text-violet-400">Synopsis</h3>
                                <p className="text-slate-300 leading-relaxed text-lg italic">
                                    "{movie.synopsis || 'No synopsis available for this title.'}"
                                </p>
                            </div>
                            
                            {/* Trailer Section */}
                            {youtubeEmbedUrl ? (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Film size={20} /> Official Trailer
                                    </h3>
                                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-700">
                                        <iframe 
                                            src={youtubeEmbedUrl} 
                                            title="YouTube video player" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-800/50 rounded-lg text-slate-500 text-center">
                                    No video trailer available for this movie.
                                </div>
                            )}

                            {/* Back Button */}
                            <div className="pt-6 border-t border-slate-800">
                                <Link 
                                    to="/" 
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                                >
                                    <ArrowLeft size={18} /> Back to Search Results
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TmdbDetail;