import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './CRUDPages.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    position_name: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/positions');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await api.put(`/positions/${editingPost.position_id}`, formData);
      } else {
        await api.post('/positions', formData);
      }
      
      fetchPosts();
      closeModal();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    }
  };

  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        position_name: post.position_name || ''
      });
    } else {
      setEditingPost(null);
      setFormData({
        position_name: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
  };

  const filteredPosts = posts.filter(pos =>
    pos.position_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="crud-page">
      <div className="page-header">
        <h1>Post Management</h1>
        <button className="btn-primary" onClick={() => openModal()}>+ Add Post</button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search posts..."
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
              <th>Post Title</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr><td colSpan="2">No posts found</td></tr>
            ) : (
              filteredPosts.map(pos => (
                <tr key={pos.position_id}>
                  <td>{pos.position_id}</td>
                  <td>{pos.position_name}</td>
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
              <h2>{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Post Title *</label>
                <input
                  type="text"
                  value={formData.position_name}
                  onChange={(e) => setFormData({...formData, position_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{editingPost ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
