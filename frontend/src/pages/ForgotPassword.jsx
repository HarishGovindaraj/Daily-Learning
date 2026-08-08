import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Title, Text, Paragraph } = Typography;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  // Step 1: Request OTP
  const handleRequestOTP = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await api.forgotPassword(values.email);
      setEmailAddress(values.email);
      setOtpSent(true);
      message.success('6-digit OTP has been sent to your email!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await api.resetPassword(emailAddress, values.otp, values.newPassword);
      message.success('Password updated successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Password reset failed. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
      <Card style={{ maxWidth: 400, width: '100%', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)' }} className="roadmap-card">
        
        {/* Back Link */}
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: 16 }}>
          <ArrowLeftOutlined style={{ marginRight: 6 }} /> Back to Log In
        </Link>

        {!otpSent ? (
          /* Step 1: Form to request OTP */
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: '3rem' }}>🔑</span>
              <Title level={3} style={{ marginTop: 12, fontWeight: 800 }}>Forgot Password?</Title>
              <Paragraph type="secondary" style={{ fontSize: '0.9rem' }}>
                Enter your email address and we will send you a 6-digit verification code to reset your password.
              </Paragraph>
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
              name="request_otp_form"
              layout="vertical"
              onFinish={handleRequestOTP}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your Email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                  placeholder="Your email address"
                  size="large"
                  style={{ background: '#0b0f19', border: '1px solid #1e293b' }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  style={{ width: '100%', background: 'var(--primary-gradient)', border: 'none', marginTop: 8 }}
                >
                  Send OTP Code
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          /* Step 2: Form to submit OTP and new password */
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: '3rem' }}>📨</span>
              <Title level={3} style={{ marginTop: 12, fontWeight: 800 }}>Reset Password</Title>
              <Paragraph type="secondary" style={{ fontSize: '0.9rem' }}>
                We sent a verification code to <strong style={{ color: '#f8fafc' }}>{emailAddress}</strong>. Enter it below along with your new password.
              </Paragraph>
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
              name="reset_password_form"
              layout="vertical"
              onFinish={handleResetPassword}
              requiredMark={false}
            >
              <Form.Item
                label="6-Digit OTP Code"
                name="otp"
                rules={[
                  { required: true, message: 'Please enter the OTP code!' },
                  { len: 6, message: 'OTP must be exactly 6 digits!' }
                ]}
              >
                <Input
                  prefix={<KeyOutlined style={{ color: '#8c8c8c' }} />}
                  placeholder="Enter 6-digit OTP"
                  size="large"
                  style={{ background: '#0b0f19', border: '1px solid #1e293b', letterSpacing: 4, textAlign: 'center', fontWeight: 'bold' }}
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter a new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
                  placeholder="Enter new password (min 6 chars)"
                  size="large"
                  style={{ background: '#0b0f19', border: '1px solid #1e293b' }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  style={{ width: '100%', background: 'var(--primary-gradient)', border: 'none', marginTop: 8 }}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text type="secondary">Didn't receive the email? </Text>
              <Button 
                type="link" 
                onClick={() => handleRequestOTP({ email: emailAddress })}
                disabled={loading}
                style={{ padding: 0, color: '#4f46e5', fontWeight: 600, height: 'auto', verticalAlign: 'baseline' }}
              >
                Resend Code
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
