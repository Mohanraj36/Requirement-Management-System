import React, { useState } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';

const RequirementForm = ({ requirement, onClose, onSuccess }) => {
    const isEdit = !!requirement;
    const [formData, setFormData] = useState(requirement || {
        companyName: '',
        jobRole: '',
        description: '',
        passedOutYear: new Date().getFullYear(),
        location: '',
        eligibleDegrees: [],
        eligibleStreams: []
    });

    const [degreeInput, setDegreeInput] = useState('');
    const [streamInput, setStreamInput] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addDegree = () => {
        if (degreeInput && !formData.eligibleDegrees.includes(degreeInput)) {
            setFormData({ ...formData, eligibleDegrees: [...formData.eligibleDegrees, degreeInput] });
            setDegreeInput('');
            setValidationError('');
        }
    };

    const addStream = () => {
        if (streamInput && !formData.eligibleStreams.includes(streamInput)) {
            setFormData({ ...formData, eligibleStreams: [...formData.eligibleStreams, streamInput] });
            setStreamInput('');
            setValidationError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check if at least one degree or stream is selected
        if (formData.eligibleDegrees.length === 0 && formData.eligibleStreams.length === 0) {
            setValidationError('Please add at least one degree or stream before submitting.');
            return;
        }

        try {
            if (isEdit) {
                await api.put(`/requirement/${requirement.requirementId}`, formData);
            } else {
                await api.post('/requirement', formData);
            }
            onSuccess();
        } catch (err) {
            alert('Error saving requirement: ' + (err.response?.data?.message || err.message));
        }
    };

    const removeTag = (type, value) => {
        setFormData({
            ...formData,
            [type]: formData[type].filter(item => item !== value)
        });
    };

    return (
        <div className="card">
            <div className="flex justify-between align-center" style={{ marginBottom: '.5rem' }}>
                <h2>{isEdit ? 'Edit Requirement' : 'Create New Requirement'}</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)' }}>
                    <X size={24} />
                </button>
            </div>

            {validationError && (
                <div style={{ gridColumn: 'span 2', padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '4px', color: '#dc2626', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    ⚠️ {validationError}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                    <label>Company Name <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span></label>
                    <input style={{ textTransform: 'capitalize' }} name="companyName" value={formData.companyName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Job Role <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span></label>
                    <input style={{ textTransform: 'capitalize' }} name="jobRole" value={formData.jobRole} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Passed Out Year<span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span> </label>
                    <input name="passedOutYear" type="number" value={formData.passedOutYear} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Location <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span></label>
                    <input style={{ textTransform: 'capitalize' }} name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Bangalore, Remote" />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Description<span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span></label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={{ minWidth: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', minHeight: '100px', resize: 'none' }}
                    />
                </div>

                {/* Dynamic Tags for eligibility */}
                <div className="input-group">
                    <label>Eligible Degrees {formData.eligibleDegrees.length === 0 && formData.eligibleStreams.length === 0 && <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span>}</label>
                    <div className="flex gap-2">
                        <input style={{ textTransform: 'uppercase' }} value={degreeInput} onChange={(e) => setDegreeInput(e.target.value)} placeholder="BE, BTech..." />
                        <button type="button" className="btn btn-secondary" onClick={addDegree}>Add</button>
                    </div>
                    <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                        {formData.eligibleDegrees.map(d => (
                            <span key={d} style={{ background: 'var(--color-border)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' }}>
                                {d} <X size={12} onClick={() => removeTag('eligibleDegrees', d)} style={{ cursor: 'pointer' }} />
                            </span>
                        ))}
                    </div>
                </div>

                <div className="input-group">
                    <label>Eligible Streams {formData.eligibleDegrees.length === 0 && formData.eligibleStreams.length === 0 && <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>*</span>}</label>
                    <div className="flex gap-2">
                        <input style={{ textTransform: 'uppercase' }} value={streamInput} onChange={(e) => setStreamInput(e.target.value)} placeholder="CS, IS, IT..." />
                        <button type="button" className="btn btn-secondary" onClick={addStream}>Add</button>
                    </div>
                    <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                        {formData.eligibleStreams.map(s => (
                            <span key={s} style={{ background: 'var(--color-border)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' }}>
                                {s} <X size={12} onClick={() => removeTag('eligibleStreams', s)} style={{ cursor: 'pointer' }} />
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                        {isEdit ? 'Update Requirement' : 'Create Requirement'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RequirementForm;
