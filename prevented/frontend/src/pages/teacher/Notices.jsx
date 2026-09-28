import React, { useState } from 'react';
import { createNotice } from '../../services/teacher';

const Notices = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    content: '',
    target_audience: 'all',
    publish_date: new Date().toISOString().split('T')[0],
    expiry_date: ''
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = { ...formData };
      if (!payload.expiry_date) {
        payload.expiry_date = null;
      }

      await createNotice(payload);
      setSuccess('Notice successfully published.');
      setFormData({ ...formData, title: '', content: '', expiry_date: '' });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError('Validation Error: ' + detail.map(d => d.msg).join(', '));
      } else {
        setError('Failed to create notice.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Notice Board Management</h1>
      
      <div className="card" style={{ maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Publish New Notice
        </h3>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}
          {success && <div style={{ color: 'var(--success)', marginBottom: '16px', fontWeight: 'bold' }}>{success}</div>}

          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleFormChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-control" value={formData.category} onChange={handleFormChange} required>
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Event">Event</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select name="target_audience" className="form-control" value={formData.target_audience} onChange={handleFormChange} required>
                <option value="all">All Users</option>
                <option value="students">All Students</option>
                <option value="it">IT Department</option>
                <option value="cse">CSE Department</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Publish Date</label>
              <input type="date" name="publish_date" className="form-control" value={formData.publish_date} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date (Optional)</label>
              <input type="date" name="expiry_date" className="form-control" value={formData.expiry_date} onChange={handleFormChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea name="content" className="form-control" rows="6" value={formData.content} onChange={handleFormChange} required></textarea>
          </div>

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Notice'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notices;
