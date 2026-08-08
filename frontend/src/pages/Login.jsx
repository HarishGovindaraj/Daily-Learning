import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Typography, Space, message } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.login(values.email, values.password);

      // Save credentials in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        name: data.name,
        email: data.email,
        activeRoadmap: data.activeRoadmap
      }));

      message.success(`Welcome back, ${data.name}!`);
      // Redirect to dashboard
      navigate('/');
      window.location.reload(); // Force refresh to update Layout state
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
      <Card style={{ maxWidth: 400, width: '100%', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)' }} className="roadmap-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: '3rem' }}>📚</span>
          <Title level={3} style={{ marginTop: 12, fontWeight: 800 }}>Sign In</Title>
          <Text type="secondary">Convenient Personal Roadmap Tracker</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="Email address"
              size="large"
              style={{ background: '#0b0f19', border: '1px solid #1e293b' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
            style={{ marginBottom: 8 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="Password"
              size="large"
              style={{ background: '#0b0f19', border: '1px solid #1e293b' }}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/forgot-password" style={{ color: '#4f46e5', fontSize: '0.85rem' }}>Forgot Password?</Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<LoginOutlined />}
              style={{ width: '100%', background: 'var(--primary-gradient)', border: 'none', marginTop: 8 }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Text type="secondary">Don't have an account? </Text>
          <Link to="/signup" style={{ color: '#4f46e5', fontWeight: 600 }}>Sign Up Now</Link>
        </div>
      </Card>
    </div>
  );
}
