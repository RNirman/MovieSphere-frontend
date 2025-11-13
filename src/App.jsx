import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MovieList from './components/user/MovieList';
import MovieDetail from './components/user/MovieDetail';
import AdminMovieList from './components/admin/AdminMovieList';
import MovieForm from './components/admin/MovieForm';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLogin from './components/admin/AdminLogin';
import TmdbDetail from './components/user/TmdbDetail';

const ProtectedRoute = ({ auth, children }) => {
    if (!auth) {
        return <Navigate to="/admin-login" replace />;
    }
    return children;
};

function AppContent({ auth, setAuth }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin-login';

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {!isLoginPage && <Header auth={auth} setAuth={setAuth} />}
      
      <main className={isLoginPage ? '' : 'container mx-auto flex-grow px-4 py-4'}>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/tmdb-details/:id" element={<TmdbDetail />} />
          <Route path="/admin-login" element={<AdminLogin setAuth={setAuth} />} />
          <Route path="/admin" element={
            <ProtectedRoute auth={auth}>
              <AdminMovieList auth={auth} />
            </ProtectedRoute>
          } />
          <Route path="/admin/new" element={
            <ProtectedRoute auth={auth}>
              <MovieForm auth={auth} />
            </ProtectedRoute>
          } />
          <Route path="/admin/edit/:id" element={
            <ProtectedRoute auth={auth}>
              <MovieForm auth={auth} />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <Navigate to="/" replace />
          } />
        </Routes>
      </main>
      
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    return localStorage.getItem('adminToken') || null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem('adminToken', auth);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [auth]);

  return (
    <Router>
      <AppContent auth={auth} setAuth={setAuth} />
    </Router>
  );
}

export default App;