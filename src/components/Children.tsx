import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Mic, Flame, Calendar, Eye, MessageSquareText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { addChild, getUserChildren } from '../firebase';
import { toast } from 'sonner';

interface Child {
  id: string;
  name: string;
  age: number;
  school: string;
  grade: string;
  attendanceStreak: number;
  upcomingVaccination: string;
}

interface ChildrenProps {
  onNavigate: (page: string, childId?: string) => void;
  onToggleChatbot?: () => void;
}

export function Children({ onNavigate, onToggleChatbot }: ChildrenProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    school: '',
    grade: '',
  });

  // Fetch children from Firestore on mount
  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      try {
        const result = await getUserChildren();
        if (result.success) {
          setChildren(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const handleAddChild = async () => {
    if (formData.name && formData.age && formData.school && formData.grade) {
      setSubmitting(true);
      const childData = {
        name: formData.name,
        age: parseInt(formData.age),
        school: formData.school,
        grade: formData.grade,
        attendanceStreak: 0,
        upcomingVaccination: 'Not scheduled',
      };

      try {
        const result = await addChild(childData);
        if (result.success) {
          toast.success('Child added successfully!');
          // Refresh children list
          const updatedChildren = await getUserChildren();
          if (updatedChildren.success) {
            setChildren(updatedChildren.data || []);
          }
          setFormData({ name: '', age: '', school: '', grade: '' });
          setShowAddForm(false);
        } else {
          toast.error(result.message || 'Failed to add child');
        }
      } catch (error) {
        toast.error('An error occurred while adding child');
        console.error('Error adding child:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', age: '', school: '', grade: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('dashboard')}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="gradient-text text-4xl">Children</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Child
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
        </motion.div>

        {/* Add Child Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Add New Child</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="childName">Child Name</Label>
                      <div className="relative">
                        <Input
                          id="childName"
                          placeholder="Enter child's name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pr-12"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Mic className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="childAge">Age</Label>
                      <Input
                        id="childAge"
                        type="number"
                        placeholder="Enter age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schoolName">School Name</Label>
                      <div className="relative">
                        <Input
                          id="schoolName"
                          placeholder="Enter school name"
                          value={formData.school}
                          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                          className="pr-12"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Mic className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Class/Grade</Label>
                      <Input
                        id="grade"
                        placeholder="Enter class/grade"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddChild}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      Add Child
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Children Grid */}
        {children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card hover:shadow-xl transition-all group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl">{child.name}</CardTitle>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Age: {child.age} years</p>
                      <p>School: {child.school}</p>
                      <p>Grade: {child.grade}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quick Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <Flame className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Attendance Streak</p>
                          <p className="font-semibold">{child.attendanceStreak} days</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Upcoming Vaccination</p>
                          <p className="font-semibold">{child.upcomingVaccination}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => onNavigate('child-detail', child.id)}
                      variant="outline"
                      className="w-full group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-300 transition-all"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty State
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-16 h-16 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl mb-2">No children added yet</h3>
            <p className="text-gray-600 mb-6">Start managing your children's records</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Child
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
