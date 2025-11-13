import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Mic,
  Upload,
  X,
  Building2,
  Heart,
  GraduationCap,
  Droplet,
  Zap,
  Bus,
  Shield,
  Home,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  FileText,
  MessageSquareText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Separator } from './ui/separator';

interface ComplaintsProps {
  onNavigate: (page: string) => void;
  onToggleChatbot?: () => void;
}

interface Department {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

interface Complaint {
  id: string;
  complaintId: string;
  department: string;
  subject: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  date: string;
  response?: string;
  timeline: Array<{
    status: string;
    date: string;
    description: string;
  }>;
}

export function Complaints({ onNavigate, onToggleChatbot }: ComplaintsProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const departments: Department[] = [
    { id: 'revenue', name: 'Revenue', icon: Building2, color: 'from-blue-500 to-blue-600' },
    { id: 'health', name: 'Health', icon: Heart, color: 'from-red-500 to-pink-600' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'from-purple-500 to-purple-600' },
    { id: 'water', name: 'Water Supply', icon: Droplet, color: 'from-cyan-500 to-blue-600' },
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'from-yellow-500 to-orange-600' },
    { id: 'transport', name: 'Transport', icon: Bus, color: 'from-green-500 to-emerald-600' },
    { id: 'police', name: 'Police', icon: Shield, color: 'from-indigo-500 to-indigo-600' },
    { id: 'municipal', name: 'Municipal', icon: Home, color: 'from-teal-500 to-teal-600' },
    { id: 'general', name: 'General', icon: MessageCircle, color: 'from-gray-500 to-gray-600' },
  ];

  const mockComplaints: Complaint[] = [
    {
      id: '1',
      complaintId: '#C12345',
      department: 'Water Supply',
      subject: 'Low water pressure in residential area',
      description: 'The water pressure in our area has been very low for the past week. This is affecting daily activities and causing inconvenience to all residents.',
      status: 'In Progress',
      date: '2025-10-28',
      response: 'Our team has inspected the area and identified the issue. We are working on fixing the main pipeline. Expected resolution in 2-3 days.',
      timeline: [
        { status: 'Submitted', date: '2025-10-28', description: 'Complaint filed by citizen' },
        { status: 'Acknowledged', date: '2025-10-29', description: 'Complaint acknowledged by department' },
        { status: 'In Progress', date: '2025-10-30', description: 'Team assigned and inspection completed' },
      ],
    },
    {
      id: '2',
      complaintId: '#C12344',
      department: 'Health',
      subject: 'Sanitation issue in public hospital',
      description: 'The public hospital toilets are not properly maintained. Need immediate attention for cleanliness.',
      status: 'Resolved',
      date: '2025-10-20',
      response: 'The issue has been resolved. Additional cleaning staff has been assigned and a strict maintenance schedule has been implemented.',
      timeline: [
        { status: 'Submitted', date: '2025-10-20', description: 'Complaint filed by citizen' },
        { status: 'Acknowledged', date: '2025-10-20', description: 'Complaint acknowledged by department' },
        { status: 'In Progress', date: '2025-10-21', description: 'Cleaning staff assigned' },
        { status: 'Resolved', date: '2025-10-22', description: 'Issue resolved and verified' },
      ],
    },
    {
      id: '3',
      complaintId: '#C12343',
      department: 'Electricity',
      subject: 'Frequent power cuts in the evening',
      description: 'There are frequent power cuts every evening between 6 PM to 9 PM. This has been happening for the last 10 days.',
      status: 'Pending',
      date: '2025-11-01',
      timeline: [
        { status: 'Submitted', date: '2025-11-01', description: 'Complaint filed by citizen' },
        { status: 'Acknowledged', date: '2025-11-02', description: 'Complaint acknowledged by department' },
      ],
    },
    {
      id: '4',
      complaintId: '#C12342',
      department: 'Transport',
      subject: 'Bus stop sign damaged',
      description: 'The bus stop sign near City Center is damaged and needs replacement.',
      status: 'In Progress',
      date: '2025-10-25',
      response: 'New sign has been ordered and will be installed within this week.',
      timeline: [
        { status: 'Submitted', date: '2025-10-25', description: 'Complaint filed by citizen' },
        { status: 'Acknowledged', date: '2025-10-25', description: 'Complaint acknowledged by department' },
        { status: 'In Progress', date: '2025-10-26', description: 'Work order issued' },
      ],
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pending':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dotColor: 'bg-yellow-500' };
      case 'In Progress':
        return { icon: AlertCircle, color: 'bg-blue-100 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' };
      case 'Resolved':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', dotColor: 'bg-green-500' };
      case 'Rejected':
        return { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500' };
      default:
        return { icon: Clock, color: 'bg-gray-100 text-gray-700 border-gray-200', dotColor: 'bg-gray-500' };
    }
  };

  const handleSubmit = () => {
    // Handle complaint submission
    setSelectedDepartment(null);
    setSubject('');
    setDescription('');
    setAttachedFiles([]);
  };

  const handleCancel = () => {
    setSelectedDepartment(null);
    setSubject('');
    setDescription('');
    setAttachedFiles([]);
  };

  const filteredComplaints = mockComplaints.filter((complaint) => {
    if (activeTab === 'all') return true;
    return complaint.status.toLowerCase().replace(' ', '-') === activeTab;
  });

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
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {onToggleChatbot && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-white/50"
                  onClick={onToggleChatbot}
                >
                  <MessageSquareText className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </div>
          <h1 className="gradient-text text-4xl">File a Complaint</h1>
          <p className="text-gray-600 mt-2">Select a department and submit your complaint</p>
        </motion.div>

        {/* Department Selection Grid */}
        <AnimatePresence mode="wait">
          {!selectedDepartment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <h2 className="text-2xl mb-6">Select Department</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {departments.map((dept, index) => (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all hover:shadow-xl bg-white/80 backdrop-blur-sm group"
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <dept.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg">{dept.name}</h3>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complaint Form Section */}
        <AnimatePresence mode="wait">
          {selectedDepartment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedDepartment.color} flex items-center justify-center`}>
                      <selectedDepartment.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{selectedDepartment.name} Department</CardTitle>
                      <CardDescription>Fill in the details below to file your complaint</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your complaint"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-white/50 border-gray-200/50 focus:bg-white"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">Complaint Description</Label>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-blue-50"
                      >
                        <Mic className="w-4 h-4 text-blue-600" />
                      </Button>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Describe your complaint in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="bg-white/50 border-gray-200/50 focus:bg-white resize-none"
                    />
                  </div>

                  {/* Document Links */}
                  <div className="space-y-2">
                    <Label htmlFor="doc-links">Attach Document Links (Optional)</Label>
                    <p className="text-xs text-gray-500">Upload your supporting documents to Google Drive and paste the shareable links below (one per line)</p>
                    <Textarea
                      id="doc-links"
                      placeholder="https://drive.google.com/file/d/...&#10;https://drive.google.com/file/d/..."
                      rows={4}
                      className="resize-none bg-white/50 border-gray-200/50 focus:bg-white"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    >
                      Submit Complaint
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Your Complaints Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: selectedDepartment ? 0 : 0.3 }}
        >
          <h2 className="text-2xl mb-6">Your Complaints</h2>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Filter Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>

                {/* Complaints List */}
                <div className="space-y-4">
                  {filteredComplaints.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No complaints found</p>
                    </div>
                  ) : (
                    filteredComplaints.map((complaint, index) => {
                      const statusConfig = getStatusConfig(complaint.status);
                      const isExpanded = expandedComplaint === complaint.id;

                      return (
                        <motion.div
                          key={complaint.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              {/* Header */}
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-blue-600">{complaint.complaintId}</span>
                                <Badge className={`${getStatusConfig(complaint.status).color} border`}>
                                  {complaint.department}
                                </Badge>
                                <Badge className={`${statusConfig.color} border`}>
                                  <statusConfig.icon className="w-3 h-3 mr-1" />
                                  {complaint.status}
                                </Badge>
                              </div>

                              {/* Subject */}
                              <h3 className="text-lg">{complaint.subject}</h3>

                              {/* Description (truncated if not expanded) */}
                              <p className={`text-sm text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                                {complaint.description}
                              </p>

                              {/* Date */}
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Submitted on {new Date(complaint.date).toLocaleDateString('en-IN', { 
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}</span>
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

                                    {/* Response */}
                                    {complaint.response && (
                                      <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="text-sm mb-2 text-blue-900">Official Response</h4>
                                        <p className="text-sm text-blue-800">{complaint.response}</p>
                                      </div>
                                    )}

                                    {/* Timeline */}
                                    <div>
                                      <h4 className="text-sm mb-4 text-gray-700">Status Timeline</h4>
                                      <div className="space-y-4">
                                        {complaint.timeline.map((item, idx) => (
                                          <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                              <div className={`w-3 h-3 rounded-full ${getStatusConfig(item.status).dotColor}`} />
                                              {idx < complaint.timeline.length - 1 && (
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
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* View Details Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedComplaint(isExpanded ? null : complaint.id)}
                              className="flex-shrink-0"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {isExpanded ? 'Hide' : 'View Details'}
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
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
