import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import './LoginForm.css';
const LoginForm = ({ onLogin, onError, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMsg, setResetMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            setEmail('');
            setPassword('');
            if (onLogin) onLogin(userCredential.user);
        } catch (err) {
            setLoading(false);
            setError(err.message);
            if (onError) onError(err);
        }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        setResetMsg('');
        setError(null);
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMsg('Password reset email sent! Please check your inbox.');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSocialLogin = async (provider) => {
        setError(null);
        setLoading(true);
        const auth = getAuth();
        try {
            await signInWithPopup(auth, provider);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <div className="login-form-container">
            <div className="login-form-title">Login</div>
            <div className="login-form-subtitle">Enter your credentials to access your account.</div>
            {showForgot ? (
                <form onSubmit={handleForgot}>
                    <label className="login-form-label" htmlFor="resetEmail">Enter your email to reset password</label>
                    <input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        className="login-form-input"
                        required
                    />
                    {resetMsg && <div className="login-form-error" style={{ color: '#22c55e' }}>{resetMsg}</div>}
                    {error && <div className="login-form-error">{error}</div>}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="login-form-btn">Send Reset Email</button>
                        <button type="button" className="login-form-btn" style={{ background: '#e5e7eb', color: '#333' }} onClick={() => setShowForgot(false)}>Back to Login</button>
                    </div>
                </form>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <label className="login-form-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="login-form-input"
                            required
                        />
                        <label className="login-form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="login-form-input"
                            required
                        />
                        {error && <div className="login-form-error">{error}</div>}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="submit"
                                className="login-form-btn"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            {onSwitchToSignUp && (
                                <button
                                    type="button"
                                    className="login-form-btn"
                                    style={{ background: '#e5e7eb', color: '#333' }}
                                    onClick={onSwitchToSignUp}
                                >
                                    Register Now
                                </button>
                            )}
                        </div>
                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <button type="button" style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', textDecoration: 'underline', fontSize: '1em' }} onClick={() => setShowForgot(true)}>
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '0.5rem', color: '#888' }}>or sign in with</div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                type="button"
                                className="login-form-btn"
                                style={{ background: '#fff', color: '#333', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                onClick={() => handleSocialLogin(new GoogleAuthProvider())}
                                disabled={loading}
                            >
                                <span style={{ fontWeight: 600 }}>G</span> Google
                            </button>
                            <button
                                type="button"
                                className="login-form-btn"
                                style={{ background: '#fff', color: '#333', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                onClick={() => handleSocialLogin(new GithubAuthProvider())}
                                disabled={loading}
                            >
                                <span style={{ fontWeight: 600 }}>GH</span> GitHub
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LoginForm;