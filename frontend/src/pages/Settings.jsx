import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Switch, 
  Button, 
  Select, 
  Row, 
  Col, 
  Spin, 
  Alert, 
  Divider, 
  message,
  Typography,
  DatePicker,
  Space,
  Tooltip
} from 'antd';
import { 
  SaveOutlined, 
  ClockCircleOutlined
} from '@ant-design/icons';
import { api } from '../services/api';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const timezoneOptions = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST - India)' },
  { value: 'UTC', label: 'UTC (Greenwich Mean Time)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT - USA)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST - UK)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT - Singapore)' }
];

export default function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSettings();
      
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        timezone: data.timezone,
        reminderTime: data.reminderTime,
        emailReminderEnabled: data.emailReminderEnabled,
        smsReminderEnabled: data.smsReminderEnabled,
        roadmapStartDate: data.roadmapStartDate ? dayjs(data.roadmapStartDate, 'YYYY-MM-DD') : dayjs()
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch settings from server. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onFinish = async (values) => {
    try {
      setSaving(true);
      const settingsData = {
        ...values,
        roadmapStartDate: values.roadmapStartDate ? values.roadmapStartDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      };
      
      await api.updateSettings(settingsData);
      message.success('Settings updated successfully!');
      fetchSettings();
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Loading settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Connection Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" type="primary" onClick={fetchSettings}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '10px 0' }}>
      <Card title={<Space><ClockCircleOutlined style={{ color: '#4f46e5' }} /><span>Reminder Configuration</span></Space>} className="roadmap-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            emailReminderEnabled: true,
            smsReminderEnabled: false
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Enter your name" style={{ background: '#0b0f19', border: '1px solid #1e293b' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Roadmap Start Date"
                name="roadmapStartDate"
                rules={[{ required: true, message: 'Please specify the start date' }]}
              >
                <DatePicker style={{ width: '100%', background: '#0b0f19', border: '1px solid #1e293b' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="E.g. student@example.com" style={{ background: '#0b0f19', border: '1px solid #1e293b' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mobile/Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input placeholder="E.g. +91XXXXXXXXXX" style={{ background: '#0b0f19', border: '1px solid #1e293b' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Daily Reminder Time"
                name="reminderTime"
                rules={[{ required: true, message: 'Please specify reminder time' }]}
                tooltip="Format: HH:MM AM/PM (e.g. '08:30 PM')"
              >
                <Input placeholder="E.g. 08:30 PM" style={{ background: '#0b0f19', border: '1px solid #1e293b' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Timezone"
                name="timezone"
                rules={[{ required: true, message: 'Please select timezone' }]}
              >
                <Select options={timezoneOptions} dropdownStyle={{ background: '#111827' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ margin: '12px 0' }}>Toggles</Divider>

          <Row gutter={16} align="middle">
            <Col span={12}>
              <Form.Item
                label="Email Reminders"
                name="emailReminderEnabled"
                valuePropName="checked"
              >
                <Switch checkedChildren="ON" unCheckedChildren="OFF" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="SMS Reminders"
                name="smsReminderEnabled"
                valuePropName="checked"
              >
                <Tooltip title="This feature is coming soon!">
                  <span>
                    <Switch checkedChildren="ON" unCheckedChildren="OFF" disabled />
                  </span>
                </Tooltip>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={saving}
              style={{ width: '100%', background: 'var(--primary-gradient)', border: 'none' }}
            >
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
