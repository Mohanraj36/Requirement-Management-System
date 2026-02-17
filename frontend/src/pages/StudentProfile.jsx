import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, GraduationCap, MapPin, Mail, Phone, Calendar, Briefcase } from 'lucide-react';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [appliedRequirements, setAppliedRequirements] = useState([]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/student/me');
            setProfile(response.data);
            setFormData(response.data);

            // Fetch applied requirements
            const appliedRes = await api.get('/requirement/applied');
            setAppliedRequirements(appliedRes.data);
        } catch (err) {
            const userRes = await api.get('/auth/me');
            setProfile(userRes.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/student/profile', formData);
            alert('Profile updated successfully!');
            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            alert('Update failed: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="text-center mt-4">Loading profile...</div>;

    return (
        <div>
            <div className="flex justify-between align-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>My Profile</h1>
                    <p className="text-secondary">Keep your academic details up to date</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem' }}>
                {/* Profile Card */}
                <div className="card text-center">
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        backgroundColor: 'var(--color-primary-green)',
                        margin: '0 auto 1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <User size={48} color="var(--color-forest-green)" />
                    </div>
                    <h2 style={{ marginBottom: '0.25rem' }}>{formData.fullName || profile?.fullName}</h2>
                    <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Student ID: {formData.studentId || 'Not Set'}</p>

                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                        <div className="flex align-center gap-4">
                            <Mail size={18} className="text-secondary" /> <span>{formData.email || profile?.email || 'Email Not Set'}</span>
                        </div>
                        <div className="flex align-center gap-4">
                            <GraduationCap size={18} className="text-secondary" /> <span>{formData.degree || 'Degree Not Set'} in {formData.stream || 'Stream Not Set'}</span>
                        </div>
                        <div className="flex align-center gap-4">
                            <Calendar size={18} className="text-secondary" /> <span>Batch of {formData.yearOfPassing || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Edit Form / Details */}
                <div className="card">
                    <h3>Academic Details</h3>
                    <p className="text-secondary" style={{ marginBottom: '2rem' }}>These details are used for placement eligibility</p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label>Full Name<span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span></label>
                                <input style={{ textTransform: 'capitalize' }} name="fullName" disabled={!isEditing} value={formData.fullName || ''} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Degree<span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span></label>
                                <input style={{ textTransform: 'uppercase' }} name="degree" disabled={!isEditing} value={formData.degree || ''} onChange={handleChange} placeholder="e.g. BE, BTech" required />
                            </div>
                            <div className="input-group">
                                <label>Stream / Branch<span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span></label>
                                <input style={{ textTransform: 'uppercase' }} name="stream" disabled={!isEditing} value={formData.stream || ''} onChange={handleChange} placeholder="e.g. CS, IS" required />
                            </div>
                            <div className="input-group">
                                <label>Graduation Year<span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span></label>
                                <input name="yearOfPassing" disabled={!isEditing} value={formData.yearOfPassing || ''} onChange={handleChange} type="number" required />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="card mt-6">
                <div className="flex align-center gap-2 mb-4">
                    <Briefcase size={20} color="var(--color-primary-dark-green)" />
                    <h3>My Applications</h3>
                </div>

                {appliedRequirements.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {appliedRequirements.map(req => (
                            <div key={req.requirementId} style={{
                                padding: '1.25rem',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                background: 'white'
                            }}>
                                <div className="flex justify-between align-start mb-2">
                                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{req.companyName}</h4>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        background: 'var(--color-primary-green)',
                                        color: 'var(--color-forest-green)',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontWeight: 600
                                    }}>{req.passedOutYear} Batch</span>
                                </div>
                                <p style={{ margin: '0.25rem 0', fontWeight: 500, color: 'var(--color-text-main)' }}>{req.jobRole}</p>
                                <div className="flex align-center gap-2 text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    <MapPin size={14} /> <span>{req.location || 'Not Specified'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-6" style={{ background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                        <p className="text-secondary">You haven't applied to any requirements yet.</p>
                        <button className="btn btn-secondary mt-2" onClick={() => window.location.href = '/requirements'}>Explore Requirements</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
