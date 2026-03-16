import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './CRUDPages.css';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    hire_date: '',
    salary: '',
    status: 'Active',
    department_id: '',
    position_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffRes, deptRes, postRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments'),
        api.get('/positions')
      ]);
      setStaff(staffRes.data);
      setDepartments(deptRes.data);
      setPosts(postRes.data);
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
        salary: formData.salary ? parseFloat(formData.salary) : null,
        department_id: formData.department_id || null,
        position_id: formData.position_id || null
      };

      if (editingStaff) {
        await api.put(`/employees/${editingStaff.employee_id}`, data);
      } else {
        await api.post('/employees', data);
      }
      
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert(error.response?.data?.message || 'Error saving staff');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const openModal = (staffMember = null) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        first_name: staffMember.first_name || '',
        last_name: staffMember.last_name || '',
        date_of_birth: staffMember.date_of_birth || '',
        gender: staffMember.gender || 'Male',
        phone: staffMember.phone || '',
        email: staffMember.email || '',
        address: staffMember.address || '',
        hire_date: staffMember.hire_date || '',
        salary: staffMember.salary || '',
        status: staffMember.status || 'Active',
        department_id: staffMember.department_id || '',
        position_id: staffMember.position_id || ''
      });
    } else {
      setEditingStaff(null);
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        hire_date: '',
        salary: '',
        status: 'Active',
        department_id: '',
        position_id: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStaff(null);
  };

  const filteredStaff = staff.filter(emp => {
    const matchesSearch = 
      emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;
    const matchesDept = filterDepartment === 'All' || emp.department_id === parseInt(filterDepartment);
    return matchesSearch && matchesStatus && matchesDept;
  });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>Staff Management</h1>
        <button className="btn-primary" onClick={() => openModal()}>+ Add Staff</button>
      </div>

      <div className="filter-bar">
        <div className="filter-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-options">
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="filter-select">
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Post</th>
              <th>Status</th>
              <th>Hire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr><td colSpan="9">No staff found</td></tr>
            ) : (
              filteredStaff.map(emp => (
                <tr key={emp.employee_id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.first_name} {emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.department_name || '-'}</td>
                  <td>{emp.position_name || '-'}</td>
                  <td>
                    <span className={`status-badge ${emp.status?.toLowerCase().replace(' ', '-')}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>{emp.hire_date}</td>
                  <td>
                    <button className="btn-edit" onClick={() => openModal(emp)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(emp.employee_id)}>Delete</button>
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
              <h2>{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h2>
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
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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
              <div className="form-group">
                <label>Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Hire Date *</label>
                  <input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Post</label>
                  <select value={formData.position_id} onChange={(e) => setFormData({...formData, position_id: e.target.value})}>
                    <option value="">Select Post</option>
                    {posts.map(p => (
                      <option key={p.position_id} value={p.position_id}>{p.position_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{editingStaff ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
