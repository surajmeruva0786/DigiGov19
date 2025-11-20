import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

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
  const [documentLinks, setDocumentLinks] = useState('');
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const { getComplaints } = await import('../firebase');
      const result = await getComplaints();

      if (result.success) {
        // Transform Firestore data to match component interface
        const transformedComplaints = result.data.map((complaint: any) => ({
          id: complaint.id,
          complaintId: `#C${complaint.id.slice(-5)}`,
          department: complaint.department,
          subject: complaint.subject,
          description: complaint.description,
          status: complaint.status,
          date: complaint.createdAt?.toDate?.()?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          response: complaint.response,
          timeline: complaint.timeline || [
            {
              status: 'Submitted',
              date: complaint.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString(),
              description: 'Complaint filed by citizen'
            }
          ],
        }));
        setComplaints(transformedComplaints);
      } else {
        toast.error('Failed to load complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Error loading complaints');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!selectedDepartment || !subject || !description) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { submitComplaint } = await import('../firebase');

      const complaintData = {
        department: selectedDepartment.name,
        subject,
        description,
        documentLinks: documentLinks.split('\n').filter(link => link.trim()),
        priority: 'Medium',
      };

      const result = await submitComplaint(complaintData);

      if (result.success) {
        toast.success('Complaint submitted successfully!');
        setSelectedDepartment(null);
        setSubject('');
        setDescription('');
        setDocumentLinks('');
        // Refresh complaints list
        fetchComplaints();
      } else {
        toast.error(result.message || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Error submitting complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedDepartment(null);
    setSubject('');
    setDescription('');
    setDocumentLinks('');
  };

  const filteredComplaints = complaints.filter((complaint) => {
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
                      value={documentLinks}
                      onChange={(e) => setDocumentLinks(e.target.value)}
                      rows={4}
                      className="resize-none bg-white/50 border-gray-200/50 focus:bg-white"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Complaint'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
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
                  {isLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                      <p className="text-gray-500">Loading complaints...</p>
                    </div>
                  ) : filteredComplaints.length === 0 ? (
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
