import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  Checkbox, 
  Progress, 
  Button, 
  Input, 
  Select, 
  Space, 
  Row, 
  Col, 
  Spin, 
  Alert, 
  Breadcrumb, 
  message,
  Typography
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  CheckOutlined, 
  PlayCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { api } from '../services/api';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function DayDetail() {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('TODO');
  const [saving, setSaving] = useState(false);

  const fetchDayDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDayDetails(dayNumber);
      setDayData(data);
      setNotes(data.notes || '');
      setStatus(data.status);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load day details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayDetails();
  }, [dayNumber]);

  const handleTaskToggle = async (taskId, checked) => {
    try {
      // Optimistic update for smooth UI
      const updatedTasks = dayData.tasks.map(t => 
        t._id === taskId ? { ...t, completed: checked } : t
      );
      
      // Auto transition status if starting task from TODO
      let nextStatus = status;
      if (checked && status === 'TODO') {
        nextStatus = 'IN_PROGRESS';
        setStatus('IN_PROGRESS');
      }

      setDayData({ 
        ...dayData, 
        tasks: updatedTasks,
        status: nextStatus
      });

      // Fire API update
      await api.updateTask(dayNumber, taskId, checked);
    } catch (err) {
      console.error(err);
      message.error('Failed to update task completion');
      // Revert in case of failure
      fetchDayDetails();
    }
  };

  const handleSaveProgress = async () => {
    try {
      setSaving(true);
      // Save notes
      await api.updateNotes(dayNumber, notes);
      // Save status updates
      await api.updateDay(dayNumber, { status, notes });
      message.success('Progress saved successfully');
      fetchDayDetails();
    } catch (err) {
      console.error(err);
      message.error('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      setSaving(true);
      const updated = await api.completeDay(dayNumber);
      setDayData(updated);
      setStatus('COMPLETED');
      message.success('Congratulations! Day marked as completed.');
    } catch (err) {
      console.error(err);
      message.error('Failed to mark day as completed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip={`Loading Day ${dayNumber} details...`} />
      </div>
    );
  }

  if (error || !dayData) {
    return (
      <Alert
        message="Error"
        description={error || `Could not find roadmap day ${dayNumber}.`}
        type="error"
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        }
      />
    );
  }

  const totalTasks = dayData.tasks.length;
  const completedTasks = dayData.tasks.filter(t => t.completed).length;
  const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;
  const progressPercent = totalTasks > 0 ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(2)) : 0;

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item><Link to="/">Roadmap Dashboard</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Day {dayData.dayNumber}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* Main Details and Checklist */}
        <Col xs={24} lg={15}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Button 
                  type="text" 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate('/')} 
                />
                <div>
                  <Text type="secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    {dayData.phase}
                  </Text>
                  <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                    Day {dayData.dayNumber}: {dayData.topic}
                  </Title>
                </div>
              </div>
            }
          >
            <Paragraph style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 24 }}>
              {dayData.description || 'No description available for this day. Complete the checklist items below to master this topic.'}
            </Paragraph>

            <div style={{ marginBottom: 24, padding: '16px', background: '#0b0f19', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <Row align="middle" gutter={16}>
                <Col xs={24} sm={8}>
                  <div style={{ fontWeight: 'bold' }}>
                    {completedTasks} / {totalTasks} Completed
                  </div>
                  <Text type="secondary">Progress: {progressPercent}%</Text>
                </Col>
                <Col xs={24} sm={16}>
                  <Progress 
                    percent={progressPercent} 
                    strokeColor={{
                      '0%': '#10b981',
                      '100%': '#059669',
                    }}
                  />
                </Col>
              </Row>
            </div>

            <Title level={4} style={{ marginBottom: 16, fontWeight: 600 }}>Learning Checklist</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dayData.tasks.map((task) => (
                <Card 
                  key={task._id} 
                  bodyStyle={{ padding: '12px 16px' }}
                  style={{ 
                    border: task.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #1e293b',
                    background: task.completed ? 'rgba(16, 185, 129, 0.02)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => handleTaskToggle(task._id, e.target.checked)}
                    style={{ width: '100%' }}
                  >
                    <span style={{ 
                      fontSize: '1rem', 
                      marginLeft: 8,
                      color: task.completed ? '#64748b' : '#f8fafc',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </span>
                  </Checkbox>
                </Card>
              ))}
            </div>
          </Card>
        </Col>

        {/* Side Actions, Notes, Status */}
        <Col xs={24} lg={9}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {/* Status Manager Card */}
            <Card title="Status Manager">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Current Status</Text>
                  <Select 
                    value={status} 
                    onChange={setStatus} 
                    style={{ width: '100%' }}
                    placeholder="Set Status"
                  >
                    <Option value="TODO">TODO</Option>
                    <Option value="IN_PROGRESS">IN PROGRESS</Option>
                    <Option value="COMPLETED" disabled={!allTasksCompleted}>
                      COMPLETED {!allTasksCompleted && '(Complete all tasks)'}
                    </Option>
                    <Option value="SKIPPED">SKIPPED</Option>
                  </Select>
                </div>

                {dayData.startedAt && (
                  <div>
                    <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Started At</Text>
                    <Text style={{ fontSize: '0.9rem' }}>
                      <CalendarOutlined style={{ marginRight: 6 }} />
                      {dayjs(dayData.startedAt).format('DD MMM YYYY, hh:mm A')}
                    </Text>
                  </div>
                )}

                {dayData.completedAt && (
                  <div>
                    <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Completed At</Text>
                    <Text style={{ fontSize: '0.9rem', color: '#10b981' }}>
                      <CheckOutlined style={{ marginRight: 6 }} />
                      {dayjs(dayData.completedAt).format('DD MMM YYYY, hh:mm A')}
                    </Text>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    loading={saving} 
                    onClick={handleSaveProgress}
                    style={{ width: '100%' }}
                  >
                    Save Progress
                  </Button>

                  <Button
                    type="primary"
                    danger={status !== 'COMPLETED'}
                    icon={<CheckOutlined />}
                    disabled={!allTasksCompleted}
                    loading={saving}
                    onClick={handleMarkComplete}
                    style={{ 
                      width: '100%', 
                      background: allTasksCompleted ? 'var(--success-gradient)' : '',
                      border: 'none'
                    }}
                  >
                    Mark Day Complete
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notes Section Card */}
            <Card title="What I Learned Today (Notes)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <TextArea
                  rows={6}
                  placeholder="Enter notes here. E.g. what you learned, key syntax, execution plans, challenges, links, or reminders..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ background: '#0b0f19', border: '1px solid #1e293b' }}
                />
                <Button 
                  type="dashed" 
                  icon={<SaveOutlined />} 
                  onClick={async () => {
                    try {
                      setSaving(true);
                      await api.updateNotes(dayNumber, notes);
                      message.success('Notes saved to MongoDB');
                    } catch (err) {
                      message.error('Failed to save notes');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  loading={saving}
                >
                  Save Notes Only
                </Button>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
