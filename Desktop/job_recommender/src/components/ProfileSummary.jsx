import React from 'react';
import './ProfileSummary.css';
const ProfileSummary = ({ userProfile, userId }) => {
    if (!userProfile || !userId) return null;
    return (
        <div className="profile-summary-container">
            <div className="profile-summary-title">Your Profile Summary:</div>
            <div className="profile-summary-row">
                <span className="profile-summary-label">Skills:</span>
                <span className="profile-summary-value">{userProfile.skills || 'N/A'}</span>
            </div>
            <div className="profile-summary-row">
                <span className="profile-summary-label">Aspirations:</span>
                <span className="profile-summary-value">{userProfile.careerAspirations || 'N/A'}</span>
            </div>
            <div className="profile-summary-row">
                <span className="profile-summary-label">Preferred Environments:</span>
                <span className="profile-summary-value">{userProfile.preferredWorkEnvironments.join(', ') || 'N/A'}</span>
            </div>
            <div className="profile-summary-row" style={{ marginTop: '1.5rem' }}>
                <span className="profile-summary-label">User ID:</span>
                <span className="profile-summary-value" style={{ fontFamily: 'monospace', fontSize: '0.95em' }}>{userId}</span>
            </div>
        </div>
    );
};

export default ProfileSummary; 