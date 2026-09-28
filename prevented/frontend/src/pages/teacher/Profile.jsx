import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getTeacherProfile } from '../../services/teacher';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getTeacherProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user || !user.profile) return null;
  const p = profile || user.profile;

  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Faculty Information
        </h3>
        {loading ? <p>Loading profile...</p> : (
          <>
            <p className="form-group"><span className="form-label">Employee ID</span> {p.employee_id}</p>
            <p className="form-group"><span className="form-label">Name</span> {p.name}</p>
            <p className="form-group"><span className="form-label">Department</span> {p.department?.name || p.department_id} {p.department?.code ? `(${p.department.code})` : ''}</p>
            <p className="form-group"><span className="form-label">Designation</span> {p.designation}</p>
            <p className="form-group"><span className="form-label">Email Address</span> {p.email}</p>
            <p className="form-group"><span className="form-label">Contact Number</span> {p.phone}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
