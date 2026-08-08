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
  Space
} from 'antd';
import { 
  SaveOutlined, 
  MailOutlined, 
  MessageOutlined, 
  ClockCircleOutlined,
  CalendarOutlined,
  WarningOutlined
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
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingSMS, setTestingSMS] = useState(false);
  const [error, setError] = useState(null);
  
  // States to keep track of test outcomes
  const [emailTestStatus, setEmailTestStatus] = useState(null);
  const [smsTestStatus, setSmsTestStatus] = useState(null);

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
      message.success('Settings updated and scheduler updated successfully!');
      fetchSettings();
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setTestingEmail(false);
      setEmailTestStatus(null);
      
      // Save changes first to ensure credentials apply
      const currentValues = form.getFieldsValue();
      const settingsData = {
        ...currentValues,
        roadmapStartDate: currentValues.roadmapStartDate ? currentValues.roadmapStartDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      };
      await api.updateSettings(settingsData);

      setTestingEmail(true);
      const result = await api.sendTestEmail();
      
      if (result.mocked) {
        setEmailTestStatus({
          type: 'warning',
          message: 'Test email simulated in server console.',
          description: 'The email was logged to the terminal window since SMTP host credentials are not configured in your server .env file.'
        });
      } else {
        setEmailTestStatus({
          type: 'success',
          message: 'Test email dispatched successfully!',
          description: `An email was dispatched via your SMTP server configuration to: ${currentValues.email}`
        });
      }
    } catch (err) {
      console.error(err);
      setEmailTestStatus({
        type: 'error',
        message: 'SMTP Test Failed',
        description: err.message || 'Failed to dispatch email. Check your SMTP configurations in server/.env file.'
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleTestSMS = async () => {
    try {
      setTestingSMS(false);
      setSmsTestStatus(null);

      // Save changes first
      const currentValues = form.getFieldsValue();
      const settingsData = {
        ...currentValues,
        roadmapStartDate: currentValues.roadmapStartDate ? currentValues.roadmapStartDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      };
      await api.updateSettings(settingsData);

      setTestingSMS(true);
      const result = await api.sendTestSMS();

      if (result.mocked) {
        setSmsTestStatus({
          type: 'warning',
          message: 'Test SMS simulated in server console.',
          description: 'The message was logged to the terminal window since Twilio credentials are not configured in your server .env file.'
        });
      } else {
        setSmsTestStatus({
          type: 'success',
          message: 'Test SMS dispatched successfully!',
          description: `An SMS message was dispatched via your Twilio configuration to: ${currentValues.phoneNumber}`
        });
      }
    } catch (err) {
      console.error(err);
      setSmsTestStatus({
        type: 'error',
        message: 'Twilio SMS Test Failed',
        description: err.message || 'Failed to dispatch SMS. Check your Twilio credentials and phone formats in server/.env file.'
      });
    } finally {
      setTestingSMS(false);
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
    <Row gutter={[24, 24]}>
      {/* Configuration Form */}
      <Col xs={24} lg={15}>
        <Card title={<Space><ClockCircleOutlined style={{ color: '#4f46e5' }} /><span>Reminder Configuration</span></Space>}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              emailReminderEnabled: true,
              smsReminderEnabled: true
            }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Roadmap Start Date"
                  name="roadmapStartDate"
                  rules={[{ required: true, message: 'Please specify the start date' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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
                  <Input placeholder="E.g. student@example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mobile/Phone Number"
                  name="phoneNumber"
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input placeholder="E.g. +91XXXXXXXXXX (Include Country Code)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Daily Reminder Time"
                  name="reminderTime"
                  rules={[{ required: true, message: 'Please specify reminder time' }]}
                  tooltip="Format: HH:MM AM/PM (e.g. '08:00 PM')"
                >
                  <Input placeholder="E.g. 08:00 PM" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Timezone"
                  name="timezone"
                  rules={[{ required: true, message: 'Please select timezone' }]}
                >
                  <Select options={timezoneOptions} />
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
                  <Switch checkedChildren="ON" unCheckedChildren="OFF" />
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
      </Col>

      {/* Test Center */}
      <Col xs={24} lg={9}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Card title="Notification Test Center">
            <Paragraph type="secondary" style={{ fontSize: '0.85rem' }}>
              Verify your server credentials before relying on the automatic 8:00 PM cron scheduler. Changes to Name, Email, and Phone above will be auto-saved when testing.
            </Paragraph>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
              <Button 
                icon={<MailOutlined />} 
                onClick={handleTestEmail} 
                loading={testingEmail}
                style={{ width: '100%' }}
              >
                Send Test Email
              </Button>

              <Button 
                icon={<MessageOutlined />} 
                onClick={handleTestSMS} 
                loading={testingSMS}
                style={{ width: '100%' }}
              >
                Send Test SMS
              </Button>
            </div>

            {/* Test Results */}
            {emailTestStatus && (
              <Alert
                message={emailTestStatus.message}
                description={emailTestStatus.description}
                type={emailTestStatus.type}
                showIcon
                closable
                onClose={() => setEmailTestStatus(null)}
                style={{ marginBottom: 12 }}
              />
            )}

            {smsTestStatus && (
              <Alert
                message={smsTestStatus.message}
                description={smsTestStatus.description}
                type={smsTestStatus.type}
                showIcon
                closable
                onClose={() => setSmsTestStatus(null)}
              />
            )}
          </Card>

          <Card title={<Space><WarningOutlined style={{ color: '#f59e0b' }} /><span>Credentials Reminder</span></Space>}>
            <Paragraph style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              Ensure your Twilio and SMTP settings are correctly stored in the backend <code>server/.env</code> file.
            </Paragraph>
            <Paragraph style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              To receive actual SMS and emails, provide details for:
            </Paragraph>
            <ul style={{ paddingLeft: 20, fontSize: '0.85rem', color: '#94a3b8' }}>
              <li>SMTP_HOST, SMTP_USER, SMTP_PASSWORD</li>
              <li>TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER</li>
            </ul>
          </Card>
        </Space>
      </Col>
    </Row>
  );
}
