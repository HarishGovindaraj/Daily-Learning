import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, ConfigProvider, theme } from 'antd';
import { DashboardOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import DayDetail from './pages/DayDetail';
import Settings from './pages/Settings';

const { Header, Content, Footer } = Layout;

function AppContent() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', marginRight: 40, textDecoration: 'none' }}>
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
              DE Roadmap
            </span>
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['dashboard']}
            style={{ flex: 1, minWidth: 0 }}
            items={[
              {
                key: 'dashboard',
                icon: <DashboardOutlined />,
                label: <Link to="/">Dashboard</Link>,
              },
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: <Link to="/settings">Settings & Reminders</Link>,
              }
            ]}
          />
        </div>
      </Header>

      <Content style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/day/:dayNumber" element={<DayDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#0b0f19', color: '#64748b', borderTop: '1px solid #1e293b' }}>
        Data Engineering Roadmap Tracker — By Harish
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
