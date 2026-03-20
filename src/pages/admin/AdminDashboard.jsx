import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiEdit, FiTrash2, FiPlus, FiLogOut, FiUsers, FiSettings, FiAward, FiX, FiSave, FiSend, FiMail, FiPhone, FiLock, FiCheck, FiInfo, FiSun, FiMoon, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaLaptopCode } from 'react-icons/fa';
import api from '../../utils/api';
import './Admin.css';
import ImageCropper from '../../components/ImageCropper';

const tabs = [
  { id: 'workshops', label: 'Workshops', icon: <FiCalendar /> },
  { id: 'registrations', label: 'Registrations', icon: <FiUsers /> },
  { id: 'internships', label: 'Internships', icon: <FaLaptopCode /> },
  { id: 'messages', label: 'Messages', icon: <FiSend /> },
  { id: 'highlights', label: 'Highlights', icon: <FiAward /> },
  { id: 'clients', label: 'Clients', icon: <FiUsers /> },
  { id: 'security', label: 'Security', icon: <FiLock /> },
];

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('workshops');
  const [data, setData] = useState({ workshops: [], registrations: [], internships: [], highlights: [], clients: [], messages: [], about: {}, loading: true });
  const [modal, setModal] = useState({ show: false, type: '', item: null });
  const [theme, setTheme] = useState(localStorage.getItem('admin-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const [eventsRes, registrationsRes, companyRes, messagesRes, internshipsRes] = await Promise.all([
        api.get('/events'),
        api.get('/register').catch(() => ({ data: [] })),
        api.get('/company'),
        api.get('/messages').catch(() => ({ data: [] })),
        api.get('/internships').catch(() => ({ data: [] }))
      ]);
      setData({
        workshops: eventsRes.data,
        registrations: registrationsRes.data,
        internships: internshipsRes.data,
        highlights: companyRes.data.highlights || [],
        clients: companyRes.data.clients || [],
        messages: messagesRes.data,
        about: companyRes.data,
        loading: false
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleOpenModal = (type, item = null) => setModal({ show: true, type, item });
  const handleCloseModal = () => setModal({ show: false, type: '', item: null });

  const handleDeleteWorkshop = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;
    try {
      await api.delete(`/events/${id}`);
      fetchAllData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (data.loading) return <AdminLoader />;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="logo-icon" style={{ width: 44, height: 44, overflow: 'hidden' }}>
            <img src="https://ik.imagekit.io/Lourdu/Sprouts/logo.jpeg?updatedAt=1773849138906" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="admin-logo-text">
            <div className="brand-name">Sprouts</div>
            <div className="brand-tagline">Edutech and IT services</div>
          </div>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? <><FiMoon /> Dark Mode</> : <><FiSun /> Light Mode</>}
        </button>
        <button className="admin-nav-btn logout-btn" onClick={onLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>{tabs.find(t => t.id === activeTab)?.label} Management</h1>
          {activeTab !== 'company' && activeTab !== 'messages' && activeTab !== 'registrations' && activeTab !== 'internships' && activeTab !== 'security' && (
            <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(activeTab)}>
              <FiPlus /> Add New
            </button>
          )}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="admin-panel-content"
        >
          {activeTab === 'workshops' && (
            <WorkshopsPanel 
              items={data.workshops} 
              onEdit={(item) => handleOpenModal('workshops', item)} 
              onDelete={handleDeleteWorkshop} 
            />
          )}
          {activeTab === 'registrations' && (
            <RegistrationsPanel 
              items={data.registrations} 
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === 'internships' && (
            <InternshipsPanel 
              items={data.internships} 
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === 'messages' && (
            <MessagesPanel 
              items={data.messages} 
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === 'highlights' && (
            <HighlightsPanel 
              items={data.highlights} 
              onEdit={(item) => handleOpenModal('highlights', item)}
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === 'clients' && (
            <ClientsPanel 
              items={data.clients} 
              onEdit={(item) => handleOpenModal('clients', item)}
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === 'security' && (
            <SecurityPanel />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {modal.show && (
          <AdminModal 
            type={modal.type} 
            item={modal.item} 
            onClose={handleCloseModal} 
            onSuccess={() => { handleCloseModal(); fetchAllData(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkshopsPanel({ items, onEdit, onDelete }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e._id}>
              <td><strong>{e.title}</strong></td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td><span className={`badge ${e.computedStatus === 'Upcoming' ? 'badge-green' : 'badge-orange'}`}>{e.computedStatus}</span></td>
              <td className="action-cell">
                <button className="icon-btn" onClick={() => onEdit(e)}><FiEdit /></button>
                <button className="icon-btn danger" onClick={() => onDelete(e._id)}><FiTrash2 /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecurityPanel() {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const toggleShow = (key) => setShowPass(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMessage({ text: 'New passwords do not match', type: 'error' });
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await api.put('/admin/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Update failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 500, padding: 32 }}>
      <h3>Change Password</h3>
      <p style={{ marginBottom: 24, fontSize: '0.875rem', color: 'var(--subtext)' }}>
        Manage your administrative login credentials.
      </p>
      {message.text && (
        <div className={`admin-message ${message.type}`} style={{ padding: 12, borderRadius: 8, marginBottom: 16, fontSize: '0.875rem', 
          background: message.type === 'error' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(5, 150, 105, 0.1)', 
          color: message.type === 'error' ? '#EF4444' : '#10B981' }}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Current Password</label>
          <div className="password-input-wrap">
            <input type={showPass.current ? "text" : "password"} value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} required />
            <button type="button" className="eye-btn" onClick={() => toggleShow('current')}>
              {showPass.current ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <div className="input-group">
          <label>New Password</label>
          <div className="password-input-wrap">
            <input type={showPass.new ? "text" : "password"} value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} required />
            <button type="button" className="eye-btn" onClick={() => toggleShow('new')}>
              {showPass.new ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <div className="input-group">
          <label>Confirm New Password</label>
          <div className="password-input-wrap">
            <input type={showPass.confirm ? "text" : "password"} value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} required />
            <button type="button" className="eye-btn" onClick={() => toggleShow('confirm')}>
              {showPass.confirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

function MessagesPanel({ items, onRefresh }) {
  const [expanded, setExpanded] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      onRefresh();
    } catch (err) { alert('Delete failed'); }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      onRefresh();
    } catch (err) {}
  };

  return (
    <div className="admin-list">
      {items.length === 0 ? (
        <div className="empty-state card glass">No messages found.</div>
      ) : (
        items.map((m) => (
          <div key={m._id} className={`message-card card glass ${!m.read ? 'unread' : ''}`} style={{ padding: 24, transition: 'all 0.3s' }}>
            <div className="message-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => { setExpanded(expanded === m._id ? null : m._id); if (!m.read) markRead(m._id); }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h4 style={{ margin: 0 }}>{m.name}</h4>
                  {!m.read && <span className="badge badge-blue">New</span>}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--subtext)' }}>
                  <span><FiMail /> {m.email}</span>
                  <span><FiPhone /> {m.phone}</span>
                  <span><FiCalendar /> {new Date(m.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="action-cell">
                <button className="icon-btn danger" onClick={(e) => { e.stopPropagation(); handleDelete(m._id); }}><FiTrash2 /></button>
              </div>
            </div>
            
            <AnimatePresence>
              {expanded === m._id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ paddingTop: 20, marginTop: 16, borderTop: '1px solid var(--border-gray)' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 8 }}>Subject: {m.subject}</p>
                    <p style={{ fontSize: '0.925rem', lineHeight: 1.6 }}>{m.message}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}
    </div>
  );
}

function HighlightsPanel({ items, onEdit, onRefresh }) {
  const handleDelete = async (id) => {
    if (!id) return alert('Cannot delete: missing ID');
    if (!window.confirm('Remove this highlight?')) return;
    try {
      await api.delete(`/company/highlights/${id}`);
      onRefresh();
    } catch (err) { alert('Failed to remove: ' + (err.response?.data?.error || err.message)); }
  };

  return (
    <div className="admin-list">
      {items.map((h, i) => (
        <div key={i} className="admin-list-item card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="highlight-tag-small">{h.tag || 'Award'}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{h.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--subtext)' }}>{h.location} {h.date}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                {(Array.isArray(h.images) ? h.images : (typeof h.images === 'string' ? h.images.split(',').filter(Boolean) : [])).slice(0, 3).map((img, idx) => (
                  <div key={idx} style={{ width: 24, height: 24, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-gray)' }}>
                    <img src={img.startsWith('http') ? img : `https://sprouts-backend-1.onrender.com${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                {h.images?.length > 3 && <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>+{h.images.length - 3}</span>}
              </div>
            </div>
          </div>
          <div className="action-cell">
            <button className="icon-btn" onClick={() => onEdit(h)}><FiEdit /></button>
            <button className="icon-btn danger" onClick={() => handleDelete(h._id)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="empty-state">No highlights found.</div>}
    </div>
  );
}

function ClientsPanel({ items, onEdit, onRefresh }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Remove this client?')) return;
    try {
      await api.delete(`/company/clients/${id}`);
      onRefresh();
    } catch (err) { alert('Failed to remove'); }
  };

  return (
    <div className="admin-list">
      {items.map((c) => (
        <div key={c._id} className="admin-list-item card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {c.logo && (
              <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#FFFFFF', border: '1px solid var(--border-gray)', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={c.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
            <div>
              <strong>{c.name}</strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--subtext)' }}>{c.location}</p>
            </div>
          </div>
          <div className="action-cell">
            <button className="icon-btn" onClick={() => onEdit(c)}><FiEdit /></button>
            <button className="icon-btn danger" onClick={() => handleDelete(c._id)}><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompanyPanel({ item, onRefresh }) {
  const [form, setForm] = useState({ ...item });
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'highlights' || key === 'clients') return;
        if (Array.isArray(form[key])) {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key] || '');
        }
      });
      if (logoFile) formData.append('logo', logoFile);

      await api.put('/company', formData);
      onRefresh();
      alert('Updated successfully');
    } catch (err) {
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-company-form" onSubmit={handleSubmit}>
      <div className="card" style={{ padding: 32 }}>
        <div className="input-group">
          <label>Company Logo</label>
          <ImageInput 
            value={form.logo} 
            onChange={(val) => setForm({ ...form, logo: val })} 
            onFileChange={setLogoFile} 
          />
        </div>
        <div className="input-group">
          <label>About Us</label>
          <textarea rows={6} value={form.about} onChange={e => setForm({...form, about: e.target.value})} />
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Vision</label>
            <textarea rows={3} value={form.vision} onChange={e => setForm({...form, vision: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Mission</label>
            <textarea rows={3} value={form.mission} onChange={e => setForm({...form, mission: e.target.value})} />
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Contact Email</label>
            <input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Phone Numbers (comma separated)</label>
            <input type="text" value={form.contactPhones?.join(', ')} onChange={e => setForm({...form, contactPhones: e.target.value.split(',').map(s=>s.trim())})} />
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Instagram URL</label>
            <input type="url" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} />
          </div>
          <div className="input-group">
            <label>LinkedIn URL</label>
            <input type="url" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

function ImageInput({ label, value, onChange, onFileChange }) {
  const [source, setSource] = useState(value?.startsWith('http') || !value ? 'url' : 'upload');
  const [preview, setPreview] = useState(value);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob) => {
    if (!croppedBlob) return;
    // Create a file from the blob
    const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: 'image/jpeg' });
    onFileChange(croppedFile);
    onChange(''); // Clear URL if file is selected
    
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(croppedFile);
    
    setShowCropper(false);
    setTempImage(null);
  };

  return (
    <div className="image-input-container">
      {showCropper && (
        <ImageCropper 
          image={tempImage} 
          onCropComplete={handleCropComplete} 
          onCancel={() => { setShowCropper(false); setTempImage(null); }}
          aspectRatio={label?.toLowerCase().includes('logo') ? 1 : 16/9}
        />
      )}
      <div className="image-source-toggle">
        <button type="button" className={`toggle-btn ${source === 'upload' ? 'active' : ''}`} onClick={() => setSource('upload')}>Upload</button>
        <button type="button" className={`toggle-btn ${source === 'url' ? 'active' : ''}`} onClick={() => setSource('url')}>Image URL</button>
      </div>
      
      {source === 'upload' ? (
        <input type="file" onChange={handleFileChange} accept="image/*" />
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <input 
            type="url" 
            style={{ flex: 1 }}
            value={value?.startsWith('/uploads/') ? '' : value} 
            onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); onFileChange(null); }} 
            placeholder="https://example.com/image.jpg"
          />
          {preview && preview.startsWith('http') && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setTempImage(preview); setShowCropper(true); }}>
              Crop URL
            </button>
          )}
        </div>
      )}

      {preview && (
        <div className="image-preview" style={{ height: 'auto', maxHeight: '300px' }}>
          <img src={preview.startsWith('data:') || preview.startsWith('http') ? preview : `https://sprouts-backend-1.onrender.com${preview}`} alt="Preview" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
}

function MultiImageInput({ existingImages, onRemoveExisting, onFilesChange }) {
  const [filePreviews, setFilePreviews] = useState([]);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return `https://sprouts-backend-1.onrender.com${url}`;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // For multi-image, we crop them one by one or just use them as is?
      // User said "every image", so cropping is better.
      // But multi-crop is complex. Let's start with first one or just allow cropping sequentially.
      setPendingFiles(files);
      processNextFile(files, 0);
    }
  };

  const [pendingFiles, setPendingFiles] = useState([]);
  const [showCropper, setShowCropper] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [tempImage, setTempImage] = useState(null);
  const [croppedFiles, setCroppedFiles] = useState([]);

  const processNextFile = (files, index) => {
    if (index >= files.length) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result);
      setCurrentFileIndex(index);
      setShowCropper(true);
    };
    reader.readAsDataURL(files[index]);
  };

  const handleCropComplete = (croppedBlob) => {
    if (!croppedBlob) return;
    const croppedFile = new File([croppedBlob], `cropped-${currentFileIndex}.jpg`, { type: 'image/jpeg' });
    const newCroppedFiles = [...croppedFiles, croppedFile];
    setCroppedFiles(newCroppedFiles);
    
    // Update preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreviews(prev => [...prev, reader.result]);
    };
    reader.readAsDataURL(croppedFile);

    // Continue to next file
    if (currentFileIndex + 1 < pendingFiles.length) {
      processNextFile(pendingFiles, currentFileIndex + 1);
    } else {
      onFilesChange([...newCroppedFiles]);
      setShowCropper(false);
      setTempImage(null);
      setCurrentFileIndex(-1);
      setPendingFiles([]);
      setCroppedFiles([]);
    }
  };

  return (
    <div className="image-input-container">
      {showCropper && (
        <ImageCropper 
          image={tempImage} 
          onCropComplete={handleCropComplete} 
          onCancel={() => { setShowCropper(false); setTempImage(null); }}
          aspectRatio={1} // Highlights usually look good square
        />
      )}
      <div className="multi-image-previews" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        {/* Existing Images */}
        {existingImages && existingImages.map((url, i) => (
          <div key={`exist-${i}`} className="image-preview" style={{ width: 90, height: 90, position: 'relative' }}>
            <img src={getImageUrl(url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '2px solid var(--soft-blue)' }} />
            <button type="button" className="remove-img-btn" onClick={() => onRemoveExisting(i)} style={{ position: 'absolute', top: -5, right: -5, background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyCenter: 'center', cursor: 'pointer', fontSize: 10 }}><FiX /></button>
          </div>
        ))}
        {/* New File Previews */}
        {filePreviews.map((p, i) => (
          <div key={`new-${i}`} className="image-preview" style={{ width: 90, height: 90, position: 'relative', opacity: 0.8 }}>
            <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '2px dashed var(--soft-blue)' }} />
            <div style={{ position: 'absolute', bottom: 2, right: 2, fontSize: 8, background: 'var(--soft-blue)', color: 'white', padding: '2px 4px', borderRadius: 4 }}>NEW</div>
          </div>
        ))}
      </div>
      <label className="file-upload-label" style={{ display: 'block', padding: '12px', border: '2px dashed var(--border-gray)', borderRadius: 12, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
        <FiPlus style={{ fontSize: 24, marginBottom: 4 }} />
        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Add More Photos</div>
        <input type="file" multiple onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
      </label>
    </div>
  );
}

function AdminModal({ type, item, onClose, onSuccess }) {
  const getInitialForm = () => {
    if (!item) return {
      title: '', description: '', date: '', startDate: '', endDate: '', startTime: '', endTime: '',
      duration: '', price: '', topics: [], benefits: [], googleFormUrl: '',
      name: '', location: '', image: '', images: [], tag: 'Award', logo: '', certificateImage: ''
    };

    const base = { ...item };
    if (type === 'highlights') {
      base.images = Array.isArray(item.images) ? item.images : [];
    }
    
    // Legacy support: if startDate/endDate missing but date exists
    if (type === 'workshops' && !base.startDate && base.date) {
      const d = new Date(base.date);
      const formatted = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      base.startDate = formatted;
      base.endDate = formatted;
    } else if (type === 'workshops' && !base.startDate) {
      // Ultimate fallback for new or weird data
      const d = new Date();
      base.startDate = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      base.endDate = base.startDate;
    }

    // Legacy support: if startTime/endTime missing but duration looks like "HH:mm AM to HH:mm PM"
    if (type === 'workshops' && !base.startTime && base.duration && base.duration.includes(' to ')) {
      const parts = base.duration.split(' to ');
      if (parts.length === 2) {
        base.startTime = parts[0].trim();
        base.endTime = parts[1].trim();
      }
    }
    
    // Default times if still missing for workshops
    if (type === 'workshops') {
      if (!base.startTime) base.startTime = "09:00 AM";
      if (!base.endTime) base.endTime = "05:00 PM";
      if (!base.duration) base.duration = "1 Day";
    }

    // Check for draft ONLY if not editing
    if (!item) {
      const draft = localStorage.getItem(`sprouts-draft-${type}`);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          return { ...base, ...parsed };
        } catch (e) {}
      }
    } else {
      // Clear draft when editing to avoid confusion later
      localStorage.removeItem(`sprouts-draft-${type}`);
    }

    return base;
  };

  const [form, setForm] = useState(getInitialForm());
  const [files, setFiles] = useState({ image: null, certificateImage: null, logo: null, images: [] });
  const [saving, setSaving] = useState(false);
  const [showUrlCropper, setShowUrlCropper] = useState(false);
  const [tempUrlImage, setTempUrlImage] = useState(null);

  // Persistence logic
  useEffect(() => {
    if (!item) {
      localStorage.setItem(`sprouts-draft-${type}`, JSON.stringify(form));
    }
  }, [form, type, item]);

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      // Filter out internal and calculated fields
      const filteredForm = { ...form };
      delete filteredForm._id;
      delete filteredForm.__v;
      delete filteredForm.computedStatus;
      delete filteredForm.createdAt;
      delete filteredForm.updatedAt;

      Object.keys(filteredForm).forEach(key => {
        if (filteredForm[key] !== null && filteredForm[key] !== undefined) {
          if (Array.isArray(filteredForm[key])) {
            formData.append(key, JSON.stringify(filteredForm[key]));
          } else {
            formData.append(key, filteredForm[key]);
          }
        }
      });

      if (type === 'workshops') {
        // Auto-derive 'date' from 'startDate' if provided
        if (filteredForm.startDate) {
          const [d, m, y] = filteredForm.startDate.split('-').map(Number);
          if (d && m && y) {
            const dateObj = new Date(y, m - 1, d);
            formData.set('date', dateObj.toISOString());
          }
        } else if (!item) {
          // If new workshop and no date provided, use "now" for sorting
          formData.set('date', new Date().toISOString());
        }
        
        if (files.image) formData.append('image', files.image);
        if (files.certificateImage) formData.append('certificateImage', files.certificateImage);
        if (item) await api.put(`/events/${item._id}`, formData);
        else await api.post('/events', formData);
      } else if (type === 'highlights') {
        const { images, ...payload } = filteredForm;
        
        // Base images (already an array in form.images)
        let imagesArray = Array.isArray(images) ? [...images] : [];
        
        // Multiple file uploads
        if (files.images && files.images.length > 0) {
          const highlightFormData = new FormData();
          files.images.forEach(f => highlightFormData.append('images', f));
          const uploadRes = await api.post('/company/highlights/upload', highlightFormData);
          if (uploadRes.data.urls) {
            imagesArray = [...imagesArray, ...uploadRes.data.urls];
          }
        }
        
        payload.images = imagesArray;

        if (item && item._id) {
          await api.put(`/company/highlights/${item._id}`, payload);
        } else {
          await api.post('/company/highlights', payload);
        }
      }
 else if (type === 'clients') {
        if (files.logo) formData.append('logo', files.logo);
        if (item) await api.put(`/company/clients/${item._id}`, formData);
        else await api.post('/company/clients', formData);
      }
      localStorage.removeItem(`sprouts-draft-${type}`);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(`Action failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div className="modal-card card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
        <div className="modal-header">
          <h3>{item ? 'Edit' : 'Add'} {type === 'workshops' ? 'Workshop' : type.slice(0, -1)}</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {type === 'workshops' ? (
            <>
              <div className="input-group">
                <label>Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Start Date (DD-MM-YYYY)</label>
                  <input type="text" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} placeholder="e.g. 10-02-2024" />
                </div>
                <div className="input-group">
                  <label>End Date (DD-MM-YYYY)</label>
                  <input type="text" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} placeholder="e.g. 13-02-2024" />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Start Time</label>
                  <input type="text" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} placeholder="e.g. 09:00 AM" required />
                </div>
                <div className="input-group">
                  <label>End Time</label>
                  <input type="text" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} placeholder="e.g. 05:00 PM" required />
                </div>
              </div>
              <div className="input-group">
                <label>Duration Display (e.g. 3 Days)</label>
                <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 3 Days" required />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Price</label>
                  <input type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. ₹499 or Free" required />
                </div>
                <div className="input-group">
                  <label>Google Form URL</label>
                  <input type="url" value={form.googleFormUrl} onChange={e => setForm({...form, googleFormUrl: e.target.value})} />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Cover Image</label>
                  <ImageInput 
                    value={form.image} 
                    onChange={(val) => setForm({ ...form, image: val })} 
                    onFileChange={(file) => setFiles({ ...files, image: file })} 
                  />
                </div>
                <div className="input-group">
                  <label>Certificate Image</label>
                  <ImageInput 
                    value={form.certificateImage} 
                    onChange={(val) => setForm({ ...form, certificateImage: val })} 
                    onFileChange={(file) => setFiles({ ...files, certificateImage: file })} 
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Topics (comma separated)</label>
                <input type="text" value={form.topics?.join(', ')} onChange={e => setForm({...form, topics: e.target.value.split(',').map(s=>s.trim())})} />
              </div>
            </>
          ) : type === 'highlights' ? (
            <>
              <div className="input-group">
                <label>Highlight Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Category Tag</label>
                  <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} required>
                    <option value="Award">Award</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Trichy" />
                </div>
              </div>
              <div className="input-group">
                <label>Date</label>
                <input type="text" value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="e.g. March 2024" />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Achievement Gallery</label>
                <MultiImageInput 
                  existingImages={form.images}
                  onRemoveExisting={(idx) => {
                    const newImages = form.images.filter((_, i) => i !== idx);
                    setForm({ ...form, images: newImages });
                  }}
                  onFilesChange={(newFiles) => setFiles({ ...files, images: newFiles })} 
                />
              </div>
              <div className="input-group">
                <label>Add Image URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="url" 
                    id="new-img-url"
                    className="flex-1"
                    placeholder="https://example.com/photo.jpg" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const url = e.target.value.trim();
                        if (url) {
                          setForm({ ...form, images: [...form.images, url] });
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
                    const input = document.getElementById('new-img-url');
                    const url = input.value.trim();
                    if (url) {
                      setTempUrlImage(url);
                      setShowUrlCropper(true);
                      // Don't add yet, wait for crop
                    }
                  }}>Crop & Add</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
                    const input = document.getElementById('new-img-url');
                    const url = input.value.trim();
                    if (url) {
                      setForm({ ...form, images: [...form.images, url] });
                      input.value = '';
                    }
                  }}>Add Raw</button>
                </div>
                {showUrlCropper && (
                  <ImageCropper 
                    image={tempUrlImage}
                    onCropComplete={(blob) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm({ ...form, images: [...form.images, reader.result] });
                        setShowUrlCropper(false);
                        setTempUrlImage(null);
                        document.getElementById('new-img-url').value = '';
                      };
                      reader.readAsDataURL(blob);
                    }}
                    onCancel={() => { setShowUrlCropper(false); setTempUrlImage(null); }}
                    aspectRatio={1}
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="input-group">
                <label>Client Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Logo</label>
                <ImageInput 
                  value={form.logo} 
                  onChange={(val) => setForm({ ...form, logo: val })} 
                  onFileChange={(file) => setFiles({ ...files, logo: file })} 
                />
              </div>
              <div className="input-group">
                <label>Description / Case Study</label>
                <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe your collaboration or the client's profile..." />
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
            {saving ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function RegistrationsPanel({ items, onRefresh }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Remove this registration?')) return;
    try {
      await api.delete(`/register/${id}`);
      onRefresh();
    } catch (err) { alert('Failed to remove'); }
  };

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>User Details</th>
            <th>Event</th>
            <th>College / Course</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r._id}>
              <td>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--subtext)' }}>{r.email}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--subtext)' }}>{r.phone}</div>
              </td>
              <td>
                <div style={{ fontWeight: 500 }}>{r.eventId?.title || 'Unknown Event'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--subtext)' }}>
                  {r.eventId?.date ? new Date(r.eventId.date).toLocaleDateString() : ''}
                </div>
              </td>
              <td>
                <div>{r.college}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--subtext)' }}>{r.course}</div>
              </td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td className="action-cell">
                <button className="icon-btn danger" onClick={() => handleDelete(r._id)}><FiTrash2 /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <div className="empty-state card glass" style={{ marginTop: 20 }}>No registrations found.</div>}
    </div>
  );
}

function InternshipsPanel({ items, onRefresh }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Remove this application?')) return;
    try {
      await api.delete(`/internships/${id}`);
      onRefresh();
    } catch (err) { alert('Failed to remove'); }
  };

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Applicant Details</th>
            <th>Contact</th>
            <th>Details (College / Course / Track)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((app) => (
            <tr key={app._id}>
              <td>
                <div style={{ fontWeight: 600 }}>{app.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--subtext)' }}>{app.email}</div>
              </td>
              <td>{app.phone}</td>
              <td>
                <div>{app.college}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--subtext)' }}>
                  {app.course} — <span className="track-tag">{app.track}</span>
                </div>
              </td>
              <td>{new Date(app.createdAt).toLocaleString()}</td>
              <td className="action-cell">
                <button className="icon-btn danger" onClick={() => handleDelete(app._id)} title="Delete Application">
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <div className="empty-state card glass" style={{ marginTop: 20 }}>No internship applications found.</div>}
    </div>
  );
}

function AdminLoader() {
  return (
    <div className="admin-loader-container">
      <div className="loader-spinner"></div>
      <div className="loader-text">Sprouts Edutech</div>
      <div style={{ fontSize: '0.75rem', marginTop: 8, opacity: 0.7, color: 'var(--soft-blue)', letterSpacing: '0.1em' }}>and IT services</div>
    </div>
  );
}


