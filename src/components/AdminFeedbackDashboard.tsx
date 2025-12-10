import { useState } from 'react';
import { LayoutDashboard, TrendingUp, Clock, CheckCircle, AlertCircle, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface AdminFeedbackDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminFeedbackDashboard({ onNavigate }: AdminFeedbackDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const feedbackStats = {
    total: 1247,
    pending: 89,
    underReview: 45,
    resolved: 1113,
  };

  const feedbackItems = [
    {
      id: 'FB-2025-089',
      citizen: 'Rajesh Kumar',
      category: 'Health Services',
      subject: 'Long wait times at Central Medical Center',
      priority: 'High',
      status: 'Under Review',
      submittedDate: 'Nov 1, 2025',
      assignedTo: 'Sarah Johnson',
    },
    {
      id: 'FB-2025-088',
      citizen: 'Jane Smith',
      category: 'Digital Services',
      subject: 'Mobile app login issues',
      priority: 'Medium',
      status: 'Pending',
      submittedDate: 'Nov 2, 2025',
      assignedTo: 'Unassigned',
    },
    {
      id: 'FB-2025-087',
      citizen: 'Mike Johnson',
      category: 'Education',
      subject: 'Suggestion for online learning platform',
      priority: 'Low',
      status: 'Under Review',
      submittedDate: 'Nov 2, 2025',
      assignedTo: 'Robert Chen',
    },
    {
      id: 'FB-2025-086',
      citizen: 'Emily Davis',
      category: 'Transportation',
      subject: 'Request for new bus route',
      priority: 'Medium',
      status: 'Resolved',
      submittedDate: 'Oct 30, 2025',
      assignedTo: 'Maria Garcia',
    },
  ];

  const categoryStats = [
    { category: 'Health Services', count: 234, change: '+12%' },
    { category: 'Digital Services', count: 189, change: '+8%' },
    { category: 'Education', count: 156, change: '-5%' },
    { category: 'Transportation', count: 142, change: '+15%' },
    { category: 'Infrastructure', count: 98, change: '+3%' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'Under Review':
        return 'bg-blue-500';
      case 'Resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-orange-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
          <h1>Admin Feedback Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Manage and respond to citizen feedback submissions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Feedback</p>
                <div className="text-3xl">{feedbackStats.total}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <div className="text-3xl text-yellow-600">{feedbackStats.pending}</div>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Under Review</p>
                <div className="text-3xl text-blue-600">{feedbackStats.underReview}</div>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <div className="text-3xl text-green-600">{feedbackStats.resolved}</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">All Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest submissions requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-500">{item.id}</span>
                            <Badge className={getPriorityColor(item.priority)} variant="secondary">
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="mb-1">{item.subject}</p>
                          <p className="text-sm text-gray-600">{item.citizen}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        <Button size="sm" variant="ghost">Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback by Category</CardTitle>
                <CardDescription>Distribution across service categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryStats.map((stat) => (
                    <div key={stat.category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="mb-1">{stat.category}</p>
                        <p className="text-sm text-gray-600">{stat.count} submissions</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'}>
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* All Feedback */}
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Feedback Submissions</CardTitle>
                  <CardDescription>Manage and respond to citizen feedback</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="mb-6 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search feedback..."
                    className="pl-10"
                  />
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="review">Under Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Feedback Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Citizen</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbackItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.citizen}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.subject}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority)} variant="secondary">
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>{item.assignedTo}</TableCell>
                        <TableCell className="text-sm">{item.submittedDate}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Trends</CardTitle>
                <CardDescription>Monthly feedback submission trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                  <CardDescription>Average time to resolve feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-5xl mb-2 text-blue-600">2.5</div>
                    <p className="text-gray-600">Days Average</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Satisfaction Rate</CardTitle>
                  <CardDescription>Citizen satisfaction with responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-5xl mb-2 text-green-600">94%</div>
                    <p className="text-gray-600">Positive Feedback</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
