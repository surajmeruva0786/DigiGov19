import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Upload, Plus, X, Mic, CheckCircle, User, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';

interface RegistrationProps {
  onNavigate: (page: string) => void;
  onComplete: () => void;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: string;
}

export function Registration({ onNavigate, onComplete }: RegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Address & Verification', icon: MapPin },
    { number: 3, title: 'Family Members', icon: Users },
  ];

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { id: Date.now().toString(), name: '', relationship: '', age: '' },
    ]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(
      familyMembers.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="gradient-text text-4xl">Citizen Registration</h1>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <motion.div
                  className={`flex items-center gap-3 ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                        : 'bg-white text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-500">Step {step.number}</p>
                    <p className={`text-sm ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-700"
                      initial={{ width: 0 }}
                      animate={{ width: currentStep > step.number ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Enter your personal information'}
                  {currentStep === 2 && 'Provide your address and verification details'}
                  {currentStep === 3 && 'Add your family members (optional)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        className="bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="aadhaar">Aadhaar Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="aadhaar"
                        placeholder="XXXX XXXX XXXX"
                        maxLength={14}
                        className="bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="aadhaarPhoto">Aadhaar Photo Link</Label>
                      <div className="mt-2">
                        <Input
                          id="aadhaarPhoto"
                          type="url"
                          placeholder="https://drive.google.com/file/d/..."
                          className="bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload photo to Google Drive and paste shareable link
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                        <div className="flex gap-2">
                          <Select defaultValue="+91">
                            <SelectTrigger className="w-24 bg-white/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+91">+91</SelectItem>
                              <SelectItem value="+1">+1</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="phone"
                            placeholder="XXXXXXXXXX"
                            maxLength={10}
                            className="bg-white/50 border-gray-200/50 focus:bg-white transition-all flex-1"
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                          required
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                        required
                      />
                      {password.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Password strength</span>
                            <span className={`text-xs ${passwordStrength.strength === 100 ? 'text-green-600' : passwordStrength.strength === 66 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <Progress value={passwordStrength.strength} className={passwordStrength.color} />
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                        required
                      />
                      {confirmPassword.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {passwordsMatch ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-green-600">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-red-500" />
                              <span className="text-xs text-red-600">Passwords do not match</span>
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Step 2: Address & Verification */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your complete address"
                        rows={3}
                        className="bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                        required
                      />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                        <Select>
                          <SelectTrigger className="bg-white/50 border-gray-200/50">
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="pincode">PIN Code <span className="text-red-500">*</span></Label>
                        <Input
                          id="pincode"
                          placeholder="XXXXXX"
                          maxLength={6}
                          className="bg-white/50 border-gray-200/50 focus:bg-white transition-all"
                          required
                        />
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Step 3: Family Members */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div>
                        <h3 className="text-lg">Family Members</h3>
                        <p className="text-sm text-gray-500">Add your family members (optional)</p>
                      </div>
                      <Button
                        onClick={addFamilyMember}
                        variant="outline"
                        className="bg-white/50 hover:bg-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    </motion.div>

                    {familyMembers.length === 0 ? (
                      <motion.div
                        className="text-center py-12 glass-card rounded-2xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No family members added yet</p>
                        <Button onClick={addFamilyMember} className="bg-gradient-to-r from-blue-600 to-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Member
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {familyMembers.map((member, index) => (
                          <motion.div
                            key={member.id}
                            className="p-4 glass-card rounded-2xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="relative">
                                <Label htmlFor={`name-${member.id}`}>Name</Label>
                                <div className="relative">
                                  <Input
                                    id={`name-${member.id}`}
                                    placeholder="Full name"
                                    value={member.name}
                                    onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                                    className="bg-white/50 pr-10"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                  >
                                    <Mic className="w-4 h-4 text-blue-600" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`relationship-${member.id}`}>Relationship</Label>
                                <Select
                                  value={member.relationship}
                                  onValueChange={(value) => updateFamilyMember(member.id, 'relationship', value)}
                                >
                                  <SelectTrigger className="bg-white/50">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="spouse">Spouse</SelectItem>
                                    <SelectItem value="child">Child</SelectItem>
                                    <SelectItem value="parent">Parent</SelectItem>
                                    <SelectItem value="sibling">Sibling</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <Label htmlFor={`age-${member.id}`}>Age</Label>
                                  <Input
                                    id={`age-${member.id}`}
                                    type="number"
                                    placeholder="Age"
                                    value={member.age}
                                    onChange={(e) => updateFamilyMember(member.id, 'age', e.target.value)}
                                    className="bg-white/50"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFamilyMember(member.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 bg-white/50 hover:bg-white"
                  >
                    {currentStep === 1 ? 'Cancel' : 'Previous'}
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {currentStep === 3 ? 'Complete Registration' : 'Next'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
