import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { role, userId } = useParams(); // URL should be like /profile/teacher/2
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`/api/${role}/${userId}`);  // 🔥 Directly hits /api/teacher/2
        setUser(res.data);
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
        setError('Could not load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [role, userId]);

  const handleBack = () => navigate(-1);

  return (
    <div className="profile-container">
      <button className="back-button" onClick={handleBack}>← Back</button>
      <h2>{role?.charAt(0).toUpperCase() + role?.slice(1)} Profile</h2>

      {loading ? (
        <p className="info-text">Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="profile-card">
          <p><strong>Name:</strong> {user.NAME}</p>
          <p><strong>Email:</strong> {user.EMAIL}</p>
          <p><strong>Phone:</strong> {user.CONTACT}</p>
          <p><strong>Role:</strong> {role}</p>
          <p><strong>Joined On:</strong> {new Date(user.created_at).toLocaleDateString()}</p>

          {role === 'teacher' && (
            <>
              {user.department && <p><strong>Department:</strong> {user.department}</p>}
              {user.institute && <p><strong>Institute:</strong> {user.institute}</p>}
            </>
          )}

          {role === 'student' && (
            <>
              {user.course && <p><strong>Course:</strong> {user.course}</p>}
              {user.year && <p><strong>Year:</strong> {user.year}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
