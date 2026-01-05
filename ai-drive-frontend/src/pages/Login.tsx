import React, { useState } from 'react';
import '../css/Login.css';
import { authService } from '../services/authService';

const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                console.log('Calling login service...');
                const result = await authService.login({ phone, password });
                console.log('Login successful, user:', result);
            } else {
                console.log('Calling register service...');
                const result = await authService.register({ name, phone, password });
                console.log('Register successful, user:', result);
            }

            // Navigate to dashboard
            window.history.pushState({}, '', '/dashboard');
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (error: any) {
            console.error('Auth error:', error);
            setError(error.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-left">
                    <h1 className="welcome-title">
                        {isLogin ? 'Welcome Back!' : 'Join Us!'}
                    </h1>
                    <p className="welcome-subtitle">
                        {isLogin
                            ? 'We\'re so excited to see you again! Sign in to continue your journey with us.'
                            : 'Start your amazing journey with us today. Create your account and discover new possibilities.'}
                    </p>
                </div>

                <div className="login-right">
                    <h2 className="form-title">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </h2>
                    <p className="form-subtitle">
                        {isLogin ? 'Enter your details to sign in' : 'Fill in your information to get started'}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                className="form-input"
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder=" "
                                required
                            />
                            <label className="form-label">Full Name</label>
                        </div>

                        <div className="form-group">
                            <input
                                className="form-input"
                                type="tel"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder=" "
                                required
                            />
                            <label className="form-label">Phone Number</label>
                        </div>
                        <div className="form-group password-group">
                            <input
                                className="form-input"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=" "
                                required
                            />
                            <label className="form-label">Password</label>
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>

                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="toggle-section">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="toggle-button"
                        >
                            {isLogin ? 'Sign up here' : 'Sign in here'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;