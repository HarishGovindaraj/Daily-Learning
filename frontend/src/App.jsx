import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, ConfigProvider, theme, Select, Button, message, Space, Tooltip } from 'antd';
import { DashboardOutlined, SettingOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import DayDetail from './pages/DayDetail';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import { api } from './services/api';

const { Header, Content, Footer } = Layout;

const getRoadmapLabel = (val) => {
  const map = {
    'data-engineering': 'Data Engineering',
    'full-stack': 'Full Stack',
    'java': 'Java Developer',
    'flutter': 'Flutter Developer'
  };
  return map[val] || val;
};

function AppContent() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token;

  const [progress, setProgress] = useState(0);
  const [activeRoadmap, setActiveRoadmap] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchStats = async () => {
      try {
        const dashData = await api.getDashboard();
        if (dashData.noActiveRoadmap) {
          setActiveRoadmap(null);
          setProgress(0);
        } else {
          setActiveRoadmap(dashData.activeRoadmap);
          setProgress(dashData.stats.overallProgress);
        }
      } catch (err) {
        console.error('Failed to fetch header stats:', err);
      }
    };

    fetchStats();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('overallProgress');
    message.success('Logged out successfully.');
    window.location.href = '/';
  };

  const handleRoadmapChange = async (value) => {
    try {
      await api.selectRoadmap(value);
      user.activeRoadmap = value;
      localStorage.setItem('user', JSON.stringify(user));
      message.success(`Active path changed to: ${getRoadmapLabel(value)}`);
      window.location.reload(); // Refresh dashboard to load new roadmap state
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to switch active path.');
    }
  };

  if (!isLoggedIn) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ padding: '0 24px', height: 64, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: 8 }}>📚</span>
            <span
              className="gradient-text"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em'
              }}
            >
              Personal Roadmap Tracker
            </span>
          </div>
        </Header>
        <Content style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#0b0f19', color: '#64748b', borderTop: '1px solid #1e293b' }}>
          Roadmap Tracker — By Harish
        </Footer>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', marginRight: 30, textDecoration: 'none' }}>
              <span style={{ fontSize: '1.5rem', marginRight: 8 }}>📚</span>
              <span
                className="gradient-text"
                style={{
                  fontFamily: 'Outfit',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em'
                }}
              >
                Roadmap Tracker
              </span>
            </Link>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['dashboard']}
              style={{ minWidth: 200, background: 'transparent', borderBottom: 'none' }}
              items={[
                {
                  key: 'dashboard',
                  icon: <DashboardOutlined />,
                  label: <Link to="/">Dashboard</Link>,
                },
                {
                  key: 'settings',
                  icon: <SettingOutlined />,
                  label: <Link to="/settings">Settings</Link>,
                }
              ]}
            />
          </div>

          <Space size="middle" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
              <span style={{ marginRight: 8, fontSize: '0.85rem' }}>Active Syllabus:</span>
              {progress < 100 && !!activeRoadmap ? (
                <Tooltip title="Once selected, you cannot modify your syllabus path until it is 100% completed!">
                  <span style={{
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    background: '#1e293b',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    cursor: 'not-allowed',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    🔒 {getRoadmapLabel(activeRoadmap)}
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Choose your active roadmap syllabus path.">
                  <Select
                    value={activeRoadmap || undefined}
                    placeholder="Select Path"
                    onChange={handleRoadmapChange}
                    style={{ width: 180 }}
                    options={[
                      { value: 'data-engineering', label: 'Data Engineering' },
                      { value: 'full-stack', label: 'Full Stack' },
                      { value: 'java', label: 'Java Developer' },
                      { value: 'flutter', label: 'Flutter Developer' }
                    ]}
                    dropdownStyle={{ background: '#111827' }}
                  />
                </Tooltip>
              )}
            </div>

            <div style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
              <UserOutlined style={{ marginRight: 6, color: '#4f46e5' }} />
              <span>{user.name}</span>
            </div>

            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: '#ef4444' }}
            >
              Logout
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/day/:dayNumber" element={<DayDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#0b0f19', color: '#64748b', borderTop: '1px solid #1e293b' }}>
        Roadmap Tracker — By Harish
      </Footer>
    </Layout>
  );
}

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#4f46e5',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorInfo: '#3b82f6',
          borderRadius: 12,
          fontFamily: 'Outfit, Inter, sans-serif',
          colorBgBase: '#0b0f19',
          colorBgContainer: '#111827',
          colorBorder: '#1e293b'
        },
        components: {
          Card: {
            colorBgContainer: '#111827',
            colorBorderSecondary: '#1e293b'
          },
          Progress: {
            remainingColor: '#1e293b'
          }
        }
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
}

export default App;
