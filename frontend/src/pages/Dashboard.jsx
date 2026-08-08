import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Progress, 
  Tag, 
  Input, 
  Button, 
  Row, 
  Col, 
  Statistic, 
  Space, 
  Radio, 
  Empty, 
  Spin, 
  Alert, 
  Tooltip,
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  PlayCircleOutlined, 
  RightOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined, 
  BookOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { api } from '../services/api';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const statusColors = {
  TODO: { border: '#d9d9d9', bg: '#1f1f1f', color: '#8c8c8c', text: 'TODO' },
  IN_PROGRESS: { border: '#177ddc', bg: '#112a45', color: '#177ddc', text: 'IN PROGRESS' },
  COMPLETED: { border: '#49aa19', bg: '#162b17', color: '#49aa19', text: 'COMPLETED' },
  SKIPPED: { border: '#595959', bg: '#1f1f1f', color: '#595959', text: 'SKIPPED' }
};

const statusTags = {
  TODO: <Tag color="default">TODO</Tag>,
  IN_PROGRESS: <Tag color="processing">IN PROGRESS</Tag>,
  COMPLETED: <Tag color="success">COMPLETED</Tag>,
  SKIPPED: <Tag color="warning">SKIPPED</Tag>
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDays: 45,
    completed: 0,
    inProgress: 0,
    todo: 45,
    skipped: 0,
    overallProgress: 0
  });
  const [todayDay, setTodayDay] = useState(null);
  const [todayDayNum, setTodayDayNum] = useState(1);
  const [continueDayNum, setContinueDayNum] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dashData = await api.getDashboard();
      setStats(dashData.stats);
      setTodayDay(dashData.todayDay);
      setTodayDayNum(dashData.todayDayNumber);
      setContinueDayNum(dashData.continueDayNumber);

      const roadmapData = await api.getRoadmap();
      setRoadmap(roadmapData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to connect to backend server. Make sure MongoDB and backend are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartDay = async (dayNumber) => {
    try {
      await api.startDay(dayNumber);
      navigate(`/day/${dayNumber}`);
    } catch (err) {
      console.error(err);
    }
  };

  const getFilteredDays = () => {
    return roadmap.filter(day => {
      // Search Match
      const matchesSearch = 
        day.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        day.phase.toLowerCase().includes(searchQuery.toLowerCase()) ||
        day.tasks.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter Match
      const matchesFilter = statusFilter === 'ALL' || day.status === statusFilter;
      
      return matchesSearch && matchesFilter;
    });
  };

  // Custom calendar date cell render
  const renderCalendarDay = (dayNum) => {
    const day = roadmap.find(d => d.dayNumber === dayNum);
    if (!day) return null;

    let icon = <span style={{ color: '#595959' }}>○</span>;
    let color = '#595959';

    if (day.status === 'COMPLETED') {
      icon = <CheckCircleOutlined style={{ color: '#49aa19' }} />;
      color = '#49aa19';
    } else if (day.status === 'IN_PROGRESS') {
      icon = <ClockCircleOutlined style={{ color: '#177ddc' }} />;
      color = '#177ddc';
    } else if (day.status === 'SKIPPED') {
      icon = <CloseCircleOutlined style={{ color: '#d32029' }} />;
      color = '#d32029';
    }

    return (
      <Tooltip title={`Day ${dayNum}: ${day.topic} (${day.status})`}>
        <div 
          onClick={() => navigate(`/day/${dayNum}`)}
          style={{
            border: `1px solid ${day.status === 'TODO' ? '#1e293b' : color}`,
            backgroundColor: day.status === 'TODO' ? 'transparent' : 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            padding: '8px 4px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          className="calendar-day-box"
        >
          <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: 4 }}>{dayNum}</div>
          <div style={{ fontSize: '0.9rem' }}>{icon}</div>
        </div>
      </Tooltip>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Backend Connection Error"
        description={
          <div>
            <p>{error}</p>
            <p><strong>Steps to resolve:</strong></p>
            <ol>
              <li>Ensure MongoDB local database is started (e.g. run <code>mongod</code> or start the service).</li>
              <li>Ensure the server backend is running (go to <code>server/</code> and run <code>npm run dev</code>).</li>
              <li>If you're using custom database strings, update <code>server/.env</code> and restart.</li>
            </ol>
            <Button type="primary" onClick={fetchData} style={{ marginTop: 12 }}>
              Retry Connection
            </Button>
          </div>
        }
        type="error"
        showIcon
      />
    );
  }

  const filteredDays = getFilteredDays();

  return (
    <div>
      {/* Overall Progress Banner */}
      <div className="progress-banner">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8}>
            <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#94a3b8' }}>Overall Completion</Title>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 8 }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
                {stats.overallProgress}%
              </span>
              <span style={{ marginLeft: 8, color: '#64748b' }}>completed</span>
            </div>
            <Progress 
              percent={stats.overallProgress} 
              showInfo={false} 
              strokeColor={{
                '0%': '#4f46e5',
                '100%': '#06b6d4',
              }}
              style={{ marginTop: 12 }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Completed" value={stats.completed} suffix="/ 45" valueStyle={{ color: '#10b981', fontWeight: 700 }} />
              </Col>
              <Col span={12}>
                <Statistic title="In Progress" value={stats.inProgress} suffix="/ 45" valueStyle={{ color: '#3b82f6', fontWeight: 700 }} />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Remaining" value={stats.todo} suffix="/ 45" valueStyle={{ color: '#d97706', fontWeight: 700 }} />
              </Col>
              <Col span={12}>
                <Statistic title="Skipped" value={stats.skipped} suffix="/ 45" valueStyle={{ color: '#64748b', fontWeight: 700 }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {/* Today's Learning Card */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <BookOutlined style={{ color: '#4f46e5' }} />
                <span>Today's Target Learning</span>
              </Space>
            }
            extra={
              continueDayNum && (
                <Button 
                  type="link" 
                  icon={<RightOutlined />} 
                  onClick={() => navigate(`/day/${continueDayNum}`)}
                >
                  Continue Learning (Day {continueDayNum})
                </Button>
              )
            }
            style={{ height: '100%' }}
          >
            {todayDay ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {todayDay.phase}
                  </Text>
                  {statusTags[todayDay.status]}
                </div>
                <Title level={3} style={{ marginTop: 0, marginBottom: 8, fontWeight: 700 }}>
                  Day {todayDay.dayNumber} — {todayDay.topic}
                </Title>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 16 }}>
                  {todayDay.description}
                </Paragraph>
                
                {/* Progress bar of today's day */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>Today's Task Progress</Text>
                    <Text strong>
                      {todayDay.tasks.filter(t => t.completed).length} / {todayDay.tasks.length} tasks
                    </Text>
                  </div>
                  <Progress 
                    percent={
                      todayDay.tasks.length > 0
                        ? Math.round((todayDay.tasks.filter(t => t.completed).length / todayDay.tasks.length) * 100)
                        : 0
                    } 
                    strokeColor="#3b82f6"
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {todayDay.status === 'TODO' && (
                    <Button 
                      type="primary" 
                      icon={<PlayCircleOutlined />} 
                      onClick={() => handleStartDay(todayDay.dayNumber)}
                      style={{ background: 'var(--primary-gradient)', border: 'none' }}
                    >
                      Start Learning
                    </Button>
                  )}
                  {todayDay.status === 'IN_PROGRESS' && (
                    <Button 
                      type="primary" 
                      icon={<PlayCircleOutlined />} 
                      onClick={() => navigate(`/day/${todayDay.dayNumber}`)}
                    >
                      Continue Day {todayDay.dayNumber}
                    </Button>
                  )}
                  {todayDay.status === 'COMPLETED' && (
                    <Button 
                      icon={<CheckCircleOutlined />} 
                      onClick={() => navigate(`/day/${todayDay.dayNumber}`)}
                    >
                      Review Day {todayDay.dayNumber}
                    </Button>
                  )}
                  {todayDay.status === 'SKIPPED' && (
                    <Button 
                      onClick={() => navigate(`/day/${todayDay.dayNumber}`)}
                    >
                      Open Day {todayDay.dayNumber}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Empty description="No specific target for today (Roadmap may not have started or already complete)" />
            )}
          </Card>
        </Col>

        {/* Info summary card */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <CalendarOutlined style={{ color: '#06b6d4' }} />
                <span>Roadmap Start Info</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            {roadmap.length > 0 && (
              <div>
                <p>
                  <strong>Today's Date:</strong> {dayjs().format('DD MMM YYYY')}
                </p>
                {/* Find user settings to show configured start date */}
                <p>
                  The roadmap is set up to track learning daily. You can reset your roadmap start date in <strong>Settings</strong> at any time.
                </p>
                <Alert 
                  message={
                    todayDayNum >= 1 && todayDayNum <= 45 
                      ? `You are on Day ${todayDayNum} of 45.` 
                      : todayDayNum > 45 
                      ? "Congratulations! You have completed the 45-day cycle."
                      : `Roadmap has not started yet. Starts in ${Math.abs(todayDayNum - 1)} days.`
                  }
                  type="info"
                  showIcon
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Main Roadmap Explorer section */}
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>Roadmap Explorer</span>
            <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)} size="small">
              <Radio.Button value="grid">Grid View</Radio.Button>
              <Radio.Button value="calendar">Calendar Grid</Radio.Button>
            </Radio.Group>
          </div>
        }
      >
        {/* Search and Filters */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Input
            placeholder="Search topic, phase, or tasks..."
            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ maxWidth: 350, width: '100%' }}
            allowClear
          />
          
          <Radio.Group 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="ALL">All ({roadmap.length})</Radio.Button>
            <Radio.Button value="TODO">TODO ({roadmap.filter(d => d.status === 'TODO').length})</Radio.Button>
            <Radio.Button value="IN_PROGRESS">In Progress ({roadmap.filter(d => d.status === 'IN_PROGRESS').length})</Radio.Button>
            <Radio.Button value="COMPLETED">Completed ({roadmap.filter(d => d.status === 'COMPLETED').length})</Radio.Button>
            <Radio.Button value="SKIPPED">Skipped ({roadmap.filter(d => d.status === 'SKIPPED').length})</Radio.Button>
          </Radio.Group>
        </div>

        {viewMode === 'calendar' ? (
          /* Calendar view displaying all 45 days in a 9x5 block grid */
          <div style={{ padding: '12px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 12 }} className="calendar-grid-layout">
              {Array.from({ length: 45 }, (_, i) => i + 1).map(dayNum => (
                <div key={dayNum}>
                  {renderCalendarDay(dayNum)}
                </div>
              ))}
            </div>
            {/* Styles for responsive grid */}
            <style dangerouslySetInnerHTML={{__html: `
              @media (max-width: 992px) {
                .calendar-grid-layout {
                  grid-template-columns: repeat(5, 1fr) !important;
                }
              }
              @media (max-width: 576px) {
                .calendar-grid-layout {
                  grid-template-columns: repeat(3, 1fr) !important;
                }
              }
            `}} />
          </div>
        ) : (
          /* Grid View of cards */
          <div>
            {filteredDays.length === 0 ? (
              <Empty description="No matching days found" />
            ) : (
              <div className="dashboard-grid">
                {filteredDays.map((day) => {
                  const compCount = day.tasks.filter(t => t.completed).length;
                  const totalCount = day.tasks.length;
                  const percent = totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0;

                  return (
                    <Card
                      key={day.dayNumber}
                      hoverable
                      className="roadmap-card"
                      onClick={() => navigate(`/day/${day.dayNumber}`)}
                      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                          DAY {day.dayNumber}
                        </span>
                        {statusTags[day.status]}
                      </div>
                      
                      <Title level={5} style={{ margin: '0 0 8px 0', fontWeight: 700, lineHeight: 1.3, flexShrink: 0 }}>
                        {day.topic}
                      </Title>
                      
                      <Text type="secondary" style={{ fontSize: '0.85rem', marginBottom: 16, display: 'block', height: 40, overflow: 'hidden' }}>
                        {day.phase}
                      </Text>

                      {/* Display a compact list of tasks */}
                      <div style={{ flex: 1, marginBottom: 16 }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 6, fontWeight: 500 }}>
                          Key Topics ({compCount}/{totalCount}):
                        </div>
                        {day.tasks.slice(0, 3).map((task) => (
                          <div 
                            key={task._id} 
                            style={{ 
                              fontSize: '0.8rem', 
                              display: 'flex', 
                              alignItems: 'center', 
                              margin: '2px 0',
                              color: task.completed ? '#10b981' : '#94a3b8'
                            }}
                          >
                            <span style={{ marginRight: 6 }}>{task.completed ? '✓' : '•'}</span>
                            <span style={{ textDecoration: task.completed ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                        {day.tasks.length > 3 && (
                          <div style={{ fontSize: '0.75rem', color: '#4f46e5', marginTop: 4 }}>
                            + {day.tasks.length - 3} more tasks
                          </div>
                        )}
                      </div>

                      {/* Sub-progress bar on card */}
                      <Progress 
                        percent={percent} 
                        size="small" 
                        status={day.status === 'COMPLETED' ? 'success' : 'normal'}
                        style={{ marginTop: 'auto', paddingTop: 8 }}
                      />
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
