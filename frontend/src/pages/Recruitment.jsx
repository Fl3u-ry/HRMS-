import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './CRUDPages.css';

function Recruitment() {
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position_id: '',
    department_id: '',
    cover_letter: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptRes, postRes] = await Promise.all([
        api.get('/departments'),
        api.get('/positions')
      ]);
      setDepartments(deptRes.data);
      setPosts(postRes.data);
      setApplications([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', position: 'Nurse', department: 'Emergency', status: 'Pending' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', position: 'Doctor', department: 'Surgery', status: 'Interviewed' }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        position_id: formData.position_id || null,
        department_id: formData.department_id || null
      };
      
      const newApplication = {
        id: applications.length + 1,
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        phone: formData.phone,
        position: posts.find(p => p.position_id === parseInt(formData.position_id))?.position_name || '-',
        department: departments.find(d => d.department_id === parseInt(formData.department_id))?.department_name || '-',
        status: 'Pending'
      };
      
      setApplications([...applications, newApplication]);
      closeModal();
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    }
  };

  const openModal = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position_id: '',
      department_id: '',
      cover_letter: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredApplications = applications.filter(app =>
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>Recruitment</h1>
        <button className="btn-primary" onClick={openModal}>+ New Application</button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length === 0 ? (
              <tr><td colSpan="7">No applications found</td></tr>
            ) : (
              filteredApplications.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.position}</td>
                  <td>{app.department}</td>
                  <td>
                    <span className={`status-badge ${app.status?.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Application</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Position</label>
                  <select value={formData.position_id} onChange={(e) => setFormData({...formData, position_id: e.target.value})}>
                    <option value="">Select Position</option>
                    {posts.map(p => (
                      <option key={p.position_id} value={p.position_id}>{p.position_name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea 
                  value={formData.cover_letter} 
                  onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recruitment;
