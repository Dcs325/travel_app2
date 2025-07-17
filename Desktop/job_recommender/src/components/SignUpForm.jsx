import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import './SignUpForm.css';

const getFriendlyFirebaseError = (error) => {
    if (!error || !error.code) return error.message || 'An unknown error occurred.';
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please log in or use a different email.';
        case 'auth/invalid-email':
            return 'The email address is invalid. Please check and try again.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/missing-password':
            return 'Please enter a password.';
        case 'auth/operation-not-allowed':
            return 'Sign up is currently disabled. Please contact support.';
        default:
            return error.message || 'An unknown error occurred.';
    }
};

const SignUpForm = ({ onSignUp, onError, onSwitchToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verificationSent, setVerificationSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
            setVerificationSent(true);
            setLoading(false);
            setFirstName('');
            setLastName('');
            setUsername('');
            setEmail('');
            setBirthday('');
            setPassword('');
            // Do not call onSignUp until email is verified
        } catch (err) {
            setLoading(false);
            setError(getFriendlyFirebaseError(err));
            console.error(err);
            if (onError) onError(err);
        }
    };

    return (
        <div className="signup-form-container">
            <div className="signup-form-left">
                <h2 className="signup-form-title">Sign Up</h2>
                <p className="signup-form-subtitle">Create your account to get started.</p>
            </div>
            <div className="signup-form-right">
                {verificationSent ? (
                    <div className="signup-form-row" style={{ justifyContent: 'center', color: '#22c55e', fontWeight: 500, fontSize: '1.1rem' }}>
                        Verification email sent! Please check your inbox and verify your email before logging in.
                        <div style={{ marginTop: '1.5rem' }}>
                            <button type="button" className="signup-form-btn" style={{ background: '#e5e7eb', color: '#333' }} onClick={onSwitchToLogin}>
                                Back to Login
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="signup-form-row">
                            <div style={{ width: '100%' }}>
                                <label className="signup-form-label" htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="signup-form-input"
                                    required
                                />
                            </div>
                            <div style={{ width: '100%' }}>
                                <label className="signup-form-label" htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="signup-form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="signup-form-row">
                            <div style={{ width: '100%' }}>
                                <label className="signup-form-label" htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="signup-form-input"
                                    required
                                />
                            </div>
                            <div style={{ width: '100%' }}>
                                <label className="signup-form-label" htmlFor="birthday">Birthday</label>
                                <input
                                    id="birthday"
                                    type="date"
                                    value={birthday}
                                    onChange={e => setBirthday(e.target.value)}
                                    className="signup-form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="signup-form-row">
                            <div style={{ width: '100%' }}>
                                <label className="signup-form-label" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="signup-form-input"
                                    required
                                />
                            </div>
                            <div style={{ width: '100%' }}>
                                <label className="signup-form-label" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="signup-form-input"
                                    required
                                />
                            </div>
                        </div>
                        {error && <div className="signup-form-error">{error}</div>}
                        <div className="signup-form-row" style={{ justifyContent: 'center' }}>
                            <button
                                type="submit"
                                className="signup-form-btn"
                                disabled={loading}
                            >
                                {loading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </div>
                        <div className="signup-form-row" style={{ justifyContent: 'center' }}>
                            <span>Already have an account?{' '}
                                <button type="button" className="signup-form-btn" style={{ background: '#e5e7eb', color: '#333' }} onClick={onSwitchToLogin}>
                                    Login
                                </button>
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SignUpForm; 