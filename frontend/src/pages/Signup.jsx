import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, UserAddOutlined } from '@ant-design/icons';
import { api } from '../services/api';
import Turnstile from '../components/Turnstile';

const { Title, Text } = Typography;

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState('');

  const onFinish = async (values) => {
    try {
      if (!captchaToken) {
        setError('Please complete the security check.');
        return;
      }
      setLoading(true);
      setError(null);
      await api.signup(values.name, values.email, values.password, values.phoneNumber, captchaToken);

      message.success('User account created successfully! Please log in to continue.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
      <Card style={{ maxWidth: 400, width: '100%', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)' }} className="roadmap-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: '3rem' }}>🚀</span>
          <Title level={3} style={{ marginTop: 12, fontWeight: 800 }}>Create Account</Title>
          <Text type="secondary">Sign up to track multiple roadmaps</Text>
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
          name="signup_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your full Name!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="Full name"
              size="large"
              style={{ background: '#0b0f19', border: '1px solid #1e293b' }}
            />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Please input your Password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="Password (min 6 characters)"
              size="large"
              style={{ background: '#0b0f19', border: '1px solid #1e293b' }}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="Phone number (e.g. +919876543210)"
              size="large"
              style={{ background: '#0b0f19', border: '1px solid #1e293b' }}
            />
          </Form.Item>

          <Turnstile onSuccess={setCaptchaToken} onExpire={() => setCaptchaToken('')} />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<UserAddOutlined />}
              style={{ width: '100%', background: 'var(--primary-gradient)', border: 'none', marginTop: 8 }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Text type="secondary">Already have an account? </Text>
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>Log In Here</Link>
        </div>
      </Card>
    </div>
  );
}
