import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Mic,
  ChevronDown,
  ChevronUp,
  MapPin,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Send,
  Upload,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';
import { allGovernmentSchemes, indianStates } from '../data/schemes';
import { submitSchemeApplication, getUserSchemeApplications } from '../firebase';

interface GovernmentSchemesProps {
  onNavigate: (page: string) => void;
  onToggleChatbot?: () => void;
}

interface Scheme {
  id: string;
  name: string;
  type: 'Healthcare' | 'Education' | 'Financial';
  description: string;
  benefits: string[];
  eligibility: string[];
  status?: 'Applied' | 'Pending' | 'Approved' | 'Rejected';
  state: string;
}

export function GovernmentSchemes({ onNavigate, onToggleChatbot }: GovernmentSchemesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedSchemes, setExpandedSchemes] = useState<Set<string>>(new Set());
  const [complaint, setComplaint] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const schemes: Scheme[] = allGovernmentSchemes;

  // Fetch user's scheme applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const result = await getUserSchemeApplications();
        if (result.success) {
          setUserApplications(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const toggleExpanded = (schemeId: string) => {
    const newExpanded = new Set(expandedSchemes);
    if (newExpanded.has(schemeId)) {
      newExpanded.delete(schemeId);
    } else {
      newExpanded.add(schemeId);
    }
    setExpandedSchemes(newExpanded);
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'Applied':
        return { icon: Clock, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Applied' };
      case 'Pending':
        return { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Pending' };
      case 'Approved':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', label: 'Approved' };
      case 'Rejected':
        return { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' };
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Healthcare':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'Education':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Financial':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'all' || scheme.state === stateFilter || scheme.state === 'All India';
    return matchesSearch && matchesState;
  });

  const displayState = stateFilter === 'all' ? 'All India' : stateFilter;

  const handleSubmitComplaint = () => {
    if (complaint.trim()) {
      // Handle complaint submission
      setComplaint('');
    }
  };

  const handleApply = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheme) return;

    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);

    const applicationData = {
      schemeId: selectedScheme.id,
      schemeName: selectedScheme.name,
      schemeType: selectedScheme.type,
      applicantDetails: {
        fullName: formData.get('full-name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        dob: formData.get('dob') as string,
        gender: formData.get('gender') as string,
        aadhaar: formData.get('aadhaar') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        pincode: formData.get('pincode') as string,
      },
      financialInfo: selectedScheme.type === 'Financial' || selectedScheme.type === 'Education' ? {
        familyIncome: formData.get('family-income') as string,
        category: formData.get('category') as string,
        bankAccount: formData.get('bank-account') as string,
        ifsc: formData.get('ifsc') as string,
      } : {},
      educationalInfo: selectedScheme.type === 'Education' ? {
        institution: formData.get('institution') as string,
        course: formData.get('course') as string,
        year: formData.get('year') as string,
        percentage: formData.get('percentage') as string,
      } : {},
      documents: {
        aadhaarLink: formData.get('aadhaar-link') as string,
        incomeLink: formData.get('income-link') as string,
        addressLink: formData.get('address-link') as string || '',
      },
      reason: formData.get('reason') as string,
    };

    try {
      const result = await submitSchemeApplication(applicationData);
      if (result.success) {
        toast.success('Scheme application submitted successfully!');
        setShowApplicationModal(false);
        setSelectedScheme(null);
        // Refresh applications list
        const updatedApps = await getUserSchemeApplications();
        if (updatedApps.success) {
          setUserApplications(updatedApps.data || []);
        }
      } else {
        toast.error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the application');
      console.error('Error submitting application:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{displayState}</span>
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
          <h1 className="gradient-text text-4xl">Government Schemes</h1>
          <p className="text-gray-600 mt-2">Browse and apply for government schemes</p>
        </motion.div>

        {/* Search and Filters Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search schemes by name or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-12 h-12 bg-white/50 border-gray-200/50 focus:bg-white"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Mic className="w-5 h-5 text-blue-600" />
                  </Button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger className="bg-white/50">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Schemes Grid */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme, index) => {
              const statusConfig = getStatusConfig(scheme.status);
              const isExpanded = expandedSchemes.has(scheme.id);

              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-full hover:shadow-2xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <CardTitle className="text-xl flex-1">{scheme.name}</CardTitle>
                        <Badge className={`${getTypeColor(scheme.type)} text-white border-0 shadow-lg`}>
                          {scheme.type}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-3">
                        {scheme.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Benefits List */}
                      <div>
                        <h4 className="text-sm mb-2 text-gray-700">Benefits:</h4>
                        <ul className="space-y-1">
                          {scheme.benefits.slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expandable Eligibility Section */}
                      <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(scheme.id)}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between hover:bg-white/50 p-3"
                          >
                            <span className="text-sm">Eligibility Criteria</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <div className="p-3 glass-card rounded-xl">
                            <ul className="space-y-1">
                              {scheme.eligibility.map((criteria, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                                  <span>{criteria}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Footer - Status or Apply Button */}
                      <div className="pt-4 border-t">
                        {statusConfig ? (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${statusConfig.color}`}>
                            <statusConfig.icon className="w-5 h-5" />
                            <span>Status: {statusConfig.label}</span>
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                            onClick={() => handleApply(scheme)}
                          >
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Complaint Section - Sticky Bottom */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-white via-white to-transparent"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                Quick Complaint
              </CardTitle>
              <CardDescription>
                Have an issue? Submit a quick complaint here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Textarea
                    placeholder="Describe your complaint..."
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    className="resize-none bg-white/50 border-gray-200/50 focus:bg-white min-h-[60px]"
                    rows={2}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 bottom-2"
                  >
                    <Mic className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>
                <Button
                  onClick={handleSubmitComplaint}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg self-end"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Scheme Application Form Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Apply for {selectedScheme?.name}
            </DialogTitle>
            <DialogDescription>
              Complete the application form below. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitApplication} className="space-y-6 mt-4">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name *</Label>
                  <Input id="full-name" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input id="dob" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select required>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                  <Input id="aadhaar" placeholder="XXXX XXXX XXXX" required />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea id="address" placeholder="Enter your complete address" required rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" placeholder="Enter city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select required>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input id="pincode" placeholder="400001" required />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            {(selectedScheme?.type === 'Financial' || selectedScheme?.type === 'Education') && (
              <div className="space-y-4">
                <h3 className="text-gray-900">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="family-income">Annual Family Income *</Label>
                    <Input id="family-income" placeholder="₹3,00,000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="obc">OBC</SelectItem>
                        <SelectItem value="sc">SC</SelectItem>
                        <SelectItem value="st">ST</SelectItem>
                        <SelectItem value="ews">EWS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-account">Bank Account Number *</Label>
                    <Input id="bank-account" placeholder="Enter account number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code *</Label>
                    <Input id="ifsc" placeholder="Enter IFSC code" required />
                  </div>
                </div>
              </div>
            )}

            {/* Educational Details (for Education schemes) */}
            {selectedScheme?.type === 'Education' && (
              <div className="space-y-4">
                <h3 className="text-gray-900">Educational Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution Name *</Label>
                    <Input id="institution" placeholder="Enter institution name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course Pursuing *</Label>
                    <Input id="course" placeholder="e.g., B.Tech Computer Science" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Current Year *</Label>
                    <Select required>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage">Percentage/CGPA *</Label>
                    <Input id="percentage" placeholder="85% or 8.5 CGPA" required />
                  </div>
                </div>
              </div>
            )}

            {/* Document Links */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Required Documents (Google Drive Links)</h3>
              <p className="text-sm text-gray-600">Upload your documents to Google Drive and paste the shareable links below</p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar-link">Aadhaar Card Link *</Label>
                  <Input
                    id="aadhaar-link"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                  <p className="text-xs text-gray-500">Paste Google Drive shareable link for Aadhaar Card</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income-link">Income Certificate Link *</Label>
                  <Input
                    id="income-link"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                  <p className="text-xs text-gray-500">Paste Google Drive shareable link for Income Certificate</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address-link">Address Proof Link</Label>
                  <Input
                    id="address-link"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <p className="text-xs text-gray-500">Paste Google Drive shareable link for Address Proof (Optional)</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="reason">Why do you need this scheme? *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain your need for this scheme..."
                  required
                  rows={4}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <input type="checkbox" id="terms" required className="mt-1" />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                I hereby declare that the information provided above is true and correct to the best of my knowledge.
                I understand that any false information may lead to rejection of my application.
              </Label>
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
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
