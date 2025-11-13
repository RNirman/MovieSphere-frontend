import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function MovieForm({ auth }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = auth || localStorage.getItem('adminToken');

    const [movie, setMovie] = useState({
        title: '',
        genre: '',
        releaseYear: '',
        posterUrl: '',
        synopsis: '',
        director: '',
        trailerYoutubeId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    useEffect(() => {
        if (id && token) {
            setLoading(true);
            // Use Bearer token (consistent with save request) and make response parsing resilient
            axios.get(`http://localhost:8080/api/v1/movies/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    const rd = response.data || {};
                    const fetchedMovie = {
                        // provide several fallbacks in case backend field names differ
                        title: rd.title || rd.name || '',
                        genre: rd.genre || rd.genres?.join(', ') || rd.category || '',
                        releaseYear: rd.releaseYear || rd.release_year || (rd.release_date ? String(rd.release_date).substring(0, 4) : '') || '',
                        posterUrl: rd.posterUrl || rd.fullPosterUrl || rd.poster_path || '',
                        synopsis: rd.synopsis || rd.overview || rd.description || '',
                        director: rd.director || rd.directorName || '',
                        trailerYoutubeId: rd.trailerYoutubeId || rd.trailer_youtube_id || '',
                    };
                    setMovie(fetchedMovie);
                    setLoading(false);
                    console.log('Fetched movie for edit:', fetchedMovie);
                })
                .catch(err => {
                    console.error('Error fetching movie for edit:', err, err.response?.status, err.response?.data);
                    // Show a clearer error if it's an auth issue
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        setError('Unauthorized: please sign in as admin to edit movies.');
                    } else {
                        setError('Failed to load movie data for editing.');
                    }
                    setLoading(false);
                });
        }
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Correctly handle the releaseYear conversion
        const updatedValue = name === 'releaseYear' ? (value ? parseInt(value) : '') : value;

        setMovie(prevMovie => ({
            ...prevMovie,
            [name]: updatedValue
        }));
    };

    const handleSearch = async () => {
        if (!searchTerm) return;

        setIsSearching(true);
        setSearchError(null);

        try {
            // NOTE: Search endpoint is public, so no auth header needed here
            const response = await axios.get(`http://localhost:8080/api/v1/movies/search/tmdb?title=${searchTerm}`);
            setSearchResults(response.data);
            console.log('TMDb Search Results:', response.data);
            if (response.data.length === 0) {
                setSearchError(`No results found for "${searchTerm}".`);
            }
        } catch (err) {
            console.error('TMDb Search Error:', err);
            setSearchError('Error contacting movie database service.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectMovie = async (tmdbMovie) => {
        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]); // Clear results after selection

        try {
            // Optional: Fetch the YouTube key now (requires a new endpoint or service in backend)
            // For simplicity, we'll assume the TmdbService includes the key in a subsequent call 
            // or the key can be fetched separately and added to the state.

            // Populate the main movie state with fetched data
            setMovie(prev => ({
                ...prev,
                title: tmdbMovie.title,
                genre: prev.genre, // TMDb doesn't give genre easily, keep existing or leave blank
                releaseYear: tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.substring(0, 4)) : '',
                posterUrl: tmdbMovie.fullPosterUrl,
                synopsis: tmdbMovie.overview,
                director: '', // This requires another TMDb endpoint (credits) - simplifying for now
                // trailerYoutubeId: fetchTrailerKey(tmdbMovie.id), // Placeholder for dedicated trailer logic
            }));
            setSearchTerm(''); // Clear search bar
            console.log('Selected TMDb Movie:', tmdbMovie);

        } catch (err) {
            setSearchError('Error processing selection.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const request = id
            ? axios.put(`http://localhost:8080/api/v1/movies/${id}`, movie, config)
            : axios.post(`http://localhost:8080/api/v1/movies`, movie, config);

        request
            .then(() => {
                alert(`Movie ${id ? 'updated' : 'created'} successfully!`);
                navigate('/admin');
            })
            .catch(err => {
                console.error('Error saving movie:', err);
                setError(`Failed to save movie: ${err.response?.data?.message || err.message || 'Check network connection.'}`);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading && id) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400">Loading movie details for editing...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">{id ? `✏️ Edit Movie: ${movie.title}` : '➕ Add New Movie'}</h2>
                    {error && (
                        <div className="mt-3 bg-red-600/10 border border-red-500/20 text-red-200 rounded-lg p-3">
                            {error}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
                    <div className="mb-6 border p-4 rounded bg-slate-800 border-slate-700">
                        <h3 className="text-lg font-semibold mb-3">Lookup Movie Details</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search TMDb by Title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-600 rounded text-white font-semibold"
                                disabled={isSearching}
                            >
                                {isSearching ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        {searchError && <p className="text-red-400 mt-2">{searchError}</p>}

                        {/* Search Results Display */}
                        {searchResults.length > 0 && (
                            <div className="mt-4 max-h-48 overflow-y-auto border-t border-slate-700 pt-3">
                                {searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="flex justify-between items-center p-2 hover:bg-slate-700/50 cursor-pointer rounded"
                                        onClick={() => handleSelectMovie(result)}
                                    >
                                        <p>{result.title} ({result.release_date ? result.release_date.substring(0, 4) : 'N/A'})</p>
                                        <button type="button" className="text-sm text-green-400">Select</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {/* EXISTING FIELDS */}
                        <div><label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                            <input type="text" id="title" name="title" value={movie.title} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100" required /></div>
                        <div><label htmlFor="genre" className="block text-sm font-medium text-slate-300 mb-1">Genre</label>
                            <input type="text" id="genre" name="genre" value={movie.genre} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100" required /></div>
                        <div><label htmlFor="releaseYear" className="block text-sm font-medium text-slate-300 mb-1">Release Year</label>
                            <input type="number" id="releaseYear" name="releaseYear" value={movie.releaseYear || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100" required min="1888" max={new Date().getFullYear() + 1} /></div>
                        <div><label htmlFor="posterUrl" className="block text-sm font-medium text-slate-300 mb-1">Poster URL</label>
                            <input type="url" id="posterUrl" name="posterUrl" value={movie.posterUrl} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100" />
                            <p className="text-sm text-slate-400 mt-1">Provide a direct link to the movie poster image.</p></div>

                        {/* NEW FIELD 1: DIRECTOR */}
                        <div><label htmlFor="director" className="block text-sm font-medium text-slate-300 mb-1">Director</label>
                            <input type="text" id="director" name="director" value={movie.director || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100" /></div>

                        {/* NEW FIELD 2: SYNOPSIS */}
                        <div><label htmlFor="synopsis" className="block text-sm font-medium text-slate-300 mb-1">Synopsis</label>
                            <textarea id="synopsis" name="synopsis" value={movie.synopsis || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100" rows="3"></textarea></div>

                        {/* NEW FIELD 3: YOUTUBE ID */}
                        <div><label htmlFor="trailerYoutubeId" className="block text-sm font-medium text-slate-300 mb-1">Trailer YouTube ID</label>
                            <input type="text" id="trailerYoutubeId" name="trailerYoutubeId" value={movie.trailerYoutubeId || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100" />
                            <p className="text-sm text-slate-400 mt-1">Example: For https://www.youtube.com/watch?v=**YoHD9XEInc0**, use only **YoHD9XEInc0**.</p></div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow" disabled={loading}>
                            {loading ? 'Saving...' : (id ? 'Update Movie' : 'Create Movie')}
                        </button>
                        <button type="button" onClick={() => navigate('/admin')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-800">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MovieForm;