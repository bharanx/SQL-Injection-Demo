import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { updateStudentProfile, getStudentProfile } from '../../services/student';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: user?.profile?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    blood_group: user?.profile?.blood_group || ''
  });
  const [fullProfile, setFullProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setFullProfile(data);
        setFormData({
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          blood_group: data.blood_group || ''
        });
      } catch (err) {
        console.error("Failed to fetch full profile");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);


  if (!user || !user.profile) return null;
  const p = fullProfile || user.profile;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      await updateStudentProfile(formData);
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
      // In a real app we might want to update the global AuthContext, but local state is fine for now
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update profile. Ensure valid data is provided.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Personal Information (Read Only)
          </h3>
          <p className="form-group"><span className="form-label">Name</span> {p.name}</p>
          <p className="form-group"><span className="form-label">Date of Birth</span> {p.dob}</p>
          <p className="form-group"><span className="form-label">Gender</span> {p.gender}</p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Academic Information (Read Only)
          </h3>
          {loading ? <p>Loading...</p> : (
            <>
              <p className="form-group"><span className="form-label">Register Number</span> {p.register_number}</p>
              <p className="form-group"><span className="form-label">Department</span> {p.department?.name || p.department_id}</p>
              <p className="form-group"><span className="form-label">Year / Semester</span> {p.year} / {p.semester}</p>
              <p className="form-group"><span className="form-label">Admission Year</span> {p.admission_year}</p>
            </>
          )}
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Contact Information (Editable)
        </h3>
        {status.message && (
          <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', backgroundColor: status.type === 'success' ? '#d1e7dd' : '#f8d7da', color: status.type === 'success' ? '#0f5132' : '#842029' }}>
            {status.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Permanent Address</label>
            <textarea name="address" className="form-control" rows="3" value={formData.address} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Blood Group (Used for College Blood Drives)</label>
            <input type="text" name="blood_group" className="form-control" value={formData.blood_group} onChange={handleChange} placeholder="e.g. O+, A-, B+" />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Update Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
