import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Globe, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface UserProfileProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function UserProfile({ onNavigate, userName = 'John Doe' }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('personal');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Preferences saved successfully!');
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
            <User className="w-8 h-8 text-blue-600" />
            <h1>My Profile</h1>
          </div>
        </div>
        <p className="text-gray-600 ml-14">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Summary Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-3xl">{userName.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="flex-1">
              <h2 className="mb-1">{userName}</h2>
              <p className="text-gray-600 mb-3">Citizen ID: DG-2025-123456</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onNavigate('digital-id')}>
                  View Digital ID
                </Button>
                <Button size="sm" variant="outline">Change Photo</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="email" type="email" defaultValue="john.doe@example.com" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="dob" type="date" defaultValue="1990-01-15" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      id="address"
                      rows={3}
                      className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-md"
                      defaultValue="123 Main Street, Capital City, ST 12345"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Capital City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" defaultValue="12345" />
                  </div>
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>

                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-blue-900">Two-factor authentication is enabled</p>
                      <p className="text-sm text-blue-700">Your account is protected</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline">Manage 2FA Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage devices where you're currently logged in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p>Windows PC - Chrome</p>
                      <p className="text-sm text-gray-600">Last active: Just now</p>
                    </div>
                    <span className="text-sm text-green-600">Current device</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p>iPhone - Safari</p>
                      <p className="text-sm text-gray-600">Last active: 2 hours ago</p>
                    </div>
                    <Button size="sm" variant="outline">Sign out</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>
                Customize your DigiGov experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePreferences} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <div>
                        <Label>Language</Label>
                        <p className="text-sm text-gray-600">Choose your preferred language</p>
                      </div>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-gray-600">Choose light or dark theme</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Time Zone</Label>
                      <p className="text-sm text-gray-600">Set your local time zone</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md">
                      <option value="est">Eastern Time (ET)</option>
                      <option value="cst">Central Time (CT)</option>
                      <option value="mst">Mountain Time (MT)</option>
                      <option value="pst">Pacific Time (PT)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Voice Assistance</Label>
                      <p className="text-sm text-gray-600">Enable voice commands</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Accessibility Mode</Label>
                      <p className="text-sm text-gray-600">Enhanced accessibility features</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Service Updates</Label>
                        <p className="text-sm text-gray-600">Receive updates about service changes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Appointment Reminders</Label>
                        <p className="text-sm text-gray-600">Get reminded about upcoming appointments</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Feedback Updates</Label>
                        <p className="text-sm text-gray-600">Status updates on your feedback submissions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Important Announcements</Label>
                        <p className="text-sm text-gray-600">Critical government announcements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>News & Updates</Label>
                        <p className="text-sm text-gray-600">Latest news and platform updates</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
