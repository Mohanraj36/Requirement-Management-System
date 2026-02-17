import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, MapPin, Briefcase, Calendar, Users, Eye, X } from 'lucide-react';
import RequirementForm from './RequirementForm';
import StudentManagementView from './StudentManagementView';

const RequirementList = () => {
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);
    const [showStudentMgmt, setShowStudentMgmt] = useState(false);
    const [mgmtReq, setMgmtReq] = useState(null);
    const [viewReq, setViewReq] = useState(null);
    const { hasRole } = useAuth();

    const fetchRequirements = async () => {
        try {
            const endpoint = hasRole('STUDENT') ? '/requirement/eligible' : '/requirement';
            const response = await api.get(endpoint);
            setRequirements(Array.isArray(response.data) ? response.data : (response.data.content ?? []));
        } catch (err) {
            console.error('Failed to fetch requirements', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequirements();
    }, []);

    const handleEdit = (req) => {
        setSelectedReq(req);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this requirement?')) {
            try {
                await api.delete(`/requirement/${id}`);
                fetchRequirements();
            } catch (err) {
                alert('Failed to delete requirement');
            }
        }
    };

    const handleApply = async (reqId) => {
        try {
            await api.post(`/requirement/${reqId}/apply`);
            alert('Applied successfully!');
            fetchRequirements();
            if (viewReq && viewReq.requirementId === reqId) {
                setViewReq(prev => ({ ...prev, applied: true }));
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        }
    };

    if (loading) return <div className="text-center mt-4">Loading requirements...</div>;

    return (
        <div>
            <div className="flex justify-between align-center" style={{ marginBottom: '1rem' }}>
                <div>
                    <h1>Requirements</h1>
                    <p className="text-secondary">Explore and manage company placement needs</p>
                </div>
                {(hasRole('HR') || hasRole('STAFF') || hasRole('ADMIN')) && (
                    <button className="btn btn-primary" onClick={() => { setSelectedReq(null); setShowForm(true); }}>
                        <Plus size={18} /> Post New Requirement
                    </button>
                )}
            </div>

            {showForm ? (
                <RequirementForm
                    requirement={selectedReq}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => { setShowForm(false); fetchRequirements(); }}
                />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {requirements.map(req => (
                        <div key={req.requirementId} className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{req.companyName}</h3>
                                <div className="flex align-center gap-2">
                                    <span style={{
                                        backgroundColor: 'var(--color-primary-green)',
                                        color: 'var(--color-forest-green)',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600
                                    }}>
                                        {req.passedOutYear} Batch
                                    </span>
                                    {req.location && (
                                        <span style={{
                                            backgroundColor: 'var(--color-border)',
                                            color: 'var(--color-text-secondary)',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <MapPin size={10} /> {req.location}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', flex: 1 }}>
                                <div className="flex align-center gap-2 text-secondary">
                                    <Briefcase size={16} /> <span>{req.jobRole}</span>
                                </div>
                                <div className="flex gap-1 mt-2" style={{ flexWrap: 'wrap' }}>
                                    {req.eligibleDegrees?.map(d => (
                                        <span key={d} style={{ fontSize: '0.75rem', background: 'var(--color-border)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{d}</span>
                                    ))}
                                    {req.eligibleStreams?.map(s => (
                                        <span key={s} style={{ fontSize: '0.75rem', background: 'var(--color-primary-green)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--color-text-main)',
                                    marginBottom: '1rem',
                                    height: '4.5rem',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {req.description}
                                </div>
                                <div className="flex justify-between align-center">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewReq(req)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-primary-dark-green)',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                        {(hasRole('HR') || hasRole('STAFF') || hasRole('ADMIN')) && (
                                            <>
                                                <button onClick={() => { setMgmtReq(req); setShowStudentMgmt(true); }} style={{ background: 'var(--color-primary-green)', border: 'none', color: 'var(--color-forest-green)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Users size={14} /> Manage Students
                                                </button>
                                                <button onClick={() => handleEdit(req)} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark-green)', fontWeight: 600 }}>Edit</button>
                                                <button onClick={() => handleDelete(req.requirementId)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', fontWeight: 600 }}>Delete</button>
                                            </>
                                        )}
                                        {hasRole('STUDENT') && (
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => !req.applied && handleApply(req.requirementId)}
                                                style={{
                                                    backgroundColor: req.applied ? '#3b82f6' : 'btn-primary',
                                                    color: req.applied ? 'white' : 'inherit',
                                                    cursor: req.applied ? 'not-allowed' : 'pointer',
                                                    opacity: req.applied ? 0.8 : 1
                                                }}
                                                disabled={req.applied}
                                            >
                                                {req.applied ? 'Applied' : 'Apply Now'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {requirements.length === 0 && (
                        <div className="text-center" style={{ gridColumn: '1/-1', padding: '4rem' }}>
                            <p className="text-secondary">No requirements found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}

            {viewReq && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 30, 43, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }} onClick={() => setViewReq(null)}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: '700px',
                        height: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        padding: '2rem'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setViewReq(null)}
                            style={{
                                position: 'absolute',
                                right: '1.5rem',
                                top: '1.5rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{viewReq.companyName}</h2>
                            <span style={{
                                backgroundColor: 'var(--color-primary-green)',
                                color: 'var(--color-forest-green)',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                                {viewReq.passedOutYear} Batch
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', flexShrink: 0 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Job Role</label>
                                <div className="flex align-center gap-2">
                                    <Briefcase size={18} color="var(--color-primary-dark-green)" /> <span style={{ fontWeight: 500 }}>{viewReq.jobRole}</span>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Location</label>
                                <div className="flex align-center gap-2">
                                    <MapPin size={18} color="var(--color-primary-dark-green)" /> <span style={{ fontWeight: 500 }}>{viewReq.location || 'Not Specified'}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Eligible Degrees & Streams</label>
                            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                {viewReq.eligibleDegrees?.map(d => (
                                    <span key={d} style={{ fontSize: '0.8rem', background: 'var(--color-border)', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 500 }}>{d}</span>
                                ))}
                                {viewReq.eligibleStreams?.map(s => (
                                    <span key={s} style={{ fontSize: '0.8rem', background: 'var(--color-primary-green)', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 500 }}>{s}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', flexShrink: 0 }}>Job Description</label>
                            <div className="no-scrollbar" style={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontSize: '0.95rem',
                                color: 'var(--color-text-main)',
                                lineHeight: '1.6',
                                background: 'var(--color-background)',
                                padding: '1.25rem',
                                borderRadius: 'var(--radius-md)',
                                overflowY: 'auto',
                                flex: 1,
                                border: '1px solid var(--color-border)'
                            }}>
                                {viewReq.description}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
                            <button className="btn btn-secondary" onClick={() => setViewReq(null)}>Close</button>
                            {hasRole('STUDENT') && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => !viewReq.applied && handleApply(viewReq.requirementId)}
                                    disabled={viewReq.applied}
                                >
                                    {viewReq.applied ? 'Already Applied' : 'Apply Now'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showStudentMgmt && mgmtReq && (
                <StudentManagementView
                    requirementId={mgmtReq.requirementId}
                    requirementName={`${mgmtReq.companyName} - ${mgmtReq.jobRole}`}
                    onClose={() => { setShowStudentMgmt(false); setMgmtReq(null); }}
                />
            )}
        </div>
    );
};

export default RequirementList;
