import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Users, Briefcase, GraduationCap } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, show: true },
        { name: 'Requirements', path: '/requirements', icon: FileText, show: true },
        { name: 'Admin Panel', path: '/admin', icon: Users, show: hasRole('ADMIN') },
        { name: 'Student Data', path: '/student-profile', icon: GraduationCap, show: hasRole('STUDENT') },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--color-forest-green)',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh'
            }}>
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ color: 'var(--color-primary-green)', margin: 0, fontSize: '1.5rem' }}>RMS</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Requirement Management</p>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0' }}>
                    {navItems.filter(item => item.show).map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem 1.5rem',
                                color: location.pathname === item.path ? 'var(--color-primary-green)' : '#FFFFFF',
                                backgroundColor: location.pathname === item.path ? 'rgba(0, 237, 100, 0.05)' : 'transparent',
                                borderLeft: location.pathname === item.path ? '4px solid var(--color-primary-green)' : '4px solid transparent',
                                gap: '0.75rem',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            backgroundColor: 'var(--color-primary-dark-green)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'
                        }}>
                            {user?.userName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{user?.userName}</p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                                {user?.roles?.[0]?.roleName || 'No Role'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 1rem' }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
