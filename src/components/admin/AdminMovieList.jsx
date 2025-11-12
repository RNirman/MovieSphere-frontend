import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Film, Calendar, Tag, AlertCircle } from 'lucide-react';

function AdminMovieList({ auth }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = auth || localStorage.getItem('adminToken');

    const fetchMovies = () => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/movies`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setMovies(response.data);
                    console.log("Fetched movies for Admin:", response.data);
                } else {
                    console.error("API response data was not an array:", response.data);
                    setMovies([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching movies for Admin:', error);
                setMovies([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleDelete = (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            axios.delete(`http://localhost:8080/api/v1/movies/${id}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
                .then(() => {
                    // Success notification
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                    notification.textContent = 'Movie deleted successfully!';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 3000);
                    
                    fetchMovies();
                })
                .catch(error => {
                    console.error('Error deleting movie:', error);
                    alert('Failed to delete movie. Please try again.');
                });
        }
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
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
                            <Film className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Admin Movie Management</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {movies.length} {movies.length === 1 ? 'movie' : 'movies'} in database
                            </p>
                        </div>
                    </div>
                    
                    <Link 
                        to="/admin/new"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all duration-200 font-semibold text-white shadow-lg shadow-green-600/30"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Movie
                    </Link>
                </div>
            </div>

            {/* Movies Table/Cards */}
            {Array.isArray(movies) && movies.length > 0 ? (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800/50 border-b border-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Poster</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Year</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Genre</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {movies.map(movie => (
                                        <tr key={movie.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 text-sm font-mono">
                                                #{movie.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <img 
                                                    src={movie.posterUrl || 'https://via.placeholder.com/100x150?text=No+Poster'} 
                                                    alt={movie.title}
                                                    className="w-12 h-16 object-cover rounded border border-slate-700"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{movie.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                {movie.releaseYear}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm border border-violet-500/30">
                                                    <Tag className="w-3 h-3" />
                                                    {movie.genre}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        to={`/admin/edit/${movie.id}`}
                                                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 text-sm font-medium"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(movie.id, movie.title)}
                                                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 text-sm font-medium"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                        {movies.map(movie => (
                            <div 
                                key={movie.id}
                                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-5 hover:border-violet-500/30 transition-all duration-200"
                            >
                                <div className="flex gap-4">
                                    <img 
                                        src={movie.posterUrl || 'https://via.placeholder.com/100x150?text=No+Poster'} 
                                        alt={movie.title}
                                        className="w-20 h-28 object-cover rounded border border-slate-700"
                                    />
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 font-mono mb-1">#{movie.id}</div>
                                        <h3 className="text-lg font-bold text-white mb-2">{movie.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {movie.releaseYear}
                                            </div>
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs border border-violet-500/30">
                                                <Tag className="w-3 h-3" />
                                                {movie.genre}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link 
                                                to={`/admin/edit/${movie.id}`}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 transition-all duration-200 text-sm font-medium flex-1 justify-center"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(movie.id, movie.title)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 transition-all duration-200 text-sm font-medium flex-1 justify-center"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="max-w-md mx-auto">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-8 text-center backdrop-blur-sm">
                        <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-blue-300 mb-2">No Movies Yet</h3>
                        <p className="text-slate-400 mb-6">
                            Get started by adding your first movie to the database
                        </p>
                        <Link 
                            to="/admin/new"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all duration-200 font-semibold text-white shadow-lg shadow-green-600/30"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Movie
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminMovieList;