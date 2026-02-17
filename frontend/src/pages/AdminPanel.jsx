import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, UserCog, TrendingUp, Users } from 'lucide-react';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState({});

   const fetchUsers = async () => {
    try {
        const response = await api.get('/user');
        setUsers(Array.isArray(response.data) ? response.data : (response.data.content ?? []));
    } catch (err) {
        console.error('Failed to fetch users', err);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = (userId, roleName) => {
        setSelectedRoles(prev => ({ ...prev, [userId]: roleName }));
    };

    const handlePromote = async (userId) => {
        const roleName = selectedRoles[userId];
        if (!roleName) return;

        if (window.confirm(`Are you sure you want to change this user's role to ${roleName}?`)) {
            try {
                const response = await api.post(`/admin/promote/${userId}/${roleName}`);
                // Update local state immediately with new user data
                setUsers(prevUsers => prevUsers.map(u =>
                    u.userId === userId ? response.data : u
                ));

                // Clear selected role for this user
                setSelectedRoles(prev => {
                    const next = { ...prev };
                    delete next[userId];
                    return next;
                });

                alert(`User successfully promoted to ${roleName}`);
            } catch (err) {
                console.error('Promotion failed:', err);
                alert(err.response?.data?.message || 'Failed to promote user');
            }
        }
    };

    if (loading) return <div className="text-center mt-4">Loading user data...</div>;

    const hrUsers = users.filter(u => u.roles.some(r => r.roleName === 'HR'));
    const staffUsers = users.filter(u => u.roles.some(r => r.roleName === 'STAFF'));

    return (
        <div>
            <h1>Admin Control Center</h1>
            <p className="text-secondary">System-wide governance and user directory</p>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Users', value: users.length, icon: Users, color: 'var(--color-primary-green)' },
                    { label: 'Admins', value: users.filter(u => u.roles.some(r => r.roleName === 'ADMIN')).length, icon: Shield, color: 'var(--color-primary-dark-green)' },
                    { label: 'HR Executives', value: hrUsers.length, icon: UserCog, color: 'var(--color-warning)' },
                    { label: 'Staff Members', value: staffUsers.length, icon: TrendingUp, color: 'var(--color-success)' },
                ].map((stat, i) => (
                    <div key={i} className="card flex align-center gap-4">
                        <div style={{
                            backgroundColor: `${stat.color}20`,
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            color: stat.color
                        }}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{stat.label}</p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                {[
                    { id: 'users', label: 'User Roles', icon: Users },
                    { id: 'hr', label: 'HR Portfolio', icon: UserCog },
                    { id: 'staff', label: 'Staff Portfolio', icon: Shield },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex align-center gap-2 pb-2 px-4 transition-all ${activeTab === tab.id ? 'active' : ''}`}
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: activeTab === tab.id ? 'var(--color-primary-green)' : 'var(--color-secondary)',
                            borderBottom: activeTab === tab.id ? '2px solid var(--color-primary-green)' : '2px solid transparent',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* User Roles Management Tab */}
            {activeTab === 'users' && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>User</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>Current Roles</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>Promotion Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userId || user.userName} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{user.userName}</div>
                                        <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{user.email} (ID: {user.userId})</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div className="flex gap-2">
                                            {user.roles.map(r => (
                                                <span key={r.roleName} style={{
                                                    fontSize: '0.7rem',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    background: 'var(--color-border)',
                                                    fontWeight: 600
                                                }}>{r.roleName}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div className="flex gap-2">
                                            <select
                                                onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                                                value={selectedRoles[user.userId] || ''}
                                                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
                                            >
                                                <option value="" disabled>Select role...</option>
                                                <option value="ADMIN">Admin</option>
                                                <option value="HR">HR</option>
                                                <option value="STAFF">Staff</option>
                                                <option value="STUDENT">Student</option>
                                            </select>
                                            <button
                                                onClick={() => handlePromote(user.userId)}
                                                className="btn btn-primary btn-sm"
                                                disabled={!selectedRoles[user.userId]}
                                                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                                            >
                                                Promote
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* HR Portfolio Tab */}
            {activeTab === 'hr' && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>HR Executive</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>Contact Info</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>Account Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hrUsers.length > 0 ? hrUsers.map(user => (
                                <tr key={user.userId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{user.fullName || user.userName}</div>
                                        <div className="text-secondary" style={{ fontSize: '0.8rem' }}>@{user.userName}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>✉ {user.email}</div>
                                        <div style={{ fontSize: '0.85rem' }}>📞 {user.phoneNumber || 'Not provided'}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>ACTIVE ACCESS</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-secondary)' }}>No HR executives found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Staff Portfolio Tab */}
            {activeTab === 'staff' && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>Staff Member</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>Contact Details</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffUsers.length > 0 ? staffUsers.map(user => (
                                <tr key={user.userId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{user.fullName || user.userName}</div>
                                        <div className="text-secondary" style={{ fontSize: '0.8rem' }}>@{user.userName}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>✉ {user.email}</div>
                                        <div style={{ fontSize: '0.85rem' }}>📞 {user.phoneNumber || 'Not provided'}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rank: {user.level || 'Standard'}</div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-secondary)' }}>No staff members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
