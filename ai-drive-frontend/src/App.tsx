import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { authService } from './services/authService';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      const urlPath = window.location.pathname;
      
      if (isAuthenticated && urlPath !== '/dashboard') {
        setCurrentPage('dashboard');
        window.history.replaceState({}, '', '/dashboard');
      } else if (!isAuthenticated && urlPath === '/dashboard') {
        setCurrentPage('login');
        window.history.replaceState({}, '', '/');
      } else if (isAuthenticated) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('login');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const isAuthenticated = authService.isAuthenticated();
      const urlPath = window.location.pathname;
      
      if (!isAuthenticated) {
        setCurrentPage('login');
        if (urlPath !== '/') {
          window.history.replaceState({}, '', '/');
        }
      } else {
        setCurrentPage(urlPath === '/dashboard' ? 'dashboard' : 'login');
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when page changes
  useEffect(() => {
    const newPath = currentPage === 'dashboard' ? '/dashboard' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  }, [currentPage]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    return <Dashboard />;
  }

  return <Login />;
}

export default App;