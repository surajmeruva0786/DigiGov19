import { useState } from 'react';
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface CitizenFeedbackProps {
  onNavigate: (page: string) => void;
}

export function CitizenFeedback({ onNavigate }: CitizenFeedbackProps) {
  const [activeTab, setActiveTab] = useState('submit');

  const myFeedback = [
    {
      id: 'FB-2025-001',
      category: 'Health Services',
      subject: 'Long wait times at Central Medical Center',
      submittedDate: 'Oct 28, 2025',
      status: 'Under Review',
      statusColor: 'bg-yellow-500',
      priority: 'Medium',
    },
    {
      id: 'FB-2025-002',
      category: 'Digital Services',
      subject: 'Suggestion for mobile app improvement',
      submittedDate: 'Oct 15, 2025',
      status: 'Resolved',
      statusColor: 'bg-green-500',
      priority: 'Low',
      response: 'Thank you for your feedback. We have implemented your suggestion in our latest update.',
    },
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Feedback submitted successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('dashboard')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <h1>Citizen Feedback</h1>
          </div>
        </div>
        <p className="text-gray-600 ml-14">
          Share your thoughts, suggestions, and concerns to help us improve our services
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="tracking">Track Feedback</TabsTrigger>
        </TabsList>

        {/* Submit Feedback */}
        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Feedback</CardTitle>
              <CardDescription>
                We value your input. Please share your experience, suggestions, or concerns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a category...</option>
                    <option value="digital-services">Digital Services</option>
                    <option value="health">Health Services</option>
                    <option value="education">Education</option>
                    <option value="transportation">Transportation</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="public-safety">Public Safety</option>
                    <option value="environment">Environment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Feedback Type</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select type...</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="compliment">Compliment</option>
                    <option value="inquiry">General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief summary of your feedback"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Please provide detailed information about your feedback. Include specific examples if applicable..."
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <select
                    id="priority"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low - General feedback or suggestion</option>
                    <option value="medium">Medium - Issue affecting service quality</option>
                    <option value="high">High - Urgent issue requiring immediate attention</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachment Links (Optional)</Label>
                  <Textarea
                    id="attachments"
                    placeholder="https://drive.google.com/file/d/...&#10;https://drive.google.com/file/d/..."
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    Upload your supporting documents to Google Drive and paste the shareable links here (one per line)
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-blue-900 mb-1">Privacy Notice</h3>
                    <p className="text-sm text-blue-800">
                      Your feedback will be reviewed by the relevant department. We will contact you if additional information is needed. Your personal information will be kept confidential.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                  <Button type="button" variant="outline" size="lg">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Track Feedback */}
        <TabsContent value="tracking">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2>My Feedback Submissions</h2>
              <Button onClick={() => setActiveTab('submit')}>
                Submit New Feedback
              </Button>
            </div>

            {myFeedback.length > 0 ? (
              <div className="space-y-4">
                {myFeedback.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3>{feedback.subject}</h3>
                              <Badge className={feedback.statusColor}>
                                {feedback.status}
                              </Badge>
                              <Badge variant="outline">{feedback.priority}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span>ID: {feedback.id}</span>
                              <span>•</span>
                              <span>Category: {feedback.category}</span>
                              <span>•</span>
                              <span>Submitted: {feedback.submittedDate}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>

                        {feedback.response && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-green-900 mb-1">Response from DigiGov</p>
                                <p className="text-sm text-green-800">{feedback.response}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {feedback.status === 'Under Review' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-yellow-900 mb-1">Status Update</p>
                                <p className="text-sm text-yellow-800">
                                  Your feedback is currently being reviewed by our team. We will update you soon.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="mb-2">No Feedback Submitted</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't submitted any feedback yet. Share your thoughts to help us improve.
                  </p>
                  <Button onClick={() => setActiveTab('submit')}>
                    Submit Feedback
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Feedback Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl text-purple-600 mb-2">{myFeedback.length}</div>
              <p className="text-sm text-gray-600">Feedback items</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl text-yellow-600 mb-2">
                {myFeedback.filter(f => f.status === 'Under Review').length}
              </div>
              <p className="text-sm text-gray-600">Pending items</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl text-green-600 mb-2">
                {myFeedback.filter(f => f.status === 'Resolved').length}
              </div>
              <p className="text-sm text-gray-600">Completed items</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
