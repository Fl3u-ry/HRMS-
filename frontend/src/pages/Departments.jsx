import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './CRUDPages.css';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    department_name: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const deptRes = await api.get('/departments');
      setDepartments(deptRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await api.put(`/departments/${editingDepartment.department_id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Error saving department');
    }
  };

  const openModal = (department = null) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        department_name: department.department_name || ''
      });
    } else {
      setEditingDepartment(null);
      setFormData({
        department_name: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.department_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>Department Management</h1>
        <button className="btn-primary" onClick={() => openModal()}>+ Add Department</button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search departments..."
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
              <th>Department Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length === 0 ? (
              <tr><td colSpan="3">No departments found</td></tr>
            ) : (
              filteredDepartments.map(dept => (
                <tr key={dept.department_id}>
                  <td>{dept.department_id}</td>
                  <td>{dept.department_name}</td>
                  <td>{dept.created_at?.split('T')[0]}</td>
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
              <h2>{editingDepartment ? 'Edit Department' : 'Add New Department'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Department Name *</label>
                <input
                  type="text"
                  value={formData.department_name}
                  onChange={(e) => setFormData({...formData, department_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{editingDepartment ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;
