import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, GraduationCap, IndianRupee, ChevronDown, ChevronUp, Upload, FileText, MessageSquareText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner@2.0.3';
import { submitScholarshipApplication, getUserScholarshipApplications } from '../firebase';

interface EducationAssistanceProps {
  userName?: string;
  onNavigate?: (page: string) => void;
  onToggleChatbot?: () => void;
}

interface Scholarship {
  id: number;
  name: string;
  category: 'Merit-Based' | 'Need-Based' | 'Mixed';
  description: string;
  amount: string;
  eligibility: {
    minGrade: string;
    maxIncome: string;
    eligibleCourses: string[];
  };
  status?: string;
}

export function EducationAssistance({ userName = 'Rajesh Kumar', onNavigate, onToggleChatbot }: EducationAssistanceProps) {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [applicationFilter, setApplicationFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const scholarships: Scholarship[] = [
    {
      id: 1,
      name: 'National Merit Scholarship',
      category: 'Merit-Based',
      description: 'Awarded to students with exceptional academic performance and achievements in their field of study.',
      amount: '₹50,000',
      eligibility: {
        minGrade: '85% or above',
        maxIncome: 'No limit',
        eligibleCourses: ['Engineering', 'Medical', 'Arts', 'Commerce', 'Science'],
      },
    },
    {
      id: 2,
      name: 'Economic Support Program',
      category: 'Need-Based',
      description: 'Financial assistance for students from economically disadvantaged backgrounds to pursue higher education.',
      amount: '₹75,000',
      eligibility: {
        minGrade: '60% or above',
        maxIncome: '₹3,00,000 per annum',
        eligibleCourses: ['All undergraduate courses'],
      },
    },
    {
      id: 3,
      name: 'SC/ST Scholarship Scheme',
      category: 'Mixed',
      description: 'Special scholarship program for SC/ST students combining merit and need-based criteria.',
      amount: '₹1,00,000',
      eligibility: {
        minGrade: '70% or above',
        maxIncome: '₹2,50,000 per annum',
        eligibleCourses: ['Engineering', 'Medical', 'MBA', 'Law'],
      },
    },
    {
      id: 4,
      name: 'Girls Education Scholarship',
      category: 'Merit-Based',
      description: 'Empowering female students to pursue STEM education with financial support and mentorship.',
      amount: '₹60,000',
      eligibility: {
        minGrade: '75% or above',
        maxIncome: '₹5,00,000 per annum',
        eligibleCourses: ['Engineering', 'Science', 'Technology', 'Mathematics'],
      },
    },
    {
      id: 5,
      name: 'OBC Welfare Scholarship',
      category: 'Need-Based',
      description: 'Supporting OBC students in their educational journey with financial assistance.',
      amount: '₹40,000',
      eligibility: {
        minGrade: '65% or above',
        maxIncome: '₹4,00,000 per annum',
        eligibleCourses: ['All courses'],
      },
    },
    {
      id: 6,
      name: 'Post Graduate Research Grant',
      category: 'Merit-Based',
      description: 'Funding for post-graduate students pursuing research in cutting-edge fields.',
      amount: '₹1,50,000',
      eligibility: {
        minGrade: '80% or above',
        maxIncome: 'No limit',
        eligibleCourses: ['Masters', 'PhD', 'Research Programs'],
      },
    },
  ];

  // Fetch user's scholarship applications on mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const result = await getUserScholarshipApplications();
      if (result.success) {
        setMyApplications(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching scholarship applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Merit-Based':
        return 'bg-blue-100 text-blue-800';
      case 'Need-Based':
        return 'bg-green-100 text-green-800';
      case 'Mixed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApply = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScholarship) return;

    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);

    const applicationData = {
      scholarshipId: selectedScholarship.id,
      scholarshipName: selectedScholarship.name,
      scholarshipType: selectedScholarship.category,
      studentName: formData.get('student-name') as string,
      studentEmail: formData.get('student-email') as string,
      studentPhone: formData.get('student-phone') as string,
      dateOfBirth: formData.get('student-dob') as string,
      class: formData.get('class-year') as string,
      school: formData.get('institution') as string,
      academicPercentage: formData.get('percentage') as string,
      course: formData.get('course') as string,
      familyIncome: formData.get('family-income') as string,
      category: formData.get('category') as string,
      documents: {
        marksheetLink: formData.get('marksheets') as string,
        incomeLink: formData.get('income-cert') as string,
        bonafideLink: formData.get('category-cert') as string || '',
      },
      statementOfPurpose: formData.get('sop') as string,
    };

    try {
      const result = await submitScholarshipApplication(applicationData);
      if (result.success) {
        toast.success('Scholarship application submitted successfully!');
        setShowApplicationModal(false);
        setSelectedScholarship(null);
        await fetchApplications(); // Refresh applications
      } else {
        toast.error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the application');
      console.error('Error submitting scholarship application:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApplications = myApplications.filter((app) => {
    if (applicationFilter === 'all') return true;
    return app.status.toLowerCase() === applicationFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onNavigate && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h1 className="text-gray-900">🎓 Education Assistance</h1>
                <p className="text-sm text-gray-600">Scholarship Applications & Support</p>
              </div>
            </div>
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Available Scholarships Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-gray-900 mb-6">Available Scholarships</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-gray-900 flex-1">{scholarship.name}</CardTitle>
                      <Badge className={getCategoryColor(scholarship.category)}>
                        {scholarship.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{scholarship.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Scholarship Amount</p>
                          <p className="text-2xl text-green-600">{scholarship.amount}</p>
                        </div>
                      </div>

                      {/* Eligibility Criteria - Collapsible */}
                      <Collapsible
                        open={expandedCard === scholarship.id}
                        onOpenChange={() =>
                          setExpandedCard(expandedCard === scholarship.id ? null : scholarship.id)
                        }
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between p-0 hover:bg-transparent"
                          >
                            <span className="text-sm text-gray-700">Eligibility Criteria</span>
                            {expandedCard === scholarship.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 space-y-2">
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div>
                              <p className="text-xs text-gray-600">Minimum Grade</p>
                              <p className="text-sm text-gray-900">{scholarship.eligibility.minGrade}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Maximum Family Income</p>
                              <p className="text-sm text-gray-900">{scholarship.eligibility.maxIncome}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Eligible Courses</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {scholarship.eligibility.eligibleCourses.map((course, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {course}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    <Button
                      onClick={() => handleApply(scholarship)}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* My Applications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={applicationFilter} onValueChange={(v) => setApplicationFilter(v as any)}>
                <TabsList className="w-full grid grid-cols-4 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                      <Card key={application.id} className="border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-gray-900">{application.scholarshipName}</h3>
                                <Badge className={getStatusColor(application.status)}>
                                  {application.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">Applied on {application.appliedOn}</p>
                            </div>
                            <Button variant="outline">View Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No applications found</p>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Scholarship Application Form Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Apply for {selectedScholarship?.name}
            </DialogTitle>
            <DialogDescription>
              Complete the application form below. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitApplication} className="space-y-6 mt-4">
            {/* Student Details */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Student Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name *</Label>
                  <Input id="student-name" defaultValue={userName} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email Address *</Label>
                  <Input id="student-email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-phone">Phone Number *</Label>
                  <Input id="student-phone" type="tel" placeholder="+91 98765 43210" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-dob">Date of Birth *</Label>
                  <Input id="student-dob" type="date" required />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class-year">Current Class/Year *</Label>
                  <select
                    id="class-year"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select class/year...</option>
                    <option value="10">Class 10</option>
                    <option value="12">Class 12</option>
                    <option value="ug1">UG - 1st Year</option>
                    <option value="ug2">UG - 2nd Year</option>
                    <option value="ug3">UG - 3rd Year</option>
                    <option value="ug4">UG - 4th Year</option>
                    <option value="pg1">PG - 1st Year</option>
                    <option value="pg2">PG - 2nd Year</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Name *</Label>
                  <Input id="institution" placeholder="Enter institution name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage/CGPA *</Label>
                  <Input id="percentage" placeholder="e.g., 85% or 8.5 CGPA" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course Pursuing *</Label>
                  <Input id="course" placeholder="e.g., B.Tech Computer Science" required />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="family-income">Family Annual Income *</Label>
                  <Input
                    id="family-income"
                    placeholder="e.g., ₹3,00,000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="ews">EWS</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document Links */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Document Links (Google Drive)</h3>
              <p className="text-sm text-gray-600">Upload your documents to Google Drive and paste the shareable links below</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="marksheets">Mark Sheets Link *</Label>
                  <Input
                    id="marksheets"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                  <p className="text-xs text-gray-500">Paste Google Drive shareable link for latest marksheet</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income-cert">Income Certificate Link *</Label>
                  <Input
                    id="income-cert"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                  <p className="text-xs text-gray-500">Paste Google Drive shareable link for income certificate</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-cert">Category Certificate Link (if applicable)</Label>
                  <Input
                    id="category-cert"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <p className="text-xs text-gray-500">Paste Google Drive shareable link for caste/category certificate (Optional)</p>
                </div>
              </div>
            </div>

            {/* Statement of Purpose */}
            <div className="space-y-2">
              <Label htmlFor="sop">Statement of Purpose *</Label>
              <Textarea
                id="sop"
                rows={6}
                placeholder="Explain why you're applying for this scholarship, your educational goals, and how this scholarship will help you achieve them..."
                required
              />
              <p className="text-xs text-gray-500">Minimum 200 words</p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowApplicationModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
