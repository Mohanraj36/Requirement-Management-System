import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, UserPlus, UserMinus, CheckCircle, Search } from 'lucide-react';

const StudentManagementView = ({ requirementId, requirementName, onClose }) => {
    const [addedStudents, setAddedStudents] = useState([]);
    const [eligibleStudents, setEligibleStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [addedRes, eligibleRes] = await Promise.all([
                api.get(`/requirement/${requirementId}/students/added`),
                api.get(`/requirement/${requirementId}/students/eligible`)
            ]);
            setAddedStudents(addedRes.data);
            setEligibleStudents(eligibleRes.data);
        } catch (err) {
            console.error('Failed to fetch student data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [requirementId]);

    const handleAddStudent = async (studentId) => {
        try {
            await api.post(`/requirement/${requirementId}/add-student/${studentId}`);
            fetchData();
        } catch (err) {
            alert('Failed to add student');
        }
    };

    const filteredEligible = eligibleStudents.filter(s =>
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.stream?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="card" style={{ width: '90%', maxWidth: '900px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ margin: 0 }}>Manage Students</h2>
                        <p className="text-secondary">{requirementName}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                </div>

                {loading ? (
                    <div className="text-center" style={{ padding: '2rem' }}>Loading data...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1, overflow: 'hidden' }}>
                        {/* Added Students */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={18} color="var(--color-success)" /> Applied / Added Students ({addedStudents.length})
                            </h3>
                            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
                                {addedStudents.length === 0 ? (
                                    <p className="text-secondary text-center mt-4">No students added yet.</p>
                                ) : (
                                    addedStudents.map(student => (
                                        <div key={student.studentId} className="flex justify-between align-center p-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{student.fullName}</div>
                                                <div className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{student.stream} • {student.yearOfPassing}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Eligible Students */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="flex justify-between align-center" style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Eligible Students</h3>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ padding: '4px 8px 4px 28px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                                    />
                                    <Search size={14} className="text-secondary" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                                </div>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
                                {filteredEligible.length === 0 ? (
                                    <p className="text-secondary text-center mt-4">No eligible students found.</p>
                                ) : (
                                    filteredEligible.map(student => (
                                        <div key={student.studentId} className="flex justify-between align-center p-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{student.fullName}</div>
                                                <div className="text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{student.stream} • {student.yearOfPassing}</div>
                                            </div>
                                            <button
                                                onClick={() => handleAddStudent(student.studentId)}
                                                style={{ background: 'var(--color-primary-green)', border: 'none', color: 'var(--color-forest-green)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                <UserPlus size={14} /> Add
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagementView;
