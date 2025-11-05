import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  Download,
  Upload,
  Search,
  GraduationCap,
  Heart,
  CreditCard,
  Baby,
  Home,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

interface ApplicationsProps {
  onNavigate: (page: string) => void;
}

interface Application {
  id: string;
  applicationId: string;
  type: string;
  scheme: string;
  description: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  date: string;
  category: string;
  icon: React.ElementType;
  color: string;
  progress: number;
  amount?: string;
  documents: Array<{
    name: string;
    status: 'Uploaded' | 'Pending' | 'Verified';
  }>;
  timeline: Array<{
    status: string;
    date: string;
    description: string;
  }>;
  remarks?: string;
}

export function Applications({ onNavigate }: ApplicationsProps) {
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockApplications: Application[] = [
    {
      id: '1',
      applicationId: '#APP2025001',
      type: 'Education',
      scheme: 'PM Scholarship Scheme 2025',
      description: 'Merit-based scholarship for undergraduate students',
      status: 'Approved',
      date: '2025-09-15',
      category: 'Education',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      progress: 100,
      amount: '₹25,000',
      documents: [
        { name: 'Income Certificate', status: 'Verified' },
        { name: 'Academic Records', status: 'Verified' },
        { name: 'ID Proof', status: 'Verified' },
      ],
      timeline: [
        { status: 'Submitted', date: '2025-09-15', description: 'Application submitted successfully' },
        { status: 'Under Review', date: '2025-09-18', description: 'Application is being reviewed by officials' },
        { status: 'Documents Verified', date: '2025-09-22', description: 'All documents verified successfully' },
        { status: 'Approved', date: '2025-09-25', description: 'Application approved. Amount will be disbursed shortly.' },
      ],
      remarks: 'Scholarship approved. Amount will be credited to your bank account within 7 working days.',
    },
    {
      id: '2',
      applicationId: '#APP2025002',
      type: 'Health',
      scheme: 'Ayushman Bharat Health Card',
      description: 'Health insurance coverage under Ayushman Bharat',
      status: 'Under Review',
      date: '2025-10-20',
      category: 'Health',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      progress: 60,
      documents: [
        { name: 'Aadhaar Card', status: 'Verified' },
        { name: 'Income Certificate', status: 'Verified' },
        { name: 'Family Details', status: 'Pending' },
      ],
      timeline: [
        { status: 'Submitted', date: '2025-10-20', description: 'Application submitted successfully' },
        { status: 'Under Review', date: '2025-10-22', description: 'Application is being reviewed' },
        { status: 'Document Request', date: '2025-10-25', description: 'Additional family details required' },
      ],
      remarks: 'Please upload complete family details to proceed with your application.',
    },
    {
      id: '3',
      applicationId: '#APP2025003',
      type: 'Child Welfare',
      scheme: 'Child Development Scheme',
      description: 'Nutritional support for children under 5 years',
      status: 'Pending',
      date: '2025-11-01',
      category: 'Child Welfare',
      icon: Baby,
      color: 'from-pink-500 to-red-500',
      progress: 30,
      documents: [
        { name: 'Birth Certificate', status: 'Uploaded' },
        { name: 'Parent ID Proof', status: 'Pending' },
        { name: 'Address Proof', status: 'Pending' },
      ],
      timeline: [
        { status: 'Submitted', date: '2025-11-01', description: 'Application submitted successfully' },
        { status: 'Pending Review', date: '2025-11-01', description: 'Awaiting initial review' },
      ],
    },
    {
      id: '4',
      applicationId: '#APP2025004',
      type: 'Housing',
      scheme: 'Pradhan Mantri Awas Yojana',
      description: 'Affordable housing scheme for economically weaker sections',
      status: 'Rejected',
      date: '2025-08-10',
      category: 'Housing',
      icon: Home,
      color: 'from-blue-500 to-blue-600',
      progress: 0,
      documents: [
        { name: 'Income Certificate', status: 'Verified' },
        { name: 'Property Documents', status: 'Verified' },
        { name: 'Bank Statement', status: 'Verified' },
      ],
      timeline: [
        { status: 'Submitted', date: '2025-08-10', description: 'Application submitted successfully' },
        { status: 'Under Review', date: '2025-08-12', description: 'Application under review' },
        { status: 'Rejected', date: '2025-08-15', description: 'Application rejected due to income criteria not met' },
      ],
      remarks: 'Application rejected: Your income exceeds the eligibility criteria for this scheme.',
    },
    {
      id: '5',
      applicationId: '#APP2025005',
      type: 'Employment',
      scheme: 'Skill Development Program',
      description: 'Free skill training and certification program',
      status: 'Approved',
      date: '2025-10-05',
      category: 'Employment',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-600',
      progress: 100,
      documents: [
        { name: 'Educational Certificate', status: 'Verified' },
        { name: 'ID Proof', status: 'Verified' },
      ],
      timeline: [
        { status: 'Submitted', date: '2025-10-05', description: 'Application submitted successfully' },
        { status: 'Under Review', date: '2025-10-06', description: 'Application under review' },
        { status: 'Approved', date: '2025-10-08', description: 'Application approved. Training starts Nov 10' },
      ],
      remarks: 'Training program starts on November 10, 2025. Details will be sent via email.',
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pending':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dotColor: 'bg-yellow-500' };
      case 'Under Review':
        return { icon: AlertCircle, color: 'bg-blue-100 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' };
      case 'Approved':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', dotColor: 'bg-green-500' };
      case 'Rejected':
        return { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500' };
      default:
        return { icon: Clock, color: 'bg-gray-100 text-gray-700 border-gray-200', dotColor: 'bg-gray-500' };
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-700';
      case 'Uploaded':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredApplications = mockApplications.filter((app) => {
    const matchesTab = activeTab === 'all' || app.status.toLowerCase().replace(' ', '-') === activeTab;
    const matchesSearch = app.scheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.applicationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = [
    { label: 'Total Applications', count: mockApplications.length, color: 'from-blue-500 to-blue-600' },
    { label: 'Approved', count: mockApplications.filter(a => a.status === 'Approved').length, color: 'from-green-500 to-green-600' },
    { label: 'Under Review', count: mockApplications.filter(a => a.status === 'Under Review').length, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Rejected', count: mockApplications.filter(a => a.status === 'Rejected').length, color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="hover:bg-white/50 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="gradient-text text-4xl">My Applications</h1>
          <p className="text-gray-600 mt-2">Track and manage all your government scheme applications</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl">{stat.count}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by scheme name or application ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200/50 focus:bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Filter Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="under-review">Under Review</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Applications */}
              <div className="space-y-4">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No applications found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
                  </div>
                ) : (
                  filteredApplications.map((app, index) => {
                    const statusConfig = getStatusConfig(app.status);
                    const isExpanded = expandedApplication === app.id;

                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            {/* Header */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center flex-shrink-0`}>
                                <app.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-blue-600">{app.applicationId}</span>
                                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                                    {app.type}
                                  </Badge>
                                  <Badge className={`${statusConfig.color} border`}>
                                    <statusConfig.icon className="w-3 h-3 mr-1" />
                                    {app.status}
                                  </Badge>
                                </div>
                                <h3 className="text-lg">{app.scheme}</h3>
                                <p className="text-sm text-gray-600">{app.description}</p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Application Progress</span>
                                <span className="text-gray-900">{app.progress}%</span>
                              </div>
                              <Progress value={app.progress} className="h-2" />
                            </div>

                            {/* Quick Info */}
                            <div className="flex items-center gap-4 flex-wrap text-sm">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Applied on {new Date(app.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}</span>
                              </div>
                              {app.amount && (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  Amount: {app.amount}
                                </Badge>
                              )}
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-4 pt-4"
                                >
                                  <Separator />

                                  {/* Documents */}
                                  <div>
                                    <h4 className="text-sm mb-3 text-gray-700">Documents</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {app.documents.map((doc, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                          <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">{doc.name}</span>
                                          </div>
                                          <Badge className={`${getDocumentStatusColor(doc.status)} text-xs`}>
                                            {doc.status}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Remarks */}
                                  {app.remarks && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                      <h4 className="text-sm mb-2 text-blue-900">Remarks</h4>
                                      <p className="text-sm text-blue-800">{app.remarks}</p>
                                    </div>
                                  )}

                                  {/* Timeline */}
                                  <div>
                                    <h4 className="text-sm mb-4 text-gray-700">Application Timeline</h4>
                                    <div className="space-y-4">
                                      {app.timeline.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                          <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${getStatusConfig(item.status).dotColor}`} />
                                            {idx < app.timeline.length - 1 && (
                                              <div className="w-0.5 h-full bg-gray-300 my-1" />
                                            )}
                                          </div>
                                          <div className="flex-1 pb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-sm">{item.status}</span>
                                              <span className="text-xs text-gray-500">
                                                {new Date(item.date).toLocaleDateString('en-IN')}
                                              </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                      <Download className="w-4 h-4 mr-2" />
                                      Download Receipt
                                    </Button>
                                    {app.status === 'Under Review' && (
                                      <Button variant="outline" size="sm" className="flex-1">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Documents
                                      </Button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* View Details Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedApplication(isExpanded ? null : app.id)}
                            className="flex-shrink-0"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {isExpanded ? 'Hide' : 'Details'}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 ml-2" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-2" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
