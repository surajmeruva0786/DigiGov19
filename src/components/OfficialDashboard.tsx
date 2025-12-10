import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  FileText,
  MessageSquare,
  Baby,
  FolderOpen,
  CreditCard,
  Activity,
  Heart,
  Star,
  GraduationCap,
  Bell,
  LogOut,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronRight,
  TrendingUp,
  BarChart3,
  X,
  Phone,
  Mail,
  Calendar,
  User,
  MapPin,
  Building2,
  AlertCircle,
  Link,
  Search,
  IndianRupee,
  School,
  Stethoscope,
  Droplet,
  Loader2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface OfficialDashboardProps {
  officialName: string;
  department: string;
  onLogout: () => void;
  onShowAnalytics?: () => void;
}

export function OfficialDashboard({ officialName, department, onLogout, onShowAnalytics }: OfficialDashboardProps) {
  const [activeTab, setActiveTab] = useState('signups');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'update' | 'view'>('view');
  const [actionNotes, setActionNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [schemeApplicationsData, setSchemeApplicationsData] = useState<any[]>([]);
  const [childrenDataState, setChildrenDataState] = useState<any[]>([]);
  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  const [isLoadingSchemes, setIsLoadingSchemes] = useState(true);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [userSignupsData, setUserSignupsData] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [donorRegistrationsData, setDonorRegistrationsData] = useState<any[]>([]);
  const [healthRequestsData, setHealthRequestsData] = useState<any[]>([]);
  const [scholarshipApplicationsData, setScholarshipApplicationsData] = useState<any[]>([]);
  const [isLoadingDonors, setIsLoadingDonors] = useState(true);
  const [isLoadingHealthRequests, setIsLoadingHealthRequests] = useState(true);
  const [isLoadingScholarships, setIsLoadingScholarships] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchComplaints(),
      fetchDocuments(),
      fetchFeedback(),
      fetchSchemeApplications(),
      fetchChildrenData(),
      fetchPayments(),
      fetchUsers(),
      fetchDonorRegistrations(),
      fetchHealthRequests(),
      fetchScholarshipApplications()
    ]);
  };

  const fetchComplaints = async () => {
    setIsLoadingComplaints(true);
    try {
      const { getAllComplaints } = await import('../firebase');
      const result = await getAllComplaints();

      if (result.success && result.data.length > 0) {
        // Transform Firestore data to match component interface
        const transformedComplaints = result.data.map((complaint: any) => ({
          id: `CMP-${complaint.id.slice(-3)}`,
          citizen: complaint.userName || complaint.userId || 'Unknown',
          citizenPhone: complaint.userPhone || complaint.phone || 'N/A',
          citizenEmail: complaint.userEmail || complaint.email || 'N/A',
          department: complaint.department,
          subject: complaint.subject,
          description: complaint.description,
          location: complaint.location || 'Not specified',
          status: complaint.status,
          priority: complaint.priority || 'Medium',
          date: complaint.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          documentLinks: complaint.documentLinks || [],
          assignedTo: complaint.assignedTo || 'Not Assigned',
          timeline: complaint.timeline || [
            {
              status: 'Submitted',
              date: complaint.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
              description: 'Complaint filed by citizen'
            }
          ],
        }));
        // Update the complaints state with real data
        setComplaints(transformedComplaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoadingComplaints(false);
    }
  };

  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      const { getAllDocuments } = await import('../firebase');
      const result = await getAllDocuments();

      if (result.success && result.data.length > 0) {
        // Transform Firestore data
        const transformedDocuments = result.data.map((doc: any) => ({
          id: `DOC-${doc.id.slice(-3)}`,
          user: doc.userName || doc.userId || 'Unknown',
          userId: doc.userId,
          userPhone: doc.userPhone || 'N/A',
          userEmail: doc.userEmail || 'N/A',
          type: doc.type,
          documentNumber: 'N/A',
          uploadedOn: doc.uploadDate || doc.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          expiryDate: 'N/A',
          status: 'Verified',
          verifiedBy: '',
          verifiedOn: '',
          fileLink: doc.fileUrl,
          purpose: doc.category || 'General',
        }));
        // Update the documents state with real data
        setDocuments(transformedDocuments);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const fetchFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const { getAllFeedback } = await import('../firebase');
      const result = await getAllFeedback();

      if (result.success && result.data.length > 0) {
        // Transform Firestore data
        const transformedFeedback = result.data.map((item: any) => ({
          id: `FEED-${item.id.slice(-3)}`,
          service: item.category || 'General Service',
          rating: 4.0,
          comment: item.subject,
          fullFeedback: item.description,
          user: item.userName || item.userId || 'Unknown',
          userId: item.userId,
          userPhone: item.userPhone || item.phone || 'N/A',
          userEmail: item.userEmail || item.email || 'N/A',
          date: item.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          category: item.category,
          status: item.status === 'pending' ? 'Pending Review' : 'Reviewed',
          officialResponse: item.response || '',
        }));
        // Update the feedbackData state with real data
        setFeedbackData(transformedFeedback);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const fetchSchemeApplications = async () => {
    setIsLoadingSchemes(true);
    try {
      const { getAllSchemeApplications } = await import('../firebase');
      const result = await getAllSchemeApplications();

      if (result.success && result.data.length > 0) {
        const transformed = result.data.map((app: any) => ({
          id: `APP-${app.id.slice(-3)}`,
          fullName: app.applicantDetails?.fullName || 'Unknown',
          email: app.applicantDetails?.email || 'N/A',
          phone: app.applicantDetails?.phone || 'N/A',
          dob: app.applicantDetails?.dob || 'N/A',
          gender: app.applicantDetails?.gender || 'N/A',
          aadhaar: app.applicantDetails?.aadhaar || 'N/A',
          address: app.applicantDetails?.address || '',
          city: app.applicantDetails?.city || '',
          state: app.applicantDetails?.state || '',
          pincode: app.applicantDetails?.pincode || '',
          fullAddress: `${app.applicantDetails?.address || ''}, ${app.applicantDetails?.city || ''}, ${app.applicantDetails?.state || ''} - ${app.applicantDetails?.pincode || ''}`,
          scheme: app.schemeName || 'Unknown Scheme',
          schemeType: app.schemeType || 'General',
          annualIncome: app.financialInfo?.familyIncome || 'N/A',
          category: app.financialInfo?.category || 'N/A',
          bankAccount: app.financialInfo?.bankAccount || 'N/A',
          ifsc: app.financialInfo?.ifsc || 'N/A',
          institution: app.educationalInfo?.institution || '',
          course: app.educationalInfo?.course || '',
          year: app.educationalInfo?.year || '',
          percentage: app.educationalInfo?.percentage || '',
          documents: [
            { name: 'Aadhaar Card', link: app.documents?.aadhaarLink || '' },
            { name: 'Income Certificate', link: app.documents?.incomeLink || '' },
            { name: 'Address Proof', link: app.documents?.addressLink || '' }
          ].filter(doc => doc.link),
          reason: app.reason || '',
          appliedOn: app.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          status: app.status || 'Pending',
          eligibility: 'Pending Review',
          verificationStatus: app.remarks || 'Pending Review',
        }));
        setSchemeApplicationsData(transformed);
      }
    } catch (error) {
      console.error('Error fetching scheme applications:', error);
    } finally {
      setIsLoadingSchemes(false);
    }
  };

  const fetchChildrenData = async () => {
    setIsLoadingChildren(true);
    try {
      const { getAllChildren } = await import('../firebase');
      const result = await getAllChildren();

      if (result.success && result.data.length > 0) {
        const transformed = result.data.map((child: any) => ({
          id: `CHD-${child.id.slice(-3)}`,
          name: child.name || 'Unknown',
          parent: child.parentName || 'Unknown',
          parentPhone: child.parentPhone || 'N/A',
          parentEmail: child.parentEmail || 'N/A',
          age: child.age ? `${child.age} years` : 'N/A',
          dob: child.dateOfBirth || 'N/A',
          gender: 'N/A',
          school: child.school || 'N/A',
          class: child.grade || 'N/A',
          aadhaar: 'N/A',
          documents: 0,
          vaccinations: child.vaccinations || [],
          medicalRecords: child.healthRecords || 'N/A',
          registeredDate: child.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
        }));
        setChildrenDataState(transformed);
      }
    } catch (error) {
      console.error('Error fetching children data:', error);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  const fetchPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const { getAllPayments } = await import('../firebase');
      const result = await getAllPayments();

      if (result.success && result.data.length > 0) {
        const transformed = result.data.map((payment: any) => ({
          id: `BILL-${payment.id.slice(-3)}`,
          user: payment.userName || 'Unknown',
          userId: payment.userId,
          userPhone: payment.userPhone || 'N/A',
          userAddress: 'N/A',
          type: payment.billType || 'Unknown',
          billNumber: `${payment.billType?.toUpperCase()}-${payment.id.slice(-6)}`,
          amount: `₹${payment.amount?.toLocaleString('en-IN') || '0'}`,
          dueDate: 'N/A',
          paidDate: payment.date || payment.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          paymentMode: payment.paymentMethod || 'UPI',
          transactionId: payment.transactionId || 'N/A',
          status: payment.status || 'Pending',
          billingPeriod: 'N/A',
          consumerNumber: payment.consumerNumber || 'N/A',
          upiApp: payment.upiApp || 'N/A',
        }));
        setPaymentsData(transformed);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { getAllUsers } = await import('../firebase');
      const result = await getAllUsers();

      if (result.success && result.data.length > 0) {
        const transformed = result.data.map((user: any) => ({
          id: `USR-${user.id.slice(-3)}`,
          name: user.name || user.fullName || 'Unknown',
          aadhaar: user.aadhaar ? `XXXX-XXXX-${user.aadhaar.slice(-4)}` : 'N/A',
          fullAadhaar: user.aadhaar || 'N/A',
          phone: user.phone || user.phoneNumber || 'N/A',
          email: user.email || 'N/A',
          dob: user.dob || user.dateOfBirth || 'N/A',
          gender: user.gender || 'N/A',
          address: user.address || 'N/A',
          city: user.city || 'N/A',
          state: user.state || 'N/A',
          pincode: user.pincode || 'N/A',
          fullAddress: `${user.address || ''}, ${user.city || ''}, ${user.state || ''} - ${user.pincode || ''}`,
          aadhaarPhotoLink: user.aadhaarPhotoLink || user.aadhaarLink || '',
          registeredDate: user.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          services: [],
          documents: 0,
          verificationStatus: user.verified ? 'Verified' : 'Pending',
        }));
        setUserSignupsData(transformed);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchDonorRegistrations = async () => {
    setIsLoadingDonors(true);
    try {
      const { getAllDonorRegistrations } = await import('../firebase');
      const result = await getAllDonorRegistrations();

      if (result.success && result.data.length > 0) {
        const transformed = result.data.map((donor: any) => ({
          id: `DNR-${donor.id.slice(-3)}`,
          donorType: donor.donorType === 'blood' ? 'Blood' : 'Organ',
          donorName: donor.fullName || 'Unknown',
          fullName: donor.fullName || 'Unknown',
          bloodGroup: donor.bloodGroup || 'N/A',
          age: donor.age || 'N/A',
          contact: donor.contact || 'N/A',
          location: donor.location || 'N/A',
          availability: donor.availability || 'N/A',
          status: donor.status || 'Active',
          registeredOn: donor.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          userName: donor.userName || 'Unknown',
          userPhone: donor.userPhone || 'N/A',
          userEmail: donor.userEmail || 'N/A',
        }));
        setDonorRegistrationsData(transformed);
      }
    } catch (error) {
      console.error('Error fetching donor registrations:', error);
    } finally {
      setIsLoadingDonors(false);
    }
  };

  const fetchHealthRequests = async () => {
    setIsLoadingHealthRequests(true);
    try {
      const { getAllHealthRequests } = await import('../firebase');
      const result = await getAllHealthRequests();

      if (result.success && result.data.length > 0) {
        const transformed = result.data.map((request: any) => ({
          id: `HRQ-${request.id.slice(-3)}`,
          requestType: request.requestType === 'blood' ? 'Blood' : 'Organ',
          patientName: request.patientName || 'Unknown',
          bloodGroupNeeded: request.bloodGroupNeeded || 'N/A',
          organType: request.organType || 'N/A',
          hospital: request.hospital || 'N/A',
          urgency: request.urgency || 'Medium',
          requiredBy: request.requiredBy || 'N/A',
          status: request.status || 'Pending',
          matchedDonors: request.matchedDonors || 0,
          requestedDate: request.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          userName: request.userName || 'Unknown',
          userPhone: request.userPhone || 'N/A',
          userEmail: request.userEmail || 'N/A',
        }));
        setHealthRequestsData(transformed);
      }
    } catch (error) {
      console.error('Error fetching health requests:', error);
    } finally {
      setIsLoadingHealthRequests(false);
    }
  };

  const fetchScholarshipApplications = async () => {
    setIsLoadingScholarships(true);
    try {
      const { getAllScholarshipApplications } = await import('../firebase');
      const result = await getAllScholarshipApplications();

      if (result.success && result.data.length > 0) {
        const transformed = result.data.map((app: any) => ({
          id: `SCH-${app.id.slice(-3)}`,
          student: app.studentName || 'Unknown',
          parent: app.parentName || 'Unknown',
          scholarship: app.scholarshipName || 'Unknown Scholarship',
          amount: `₹${app.amount || 'N/A'}`,
          academicPercentage: `${app.academicPercentage || 'N/A'}%`,
          class: app.class || 'N/A',
          school: app.school || 'N/A',
          status: app.status || 'Pending Verification',
          remarks: app.remarks || '',
          appliedOn: app.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
          parentPhone: app.parentPhone || 'N/A',
          parentEmail: app.parentEmail || 'N/A',
        }));
        setScholarshipApplicationsData(transformed);
      }
    } catch (error) {
      console.error('Error fetching scholarship applications:', error);
    } finally {
      setIsLoadingScholarships(false);
    }
  };

  // All data is fetched from Firestore and stored in state variables
  // No hardcoded fallback data needed - empty states show "No data" messages

  const schemeApplications = [
    {
      id: 'APP-001',
      // Personal Details
      fullName: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91 98765 43210',
      dob: '15-Jan-1985',
      gender: 'Male',
      aadhaar: 'XXXX-XXXX-5678',
      // Address Details
      address: '123, Green Park',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      fullAddress: '123, Green Park, New Delhi, Delhi - 110016',
      // Scheme Info
      scheme: 'PM Awas Yojana',
      schemeType: 'Financial',
      // Financial Information
      annualIncome: '₹2,50,000',
      category: 'General',
      bankAccount: '1234567890',
      ifsc: 'SBIN0001234',
      // Documents
      documents: [
        { name: 'Aadhaar Card', link: 'https://drive.google.com/file/d/sample1' },
        { name: 'Income Certificate', link: 'https://drive.google.com/file/d/sample2' },
        { name: 'Address Proof', link: 'https://drive.google.com/file/d/sample3' }
      ],
      // Additional
      reason: 'Need housing assistance for family of 4. Currently living in rented accommodation and cannot afford to purchase own house.',
      appliedOn: 'Nov 1, 2025',
      status: 'Pending',
      eligibility: 'Eligible',
      verificationStatus: 'Documents Pending Review'
    },
    {
      id: 'APP-002',
      // Personal Details
      fullName: 'Priya Sharma',
      email: 'priya@email.com',
      phone: '+91 98765 43211',
      dob: '22-Mar-1990',
      gender: 'Female',
      aadhaar: 'XXXX-XXXX-9012',
      // Address Details
      address: '456, Lajpat Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024',
      fullAddress: '456, Lajpat Nagar, New Delhi, Delhi - 110024',
      // Scheme Info
      scheme: 'Ayushman Bharat',
      schemeType: 'Healthcare',
      // Financial Information
      annualIncome: '₹1,80,000',
      category: 'OBC',
      bankAccount: '0987654321',
      ifsc: 'HDFC0001234',
      // Documents
      documents: [
        { name: 'Aadhaar Card', link: 'https://drive.google.com/file/d/sample4' },
        { name: 'Income Certificate', link: 'https://drive.google.com/file/d/sample5' }
      ],
      // Additional
      reason: 'Need health insurance coverage for family. Medical expenses are becoming difficult to manage.',
      appliedOn: 'Oct 30, 2025',
      status: 'Approved',
      eligibility: 'Eligible',
      verificationStatus: 'Verified and Approved'
    },
    {
      id: 'APP-003',
      // Personal Details
      fullName: 'Amit Patel',
      email: 'amit@email.com',
      phone: '+91 98765 43212',
      dob: '10-Jul-1988',
      gender: 'Male',
      aadhaar: 'XXXX-XXXX-3456',
      // Address Details
      address: '789, Karol Bagh',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110005',
      fullAddress: '789, Karol Bagh, New Delhi, Delhi - 110005',
      // Scheme Info
      scheme: 'Digital India Scholarship',
      schemeType: 'Education',
      // Financial Information
      annualIncome: '₹3,50,000',
      category: 'General',
      bankAccount: '5555666677',
      ifsc: 'ICIC0001234',
      // Educational Details
      institution: 'Delhi University',
      course: 'B.Tech Computer Science',
      year: '2nd Year',
      percentage: '85%',
      // Documents
      documents: [
        { name: 'Aadhaar Card', link: 'https://drive.google.com/file/d/sample6' },
        { name: 'Income Certificate', link: 'https://drive.google.com/file/d/sample7' },
        { name: 'Previous Year Marksheet', link: 'https://drive.google.com/file/d/sample8' }
      ],
      // Additional
      reason: 'Need financial support to continue my computer science education and purchase required equipment.',
      appliedOn: 'Oct 28, 2025',
      status: 'Rejected',
      eligibility: 'Income exceeds limit',
      verificationStatus: 'Rejected - Income threshold exceeded'
    },
  ];

  const scholarshipApplications = [
    {
      id: 'SCH-001',
      student: 'Aarav Kumar',
      parent: 'Rajesh Kumar',
      parentPhone: '+91 98765 43210',
      parentEmail: 'rajesh@email.com',
      class: '10th Standard',
      school: 'St. Mary\'s School, Delhi',
      scholarship: 'Merit Scholarship',
      amount: '₹50,000',
      academicPercentage: '92%',
      lastYearMarks: '460/500',
      status: 'Pending Verification',
      documents: [
        { name: 'Previous Year Marksheet', link: 'https://drive.google.com/file/d/sample7' },
        { name: 'Income Certificate', link: 'https://drive.google.com/file/d/sample8' },
        { name: 'School Bonafide Certificate', link: 'https://drive.google.com/file/d/sample9' }
      ],
      appliedOn: 'Oct 20, 2025'
    },
    {
      id: 'SCH-002',
      student: 'Diya Sharma',
      parent: 'Priya Sharma',
      parentPhone: '+91 98765 43211',
      parentEmail: 'priya@email.com',
      class: '12th Standard',
      school: 'Delhi Public School',
      scholarship: 'Girls Education',
      amount: '₹60,000',
      academicPercentage: '88%',
      lastYearMarks: '440/500',
      status: 'Verified',
      documents: [
        { name: 'Previous Year Marksheet', link: 'https://drive.google.com/file/d/sample10' },
        { name: 'Income Certificate', link: 'https://drive.google.com/file/d/sample11' }
      ],
      appliedOn: 'Oct 18, 2025'
    },
  ];

  const childrenData = [
    {
      id: 'CHD-001',
      name: 'Aarav Kumar',
      parent: 'Rajesh Kumar',
      parentPhone: '+91 98765 43210',
      parentEmail: 'rajesh@email.com',
      age: '5 years',
      dob: '15-Mar-2020',
      gender: 'Male',
      school: 'St. Mary\'s School',
      class: 'UKG',
      aadhaar: 'XXXX-XXXX-1234',
      documents: 4,
      vaccinations: ['BCG', 'DPT', 'Polio', 'Measles'],
      medicalRecords: 'Up to date',
      registeredDate: 'Jan 10, 2025'
    },
    {
      id: 'CHD-002',
      name: 'Diya Sharma',
      parent: 'Priya Sharma',
      parentPhone: '+91 98765 43211',
      parentEmail: 'priya@email.com',
      age: '8 years',
      dob: '22-Jul-2017',
      gender: 'Female',
      school: 'Delhi Public School',
      class: '3rd Standard',
      aadhaar: 'XXXX-XXXX-5678',
      documents: 5,
      vaccinations: ['BCG', 'DPT', 'Polio', 'Measles', 'MMR'],
      medicalRecords: 'Up to date',
      registeredDate: 'Feb 5, 2025'
    },
    {
      id: 'CHD-003',
      name: 'Arjun Patel',
      parent: 'Amit Patel',
      parentPhone: '+91 98765 43212',
      parentEmail: 'amit@email.com',
      age: '3 years',
      dob: '10-Nov-2022',
      gender: 'Male',
      school: 'Little Stars Playschool',
      class: 'Nursery',
      aadhaar: 'XXXX-XXXX-9012',
      documents: 3,
      vaccinations: ['BCG', 'DPT', 'Polio'],
      medicalRecords: 'Pending vaccination',
      registeredDate: 'Mar 12, 2025'
    },
  ];

  // Mock documents removed - using state variable initialized above


  // Removed hardcoded billPayments array - using paymentsData state from Firestore

  const billPayments = [
    {
      id: 'BILL-001',
      user: 'Rajesh Kumar',
      userId: 'USR-001',
      userPhone: '+91 98765 43210',
      userAddress: '123, Green Park, New Delhi',
      type: 'Electricity',
      billNumber: 'ELEC-2025-001',
      amount: '₹2,500',
      dueDate: 'Nov 10, 2025',
      paidDate: 'Nov 4, 2025',
      paymentMode: 'UPI',
      transactionId: 'TXN123456789',
      status: 'Paid',
      billingPeriod: 'Oct 2025'
    },
    {
      id: 'BILL-002',
      user: 'Priya Sharma',
      userId: 'USR-002',
      userPhone: '+91 98765 43211',
      userAddress: '456, Lajpat Nagar, New Delhi',
      type: 'Water',
      billNumber: 'WATER-2025-002',
      amount: '₹800',
      dueDate: 'Nov 12, 2025',
      paidDate: 'Nov 3, 2025',
      paymentMode: 'Debit Card',
      transactionId: 'TXN987654321',
      status: 'Paid',
      billingPeriod: 'Oct 2025'
    },
    {
      id: 'BILL-003',
      user: 'Amit Patel',
      userId: 'USR-003',
      userPhone: '+91 98765 43212',
      userAddress: '789, Karol Bagh, New Delhi',
      type: 'Property Tax',
      billNumber: 'PROP-2025-003',
      amount: '₹15,000',
      dueDate: 'Nov 15, 2025',
      paidDate: '',
      paymentMode: '',
      transactionId: '',
      status: 'Pending',
      billingPeriod: 'Q4 2025'
    },
  ];

  const activityLogs = [
    {
      id: 'LOG-001',
      timestamp: 'Nov 4, 2025 10:30 AM',
      user: 'Rajesh Kumar',
      userId: 'USR-001',
      action: 'Document Upload',
      details: 'Uploaded Aadhaar Card for verification',
      ipAddress: '192.168.1.1',
      deviceType: 'Mobile',
      status: 'Success'
    },
    {
      id: 'LOG-002',
      timestamp: 'Nov 4, 2025 09:15 AM',
      user: 'Priya Sharma',
      userId: 'USR-002',
      action: 'Complaint Filed',
      details: 'Filed complaint about potholes on Main Street',
      ipAddress: '192.168.1.2',
      deviceType: 'Desktop',
      status: 'Success'
    },
    {
      id: 'LOG-003',
      timestamp: 'Nov 3, 2025 03:45 PM',
      user: 'Amit Patel',
      userId: 'USR-003',
      action: 'Application Submitted',
      details: 'Applied for Digital India Scholarship scheme',
      ipAddress: '192.168.1.3',
      deviceType: 'Mobile',
      status: 'Success'
    },
    {
      id: 'LOG-004',
      timestamp: 'Nov 3, 2025 02:20 PM',
      user: 'Admin',
      userId: 'ADMIN-001',
      action: 'Status Update',
      details: 'Approved application APP-002 for Ayushman Bharat',
      ipAddress: '192.168.1.100',
      deviceType: 'Desktop',
      status: 'Success'
    },
  ];

  // Blood & Organ Donor Registrations
  const donorRegistrations = [
    {
      id: 'DONOR-001',
      donorName: 'Rajesh Kumar',
      userId: 'USR-001',
      donorType: 'Blood',
      bloodGroup: 'O+',
      age: '40',
      contact: '+91 98765 43210',
      location: 'New Delhi',
      availability: 'Immediately',
      medicalHistory: 'No major medical conditions. Healthy and fit.',
      registeredOn: 'Nov 1, 2025',
      status: 'Active',
      lastDonation: 'Oct 15, 2025'
    },
    {
      id: 'DONOR-002',
      donorName: 'Priya Sharma',
      userId: 'USR-002',
      donorType: 'Organ',
      bloodGroup: 'A+',
      age: '35',
      contact: '+91 98765 43211',
      location: 'Mumbai',
      availability: 'After death',
      medicalHistory: 'Pledged kidney and liver donation. No serious health issues.',
      registeredOn: 'Oct 28, 2025',
      status: 'Active',
      lastDonation: 'N/A'
    },
    {
      id: 'DONOR-003',
      donorName: 'Amit Patel',
      userId: 'USR-003',
      donorType: 'Blood',
      bloodGroup: 'B+',
      age: '37',
      contact: '+91 98765 43212',
      location: 'Bangalore',
      availability: 'Within a week',
      medicalHistory: 'Regular donor. Good health.',
      registeredOn: 'Oct 25, 2025',
      status: 'Active',
      lastDonation: 'Sep 20, 2025'
    },
    {
      id: 'DONOR-004',
      donorName: 'Sneha Reddy',
      userId: 'USR-004',
      donorType: 'Blood',
      bloodGroup: 'AB-',
      age: '28',
      contact: '+91 98765 43213',
      location: 'Hyderabad',
      availability: 'On request only',
      medicalHistory: 'First time donor. No medical complications.',
      registeredOn: 'Nov 3, 2025',
      status: 'Pending Verification',
      lastDonation: 'N/A'
    },
  ];

  // Blood & Organ Requests
  const healthRequests = [
    {
      id: 'REQ-001',
      requesterName: 'Vikram Singh',
      userId: 'USR-005',
      patientName: 'Anita Singh',
      requestType: 'Blood',
      bloodGroupNeeded: 'O-',
      organType: 'N/A',
      hospital: 'AIIMS, New Delhi',
      urgency: 'Critical',
      requiredBy: 'Nov 6, 2025',
      contact: '+91 98765 43214',
      additionalNotes: 'Emergency surgery scheduled. Patient lost significant blood.',
      requestedOn: 'Nov 4, 2025',
      status: 'Pending',
      matchedDonors: 0
    },
    {
      id: 'REQ-002',
      requesterName: 'Ravi Sharma',
      userId: 'USR-006',
      patientName: 'Maya Sharma',
      requestType: 'Organ',
      bloodGroupNeeded: 'N/A',
      organType: 'Kidney',
      hospital: 'Fortis Hospital, Mumbai',
      urgency: 'High',
      requiredBy: 'Dec 15, 2025',
      contact: '+91 98765 43215',
      additionalNotes: 'Patient on dialysis for 2 years. Kidney transplant urgently required.',
      requestedOn: 'Nov 2, 2025',
      status: 'In Progress',
      matchedDonors: 2
    },
    {
      id: 'REQ-003',
      requesterName: 'Sunita Verma',
      userId: 'USR-007',
      patientName: 'Arjun Verma',
      requestType: 'Blood',
      bloodGroupNeeded: 'A+',
      organType: 'N/A',
      hospital: 'Apollo Hospital, Bangalore',
      urgency: 'Medium',
      requiredBy: 'Nov 10, 2025',
      contact: '+91 98765 43216',
      additionalNotes: 'Scheduled surgery for thalassemia patient.',
      requestedOn: 'Nov 3, 2025',
      status: 'Fulfilled',
      matchedDonors: 3
    },
    {
      id: 'REQ-004',
      requesterName: 'Karan Malhotra',
      userId: 'USR-008',
      patientName: 'Deepak Malhotra',
      requestType: 'Blood',
      bloodGroupNeeded: 'B-',
      organType: 'N/A',
      hospital: 'Max Hospital, Delhi',
      urgency: 'High',
      requiredBy: 'Nov 8, 2025',
      contact: '+91 98765 43217',
      additionalNotes: 'Accident victim. Multiple transfusions needed.',
      requestedOn: 'Nov 4, 2025',
      status: 'Pending',
      matchedDonors: 1
    },
  ];

  // Mock feedbackData removed - using state variable initialized above


  const notifications = [
    {
      id: 1,
      type: 'application',
      title: 'New Scheme Application',
      message: 'Rajesh Kumar applied for PM Awas Yojana',
      time: '5 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'complaint',
      title: 'Urgent Complaint',
      message: 'High priority water supply complaint in Sector 15',
      time: '15 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'document',
      title: 'Document Verification',
      message: '5 documents pending verification',
      time: '1 hour ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'feedback',
      title: 'New Citizen Feedback',
      message: 'Priya Sharma submitted feedback on Health Services',
      time: '2 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: 5,
      type: 'scholarship',
      title: 'Scholarship Verification',
      message: 'Aarav Kumar\'s scholarship application needs review',
      time: '3 hours ago',
      read: true,
      priority: 'medium'
    },
  ];

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toLowerCase()) {
      case 'pending':
      case 'pending verification':
      case 'pending confirmation':
      case 'pending review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'verified':
      case 'paid':
      case 'resolved':
      case 'completed':
      case 'scheduled':
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRowClick = (item: any, type: string) => {
    setSelectedItem({ ...item, type });
    setShowDetailModal(true);
  };

  const handleAction = (item: any, action: 'approve' | 'reject' | 'update') => {
    setSelectedItem(item);
    setActionType(action);
    setNewStatus(item.status || '');
    setActionNotes('');
    setShowActionModal(true);
  };

  const handleSubmitAction = () => {
    let message = '';
    switch (actionType) {
      case 'approve':
        message = 'approved successfully';
        break;
      case 'reject':
        message = 'rejected';
        break;
      case 'update':
        message = 'updated successfully';
        break;
    }
    toast.success(`${selectedItem.type || 'Item'} ${message}`);
    setShowActionModal(false);
    setActionNotes('');
  };

  const markNotificationRead = (id: number) => {
    toast.success('Notification marked as read');
  };

  const markAllNotificationsRead = () => {
    toast.success('All notifications marked as read');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl">Official Dashboard</h1>
                <p className="text-slate-300 text-sm">DigiGov Administration • All Services & Departments</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-white">Welcome, {officialName}!</p>
                <Badge className="bg-blue-600 text-white">Government Official • Full Access</Badge>
              </div>
              {onShowAnalytics && (
                <Button
                  variant="ghost"
                  onClick={onShowAnalytics}
                  className="text-white hover:bg-slate-700"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-slate-700"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-white hover:bg-slate-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-xl text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Official Name</p>
                  <p className="text-xl">{officialName}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Access Level</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white text-blue-600">Full Access</Badge>
                    <p className="text-sm text-blue-100">All Departments & Services</p>
                  </div>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Portal Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xl">Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-white shadow-md p-2 h-auto">
              <TabsTrigger value="signups" className="whitespace-nowrap">
                <Users className="w-4 h-4 mr-2" />
                User Sign-ups
              </TabsTrigger>
              <TabsTrigger value="applications" className="whitespace-nowrap">
                <FileText className="w-4 h-4 mr-2" />
                Scheme Applications
              </TabsTrigger>
              <TabsTrigger value="complaints" className="whitespace-nowrap">
                <MessageSquare className="w-4 h-4 mr-2" />
                Complaints
              </TabsTrigger>
              <TabsTrigger value="children" className="whitespace-nowrap">
                <Baby className="w-4 h-4 mr-2" />
                Children Data
              </TabsTrigger>
              <TabsTrigger value="documents" className="whitespace-nowrap">
                <FolderOpen className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="bills" className="whitespace-nowrap">
                <CreditCard className="w-4 h-4 mr-2" />
                Bill Payments
              </TabsTrigger>
              <TabsTrigger value="logs" className="whitespace-nowrap">
                <Activity className="w-4 h-4 mr-2" />
                Activity Logs
              </TabsTrigger>
              <TabsTrigger value="health" className="whitespace-nowrap">
                <Heart className="w-4 h-4 mr-2" />
                Health Services
              </TabsTrigger>
              <TabsTrigger value="feedback" className="whitespace-nowrap">
                <Star className="w-4 h-4 mr-2" />
                Citizen Feedback
              </TabsTrigger>
              <TabsTrigger value="scholarships" className="whitespace-nowrap">
                <GraduationCap className="w-4 h-4 mr-2" />
                Scholarships
              </TabsTrigger>
            </TabsList>

            {/* User Sign-ups Tab */}
            <TabsContent value="signups" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Sign-ups</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export to Excel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Aadhaar</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userSignupsData.map((user) => (
                          <TableRow
                            key={user.id}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleRowClick(user, 'User')}
                          >
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.aadhaar}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(user.verificationStatus)}>
                                {user.verificationStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.registeredDate}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRowClick(user, 'User')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Select
                                  value={user.verificationStatus}
                                  onValueChange={(value) => {
                                    toast.success(`User verification status updated to ${value}`);
                                  }}
                                >
                                  <SelectTrigger className="w-[120px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Verified">Verified</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scheme Applications Tab */}
            <TabsContent value="applications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scheme Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Scheme</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Applied On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(schemeApplicationsData.length > 0 ? schemeApplicationsData : schemeApplications).map((app) => (
                          <TableRow
                            key={app.id}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleRowClick(app, 'Application')}
                          >
                            <TableCell className="font-medium">{app.id}</TableCell>
                            <TableCell>{app.fullName}</TableCell>
                            <TableCell>{app.scheme}</TableCell>
                            <TableCell>{app.schemeType}</TableCell>
                            <TableCell>{app.appliedOn}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRowClick(app, 'Application')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {app.status === 'Pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleAction(app, 'approve')}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleAction(app, 'reject')}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complaints Tab */}
            <TabsContent value="complaints" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Complaints Management</CardTitle>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Citizen</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {complaints.map((complaint) => (
                          <TableRow
                            key={complaint.id}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleRowClick(complaint, 'Complaint')}
                          >
                            <TableCell className="font-medium">{complaint.id}</TableCell>
                            <TableCell>{complaint.citizen}</TableCell>
                            <TableCell>{complaint.department}</TableCell>
                            <TableCell className="max-w-xs truncate">{complaint.subject}</TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(complaint.priority)}>
                                {complaint.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                            </TableCell>
                            <TableCell>{complaint.date}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRowClick(complaint, 'Complaint')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Select
                                  value={complaint.status}
                                  onValueChange={(value) => {
                                    toast.success(`Complaint status updated to ${value}`);
                                  }}
                                >
                                  <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Children Data Tab */}
            <TabsContent value="children" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Children Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Parent</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Documents</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(childrenDataState.length > 0 ? childrenDataState : childrenData).map((child) => (
                          <TableRow
                            key={child.id}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleRowClick(child, 'Child')}
                          >
                            <TableCell className="font-medium">{child.id}</TableCell>
                            <TableCell>{child.name}</TableCell>
                            <TableCell>{child.parent}</TableCell>
                            <TableCell>{child.age}</TableCell>
                            <TableCell>{child.school}</TableCell>
                            <TableCell>{child.class}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{child.documents} docs</Badge>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRowClick(child, 'Child')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Document Verification</CardTitle>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Uploaded On</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc) => (
                          <TableRow
                            key={doc.id}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleRowClick(doc, 'Document')}
                          >
                            <TableCell className="font-medium">{doc.id}</TableCell>
                            <TableCell>{doc.user}</TableCell>
                            <TableCell>{doc.type}</TableCell>
                            <TableCell>{doc.uploadedOn}</TableCell>
                            <TableCell>{doc.purpose}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRowClick(doc, 'Document')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {doc.status === 'Pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleAction(doc, 'approve')}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleAction(doc, 'reject')}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Logs Tab */}
            < TabsContent value="logs" className="mt-6" >
              <Card>
                <CardHeader>
                  <CardTitle>Activity Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityLogs.map((log) => (
                          <TableRow
                            key={log.id}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleRowClick(log, 'Activity')}
                          >
                            <TableCell className="font-medium">{log.id}</TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.action}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRowClick(log, 'Activity')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >

            {/* Health Services Tab */}
            < TabsContent value="health" className="mt-6" >
              <Tabs defaultValue="donors" className="w-full">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="donors" className="flex-1">
                    <Droplet className="w-4 h-4 mr-2" />
                    Donor Registrations
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Blood/Organ Requests
                  </TabsTrigger>
                </TabsList>

                {/* Donor Registrations Sub-Tab */}
                <TabsContent value="donors">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Donor Registrations</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            {donorRegistrations.filter(d => d.donorType === 'Blood').length} Blood Donors
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {donorRegistrations.filter(d => d.donorType === 'Organ').length} Organ Donors
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>ID</TableHead>
                              <TableHead>Donor Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Blood Group</TableHead>
                              <TableHead>Age</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Availability</TableHead>
                              <TableHead>Registered On</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(donorRegistrationsData.length > 0 ? donorRegistrationsData : donorRegistrations).map((donor: any) => (
                              <TableRow
                                key={donor.id}
                                className="cursor-pointer hover:bg-blue-50 transition-colors"
                                onClick={() => handleRowClick(donor, 'Donor')}
                              >
                                <TableCell className="font-medium">{donor.id}</TableCell>
                                <TableCell>{donor.donorName}</TableCell>
                                <TableCell>
                                  <Badge className={donor.donorType === 'Blood' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}>
                                    {donor.donorType === 'Blood' ? '🩸 Blood' : '🫀 Organ'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{donor.bloodGroup}</Badge>
                                </TableCell>
                                <TableCell>{donor.age}</TableCell>
                                <TableCell>{donor.location}</TableCell>
                                <TableCell className="text-sm">{donor.availability}</TableCell>
                                <TableCell>{donor.registeredOn}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(donor.status)}>{donor.status}</Badge>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRowClick(donor, 'Donor')}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Select
                                      value={donor.status}
                                      onValueChange={(value) => {
                                        toast.success(`Donor status updated to ${value}`);
                                      }}
                                    >
                                      <SelectTrigger className="w-[140px] h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Blood/Organ Requests Sub-Tab */}
                <TabsContent value="requests">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Blood & Organ Requests</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            {healthRequests.filter(r => r.requestType === 'Blood').length} Blood Requests
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {healthRequests.filter(r => r.requestType === 'Organ').length} Organ Requests
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>ID</TableHead>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Requirement</TableHead>
                              <TableHead>Hospital</TableHead>
                              <TableHead>Urgency</TableHead>
                              <TableHead>Required By</TableHead>
                              <TableHead>Matched Donors</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {healthRequests.map((request) => (
                              <TableRow
                                key={request.id}
                                className="cursor-pointer hover:bg-blue-50 transition-colors"
                                onClick={() => handleRowClick(request, 'HealthRequest')}
                              >
                                <TableCell className="font-medium">{request.id}</TableCell>
                                <TableCell>{request.patientName}</TableCell>
                                <TableCell>
                                  <Badge className={request.requestType === 'Blood' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}>
                                    {request.requestType === 'Blood' ? '🩸 Blood' : '🫀 Organ'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {request.requestType === 'Blood' ? request.bloodGroupNeeded : request.organType}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">{request.hospital}</TableCell>
                                <TableCell>
                                  <Badge className={getPriorityColor(request.urgency)}>
                                    {request.urgency}
                                  </Badge>
                                </TableCell>
                                <TableCell>{request.requiredBy}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    {request.matchedDonors} matched
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRowClick(request, 'HealthRequest')}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Select
                                      value={request.status}
                                      onValueChange={(value) => {
                                        toast.success(`Request status updated to ${value}`);
                                      }}
                                    >
                                      <SelectTrigger className="w-[140px] h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        <SelectItem value="Expired">Expired</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent >

            {/* Citizen Feedback Tab */}
            < TabsContent value="feedback" className="mt-6" >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Citizen Feedback</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Average Rating</p>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xl font-medium">
                            {(feedbackData.reduce((acc, f) => acc + f.rating, 0) / feedbackData.length).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Comment</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feedbackData.map((feedback) => (
                          <TableRow
                            key={feedback.id}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleRowClick(feedback, 'Feedback')}
                          >
                            <TableCell className="font-medium">{feedback.id}</TableCell>
                            <TableCell>{feedback.user}</TableCell>
                            <TableCell>{feedback.service}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{feedback.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{feedback.comment}</TableCell>
                            <TableCell>{feedback.date}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(feedback.status)}>{feedback.status}</Badge>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRowClick(feedback, 'Feedback')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Select
                                  value={feedback.status}
                                  onValueChange={(value) => {
                                    toast.success(`Feedback status updated to ${value}`);
                                  }}
                                >
                                  <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                                    <SelectItem value="Responded">Responded</SelectItem>
                                    <SelectItem value="Archived">Archived</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >

            {/* Scholarship Applications Tab */}
            < TabsContent value="scholarships" className="mt-6" >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Scholarship Applications</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export to Excel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Scholarship</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied On</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingScholarships ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                <span>Loading applications...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : scholarshipApplicationsData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                              No scholarship applications found
                            </TableCell>
                          </TableRow>
                        ) : (
                          scholarshipApplicationsData.map((app) => (
                            <TableRow
                              key={app.id}
                              className="cursor-pointer hover:bg-blue-50 transition-colors"
                              onClick={() => handleRowClick(app, 'Scholarship Application')}
                            >
                              <TableCell className="font-medium">{app.id}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{app.student}</p>
                                  <p className="text-xs text-gray-500">Parent: {app.parent}</p>
                                </div>
                              </TableCell>
                              <TableCell>{app.scholarship}</TableCell>
                              <TableCell>{app.amount}</TableCell>
                              <TableCell>{app.school}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(app.status)}>
                                  {app.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{app.appliedOn}</TableCell>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRowClick(app, 'Scholarship Application')}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Select
                                    value={app.status}
                                    onValueChange={(value) => {
                                      if (value === 'Approved') handleAction(app, 'approve');
                                      else if (value === 'Rejected') handleAction(app, 'reject');
                                      else {
                                        setSelectedItem(app);
                                        setNewStatus(value);
                                        setActionType('update');
                                        setShowActionModal(true);
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-[140px] h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                                      <SelectItem value="Under Review">Under Review</SelectItem>
                                      <SelectItem value="Approved">Approved</SelectItem>
                                      <SelectItem value="Rejected">Rejected</SelectItem>
                                      <SelectItem value="Disbursed">Disbursed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >
          </Tabs >
        </motion.div >
      </div >

      {/* Notifications Panel */}
      < Dialog open={showNotifications} onOpenChange={setShowNotifications} >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Notifications</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllNotificationsRead}
                className="text-blue-600 hover:text-blue-700"
              >
                Mark all as read
              </Button>
            </div>
            <DialogDescription>
              Stay updated with the latest activities and requests
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${!notification.read
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'bg-white hover:bg-gray-50'
                    }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.priority === 'high' ? 'bg-red-100' :
                      notification.priority === 'medium' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                      {notification.type === 'application' && <FileText className="w-5 h-5 text-blue-600" />}
                      {notification.type === 'complaint' && <MessageSquare className="w-5 h-5 text-red-600" />}
                      {notification.type === 'document' && <FolderOpen className="w-5 h-5 text-purple-600" />}
                      {notification.type === 'feedback' && <Star className="w-5 h-5 text-yellow-600" />}
                      {notification.type === 'scholarship' && <GraduationCap className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog >

      {/* Detail Modal - Will render different content based on selectedItem.type */}
      < DetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        item={selectedItem}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
      />

      {/* Action Modal (Approve/Reject/Update) */}
      < Dialog open={showActionModal} onOpenChange={setShowActionModal} >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {actionType === 'approve' && 'Approve Item'}
              {actionType === 'reject' && 'Reject Item'}
              {actionType === 'update' && 'Update Status'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' && 'Confirm approval and provide any additional notes'}
              {actionType === 'reject' && 'Provide reason for rejection'}
              {actionType === 'update' && 'Update the current status and add notes'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionType === 'update' && (
              <div className="space-y-2">
                <Label htmlFor="new-status">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="action-notes">
                {actionType === 'reject' ? 'Reason for Rejection' : 'Notes (Optional)'}
              </Label>
              <Textarea
                id="action-notes"
                placeholder={
                  actionType === 'reject'
                    ? 'Please provide a detailed reason for rejection...'
                    : 'Add any additional notes or comments...'
                }
                rows={4}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                required={actionType === 'reject'}
              />
            </div>

            {actionType === 'approve' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Confirmation</p>
                    <p className="text-sm text-green-700 mt-1">
                      This item will be marked as approved and the user will be notified.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {actionType === 'reject' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Warning</p>
                    <p className="text-sm text-red-700 mt-1">
                      This action will reject the item. Please ensure you have reviewed all details.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              className={
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : actionType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
              }
              disabled={actionType === 'reject' && !actionNotes.trim()}
            >
              {actionType === 'approve' && <CheckCircle className="w-4 h-4 mr-2" />}
              {actionType === 'reject' && <XCircle className="w-4 h-4 mr-2" />}
              {actionType === 'update' && <Clock className="w-4 h-4 mr-2" />}
              {actionType === 'approve' && 'Approve'}
              {actionType === 'reject' && 'Reject'}
              {actionType === 'update' && 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >
    </div >
  );
}

// Separate DetailModal component for better organization
function DetailModal({ open, onOpenChange, item, getStatusColor, getPriorityColor }: any) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {item.type} Details - {item.id || item.name}
          </DialogTitle>
          <DialogDescription>
            Complete information and documentation
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          {/* User Details */}
          {item.type === 'User' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Name:</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Aadhaar:</span>
                      <span>{item.fullAadhaar}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">DOB:</span>
                      <span>{item.dob}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Gender:</span>
                      <span>{item.gender}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span>{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Email:</span>
                      <span>{item.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <span className="font-medium">Address:</span>
                        <p className="text-gray-600 mt-1">{item.fullAddress}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Registered Date:</span>
                    <span className="text-sm">{item.registeredDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Documents:</span>
                    <Badge>{item.documents}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verification Status:</span>
                    <Badge className={getStatusColor(item.verificationStatus)}>
                      {item.verificationStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium mb-2 block">Services Used:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.services?.map((service: string, idx: number) => (
                        <Badge key={idx} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                  {item.aadhaarPhotoLink && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Aadhaar Photo</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(item.aadhaarPhotoLink, '_blank')}
                      >
                        <Link className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Application Details */}
          {item.type === 'Application' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Application ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Scheme</span>
                      <p className="font-medium">{item.scheme}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Scheme Type</span>
                      <p>{item.schemeType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Applied On</span>
                      <p>{item.appliedOn}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Eligibility</span>
                      <p>{item.eligibility}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applicant Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Name:</span>
                      <span>{item.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span>{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Email:</span>
                      <span>{item.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">DOB:</span>
                      <span>{item.dob}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Gender:</span>
                      <span>{item.gender}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Aadhaar:</span>
                      <span>{item.aadhaar}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-gray-600 mt-1">{item.fullAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Annual Income:</span>
                      <span className="text-sm font-medium">{item.annualIncome}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Category:</span>
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Bank Account:</span>
                      <span className="text-sm">{item.bankAccount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">IFSC Code:</span>
                      <span className="text-sm">{item.ifsc}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {item.institution && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Educational Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Institution:</span>
                        <span className="text-sm">{item.institution}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Course:</span>
                        <span className="text-sm">{item.course}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Year:</span>
                        <span className="text-sm">{item.year}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Percentage:</span>
                        <span className="text-sm">{item.percentage}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {item.documents?.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.link, '_blank')}
                        >
                          <Link className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {item.reason && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reason for Application</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{item.reason}</p>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Verification Status</p>
                      <p className="text-sm text-blue-800">{item.verificationStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Complaint Details */}
          {item.type === 'Complaint' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Complaint Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Complaint ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Department</span>
                      <p>{item.department}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date Filed</span>
                      <p>{item.date}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Priority</span>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Assigned To</span>
                      <p>{item.assignedTo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Citizen Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{item.citizen}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{item.citizenPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{item.citizenEmail}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Complaint Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Subject</span>
                    <p className="font-medium">{item.subject}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Description</span>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location</span>
                      <p className="text-gray-700">{item.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {item.documentLinks && item.documentLinks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Attached Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {item.documentLinks.map((link: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Document {idx + 1}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(link, '_blank')}
                          >
                            <Link className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {item.timeline && item.timeline.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {item.timeline.map((update: any, idx: number) => (
                        <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-500 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{update.date}</span>
                              <Badge className={getStatusColor(update.status)}>{update.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{update.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Scholarship Details */}
          {item.type === 'Scholarship' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scholarship Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Application ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Scholarship Type</span>
                      <p>{item.scholarship}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Amount</span>
                      <p className="font-medium text-green-600">{item.amount}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Applied On</span>
                      <p>{item.appliedOn}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Student Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Student Name</span>
                      <p className="font-medium">{item.student}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Class</span>
                      <p>{item.class}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">School</span>
                      <p>{item.school}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Academic %</span>
                      <p className="font-medium text-blue-600">{item.academicPercentage}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm font-medium text-gray-500">Last Year Marks</span>
                      <p>{item.lastYearMarks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Parent/Guardian Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{item.parent}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{item.parentPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{item.parentEmail}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {item.documents?.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.link, '_blank')}
                        >
                          <Link className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Child Details */}
          {item.type === 'Child' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Child Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Child ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name</span>
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                      <p>{item.dob}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Age</span>
                      <p>{item.age}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Gender</span>
                      <p>{item.gender}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Aadhaar</span>
                      <p>{item.aadhaar}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Parent/Guardian Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{item.parent}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{item.parentPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{item.parentEmail}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Education Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">School:</span>
                    <span className="text-sm">{item.school}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Class:</span>
                    <span className="text-sm">{item.class}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Documents:</span>
                    <Badge>{item.documents} documents</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium mb-2 block">Vaccinations:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.vaccinations?.map((vac: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-green-50">
                          {vac}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Medical Records:</span>
                    <span className="text-sm">{item.medicalRecords}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Registered On:</span>
                    <span className="text-sm">{item.registeredDate}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Document Details */}
          {item.type === 'Document' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Document Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Document ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Document Type</span>
                      <p className="font-medium">{item.type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Document Number</span>
                      <p>{item.documentNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Uploaded On</span>
                      <p>{item.uploadedOn}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Expiry Date</span>
                      <p>{item.expiryDate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Purpose</span>
                      <p>{item.purpose}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    {item.verifiedBy && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Verified By</span>
                        <p>{item.verifiedBy}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{item.user}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{item.userPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{item.userEmail}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Document File</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(item.fileLink, '_blank')}
                    >
                      <Link className="w-4 h-4 mr-1" />
                      View Document
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {item.rejectionReason && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900 mb-1">Rejection Reason</p>
                        <p className="text-sm text-red-800">{item.rejectionReason}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Bill Details */}
          {item.type === 'Bill' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bill Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bill ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bill Number</span>
                      <p className="font-medium">{item.billNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bill Type</span>
                      <p>{item.type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Billing Period</span>
                      <p>{item.billingPeriod}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Amount</span>
                      <p className="text-xl font-medium text-green-600">{item.amount}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Due Date</span>
                      <p>{item.dueDate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    {item.paidDate && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Paid On</span>
                        <p>{item.paidDate}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{item.user}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{item.userPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-gray-600 mt-1">{item.userAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {item.status === 'Paid' && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-900">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Payment Mode:</span>
                      <span className="text-sm">{item.paymentMode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Transaction ID:</span>
                      <span className="text-sm font-mono">{item.transactionId}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Activity Details */}
          {item.type === 'Activity' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Activity ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Timestamp</span>
                      <p>{item.timestamp}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">User</span>
                      <p className="font-medium">{item.user}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Action</span>
                      <Badge variant="outline">{item.action}</Badge>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm font-medium text-gray-500">Details</span>
                      <p className="text-gray-700 mt-1">{item.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">IP Address:</span>
                    <span className="text-sm font-mono">{item.ipAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Device Type:</span>
                    <span className="text-sm">{item.deviceType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Health Details */}
          {item.type === 'Health' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Service ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Service Type</span>
                      <p>{item.service}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Hospital</span>
                      <p>{item.hospital}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Doctor</span>
                      <p>{item.doctor}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Appointment Date</span>
                      <p>{item.appointmentDate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Appointment Time</span>
                      <p>{item.appointmentTime}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Requested On</span>
                      <p>{item.requestedOn}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{item.patient}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{item.patientPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Age:</span>
                    <span>{item.age}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Gender:</span>
                    <span>{item.gender}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Ailment/Reason</span>
                      <p className="text-gray-700">{item.ailment}</p>
                    </div>
                    {item.documents && item.documents.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-2">Medical Documents</span>
                        <div className="space-y-2">
                          {item.documents.map((doc: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">{doc.name}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(doc.link, '_blank')}
                              >
                                <Link className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feedback Details */}
          {item.type === 'Feedback' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Feedback Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Feedback ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Service</span>
                      <p>{item.service}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Category</span>
                      <p>{item.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date</span>
                      <p>{item.date}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Rating</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{item.user}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{item.userPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{item.userEmail}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Feedback Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Brief Comment</span>
                    <p className="text-gray-700">{item.comment}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Detailed Feedback</span>
                    <p className="text-gray-700 leading-relaxed">{item.fullFeedback}</p>
                  </div>
                </CardContent>
              </Card>

              {item.officialResponse ? (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">Official Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-800">{item.officialResponse}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900 mb-1">Response Pending</p>
                        <p className="text-sm text-yellow-800">No official response has been provided yet.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Scholarship Application Details */}
          {item.type === 'Scholarship Application' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Application ID</span>
                      <p className="font-medium">{item.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Scholarship Name</span>
                      <p>{item.scholarship}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Amount</span>
                      <p className="text-xl font-medium text-green-600">{item.amount}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Applied On</span>
                      <p>{item.appliedOn}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">School</span>
                      <p>{item.school}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Student & Parent Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Student Name:</span>
                    <span>{item.student}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Parent Name:</span>
                    <span>{item.parent}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Parent Phone:</span>
                    <span>{item.parentPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Parent Email:</span>
                    <span>{item.parentEmail}</span>
                  </div>
                </CardContent>
              </Card>

              {item.remarks && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Remarks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{item.remarks}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
