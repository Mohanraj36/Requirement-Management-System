import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Info, ExternalLink, ShieldCheck, User, Zap } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user?.userName}!</h1>
                <p className="text-secondary" style={{ fontSize: '1.1rem' }}>
                    Requirement Management System | Role: <span style={{ color: 'var(--color-primary-dark-green)', fontWeight: 600 }}>{user?.roles?.[0]?.roleName}</span>
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Quick Actions / Welcome Card */}
                <div className="card" style={{ borderLeft: '6px solid var(--color-primary-green)' }}>
                    <div className="flex align-center gap-2" style={{ marginBottom: '1.5rem' }}>
                        <Zap size={24} color="var(--color-primary-green)" fill="var(--color-primary-green)" />
                        <h2 style={{ fontSize: '1.5rem' }}>Quick Actions</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex align-center justify-between p-4" style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div className="flex align-center gap-2">
                                <User size={18} /> <span>View My Profile</span>
                            </div>
                            <ExternalLink size={16} className="text-secondary" />
                        </div>
                        <div className="flex align-center justify-between p-4" style={{ backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div className="flex align-center gap-2">
                                <ShieldCheck size={18} /> <span>Security Settings</span>
                            </div>
                            <ExternalLink size={16} className="text-secondary" />
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="card">
                    <div className="flex align-center gap-2" style={{ marginBottom: '1.5rem' }}>
                        <Info size={24} color="var(--color-primary-dark-green)" />
                        <h2 style={{ fontSize: '1.5rem' }}>System Status</h2>
                    </div>
                    <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
                        The RMS backend is currently active and healthy. You are logged into the production instance.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="text-center" style={{ flex: 1, padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Active</p>
                            <p className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>API CONNECTION</p>
                        </div>
                        <div className="text-center" style={{ flex: 1, padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--color-success)' }}>Stable</p>
                            <p className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>SYSTEM HEALTH</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mt-4" style={{ backgroundColor: 'var(--color-forest-green)', color: '#FFFFFF' }}>
                <h3 style={{ color: 'var(--color-primary-green)', marginBottom: '1rem' }}>Recent Announcements</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    • New placements available for B.Tech CS/IS streams. Check the requirements tab.<br />
                    • Career counseling session scheduled for next Monday at 10:00 AM in Library Hall.<br />
                    • Ensure your profile is updated to be eligible for upcoming interviews.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
