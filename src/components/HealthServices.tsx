import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Droplet, Heart, AlertCircle, MessageSquareText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { registerDonor, getUserDonorRegistrations, submitHealthRequest, getUserHealthRequests } from '../firebase';

interface HealthServicesProps {
  userName?: string;
  onNavigate?: (page: string) => void;
  onToggleChatbot?: () => void;
}

export function HealthServices({ userName = 'Rajesh Kumar', onNavigate, onToggleChatbot }: HealthServicesProps) {
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [donorType, setDonorType] = useState<'blood' | 'organ'>('blood');
  const [requestType, setRequestType] = useState<'blood' | 'organ'>('blood');
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user's donations and requests on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [donationsResult, requestsResult] = await Promise.all([
        getUserDonorRegistrations(),
        getUserHealthRequests()
      ]);

      if (donationsResult.success) {
        setMyDonations(donationsResult.data || []);
      }
      if (requestsResult.success) {
        setMyRequests(requestsResult.data || []);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const availabilityOptions = ['Immediately', 'Within a week', 'Within a month', 'On request only'];
  const urgencyLevels = ['Critical', 'High', 'Medium'];

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);

    const donorData = {
      donorType,
      fullName: formData.get('donor-name') as string,
      bloodGroup: formData.get('blood-group') as string,
      age: parseInt(formData.get('donor-age') as string),
      contact: formData.get('donor-contact') as string,
      location: formData.get('donor-location') as string,
      availability: formData.get('donor-availability') as string,
      medicalHistory: formData.get('medical-history') as string || '',
    };

    try {
      const result = await registerDonor(donorData);
      if (result.success) {
        toast.success(`Successfully registered as ${donorType} donor!`);
        setShowDonorModal(false);
        await fetchUserData(); // Refresh data
      } else {
        toast.error(result.message || 'Failed to register as donor');
      }
    } catch (error) {
      toast.error('An error occurred while registering');
      console.error('Error registering donor:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);

    const requestData = {
      requestType,
      patientName: formData.get('patient-name') as string,
      bloodGroupNeeded: requestType === 'blood' ? formData.get('blood-group-needed') as string : null,
      organType: requestType === 'organ' ? formData.get('blood-group-needed') as string : null,
      hospital: formData.get('hospital') as string,
      urgency: formData.get('urgency') as string,
      requiredBy: formData.get('required-by') as string,
      additionalNotes: formData.get('request-notes') as string || '',
    };

    try {
      const result = await submitHealthRequest(requestData);
      if (result.success) {
        toast.success(`${requestType === 'blood' ? 'Blood' : 'Organ'} request submitted successfully!`);
        setShowRequestModal(false);
        await fetchUserData(); // Refresh data
      } else {
        toast.error(result.message || 'Failed to submit request');
      }
    } catch (error) {
      toast.error('An error occurred while submitting request');
      console.error('Error submitting request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openDonorModal = (type: 'blood' | 'organ') => {
    setDonorType(type);
    setShowDonorModal(true);
  };

  const openRequestModal = (type: 'blood' | 'organ') => {
    setRequestType(type);
    setShowRequestModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 pb-20">
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
                <h1 className="text-gray-900">🏥 Health Services</h1>
                <p className="text-sm text-gray-600">Blood & Organ Donation Services</p>
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
        {/* Donation Forms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-gray-900 mb-6">💉 Donation Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="border-2 border-red-200 hover:border-red-400 cursor-pointer transition-all shadow-lg hover:shadow-xl"
                onClick={() => openDonorModal('blood')}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 shadow-lg">
                      <Droplet className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-2">🩸 Register as Blood Donor</h3>
                    <p className="text-gray-600">
                      Help save lives by donating blood
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="border-2 border-pink-200 hover:border-pink-400 cursor-pointer transition-all shadow-lg hover:shadow-xl"
                onClick={() => openDonorModal('organ')}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-2">🫀 Register as Organ Donor</h3>
                    <p className="text-gray-600">
                      Pledge to give the gift of life
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Request Forms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-gray-900 mb-6">🏥 Request Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all shadow-lg hover:shadow-xl"
                onClick={() => openRequestModal('blood')}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                      <Droplet className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-2">🩸 Request Blood</h3>
                    <p className="text-gray-600">
                      Submit an urgent blood requirement request
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all shadow-lg hover:shadow-xl"
                onClick={() => openRequestModal('organ')}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-2">🫀 Request Organ</h3>
                    <p className="text-gray-600">
                      Submit an organ transplant request
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* My Health Records Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900">My Health Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="donations" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="donations" className="flex-1">My Donations</TabsTrigger>
                  <TabsTrigger value="requests" className="flex-1">My Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="donations" className="mt-6">
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Location</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myDonations.length > 0 ? (
                          myDonations.map((donation, index) => (
                            <TableRow key={index}>
                              <TableCell>{donation.type}</TableCell>
                              <TableCell>{donation.date}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(donation.status)}>
                                  {donation.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{donation.location}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                              No donation records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="requests" className="mt-6">
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Type</TableHead>
                          <TableHead>Requested On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myRequests.length > 0 ? (
                          myRequests.map((request, index) => (
                            <TableRow key={index}>
                              <TableCell>{request.type}</TableCell>
                              <TableCell>{request.requestedOn}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityColor(request.priority)}>
                                  {request.priority}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                              No request records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Donor Form Modal */}
      <Dialog open={showDonorModal} onOpenChange={setShowDonorModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {donorType === 'blood' ? '🩸 Register as Blood Donor' : '🫀 Register as Organ Donor'}
            </DialogTitle>
            <DialogDescription>
              {donorType === 'blood'
                ? 'Fill out the form below to register as a blood donor and help save lives.'
                : 'Fill out the form below to pledge organ donation and give the gift of life.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDonorSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="donor-name">Full Name</Label>
              <Input id="donor-name" name="donor-name" defaultValue={userName} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood-group">Blood Group</Label>
              <select
                id="blood-group"
                name="blood-group"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select blood group...</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="donor-age">Age</Label>
                <Input id="donor-age" name="donor-age" type="number" min="18" max="65" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donor-contact">Contact Number</Label>
                <Input id="donor-contact" name="donor-contact" type="tel" placeholder="+91 98765 43210" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor-location">Location (City)</Label>
              <select
                id="donor-location"
                name="donor-location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select city...</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor-availability">Availability</Label>
              <select
                id="donor-availability"
                name="donor-availability"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select availability...</option>
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-history">Medical History</Label>
              <Textarea
                id="medical-history"
                rows={4}
                placeholder="Please mention any relevant medical conditions, medications, or allergies..."
              />
            </div>

            {donorType === 'organ' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-900 mb-1">Important Information</h4>
                    <p className="text-sm text-blue-800">
                      By registering as an organ donor, you pledge to donate your organs after death
                      to help save lives. Your family will be consulted at the time of donation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDonorModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                Submit Registration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Form Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {requestType === 'blood' ? '🩸 Request Blood' : '🫀 Request Organ'}
            </DialogTitle>
            <DialogDescription>
              {requestType === 'blood'
                ? 'Submit a blood requirement request. We will match you with available donors.'
                : 'Submit an organ transplant request. Your application will be processed and matched with available donors.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name">Patient Name</Label>
              <Input id="patient-name" name="patient-name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood-group-needed">
                {requestType === 'blood' ? 'Blood Group Needed' : 'Organ Type Needed'}
              </Label>
              {requestType === 'blood' ? (
                <select
                  id="blood-group-needed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select blood group...</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="blood-group-needed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select organ type...</option>
                  <option value="kidney">Kidney</option>
                  <option value="liver">Liver</option>
                  <option value="heart">Heart</option>
                  <option value="lungs">Lungs</option>
                  <option value="pancreas">Pancreas</option>
                  <option value="cornea">Cornea</option>
                </select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Input id="hospital" name="hospital" placeholder="Enter hospital name" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <select
                  id="urgency"
                  name="urgency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select urgency...</option>
                  {urgencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="required-by">Required By</Label>
                <Input id="required-by" name="required-by" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-notes">Additional Notes</Label>
              <Textarea
                id="request-notes"
                rows={4}
                placeholder="Provide any additional information that may help..."
              />
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-900 mb-1">Emergency Notice</h4>
                  <p className="text-sm text-red-800">
                    For critical emergencies, please contact your nearest hospital immediately.
                    This request will be processed and matched with available donors as soon as possible.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
