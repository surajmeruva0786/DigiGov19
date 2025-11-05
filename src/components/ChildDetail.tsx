import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Flame,
  Check,
  Bell,
  Download,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Video,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ChildDetailProps {
  onNavigate: (page: string) => void;
  childId?: string;
}

interface Vaccination {
  id: string;
  name: string;
  dueDate: string;
  status: 'completed' | 'upcoming';
}

interface LearningResource {
  id: string;
  title: string;
  type: 'PDF' | 'Link' | 'Video';
  url: string;
}

export function ChildDetail({ onNavigate, childId }: ChildDetailProps) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [attendanceStreak, setAttendanceStreak] = useState(12);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [vaccinations, setVaccinations] = useState<Vaccination[]>([
    { id: '1', name: 'MMR (Measles, Mumps, Rubella)', dueDate: 'Oct 15, 2024', status: 'completed' },
    { id: '2', name: 'Polio Booster', dueDate: 'Dec 15, 2024', status: 'upcoming' },
    { id: '3', name: 'Hepatitis B', dueDate: 'Jan 20, 2025', status: 'upcoming' },
  ]);

  const [resources, setResources] = useState<LearningResource[]>([
    { id: '1', title: 'Mathematics Workbook Grade 3', type: 'PDF', url: '#' },
    { id: '2', title: 'Science Educational Videos', type: 'Video', url: '#' },
    { id: '3', title: 'Reading Comprehension Exercises', type: 'Link', url: '#' },
  ]);

  const [vaccineForm, setVaccineForm] = useState({
    name: '',
    dueDate: '',
  });

  const [resourceForm, setResourceForm] = useState({
    title: '',
    type: 'PDF' as 'PDF' | 'Link' | 'Video',
    url: '',
  });

  // Mock attendance data for calendar
  const attendanceDays = [1, 3, 4, 5, 8, 10, 11, 12, 15, 17, 18, 19, 22, 24];

  const handleMarkAttendance = () => {
    setAttendanceStreak(attendanceStreak + 1);
  };

  const handleAddVaccination = () => {
    if (vaccineForm.name && vaccineForm.dueDate) {
      const newVaccination: Vaccination = {
        id: Date.now().toString(),
        name: vaccineForm.name,
        dueDate: vaccineForm.dueDate,
        status: 'upcoming',
      };
      setVaccinations([...vaccinations, newVaccination]);
      setVaccineForm({ name: '', dueDate: '' });
      setShowVaccineForm(false);
    }
  };

  const handleAddResource = () => {
    if (resourceForm.title && resourceForm.url) {
      const newResource: LearningResource = {
        id: Date.now().toString(),
        title: resourceForm.title,
        type: resourceForm.type,
        url: resourceForm.url,
      };
      setResources([...resources, newResource]);
      setResourceForm({ title: '', type: 'PDF', url: '' });
      setShowResourceForm(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5" />;
      case 'Link':
        return <LinkIcon className="w-5 h-5" />;
      case 'Video':
        return <Video className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('children')}
            className="hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="gradient-text text-4xl">Sarah Johnson</h1>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Streak Display */}
              <Card className="glass-card md:col-span-1">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                        <Flame className="w-12 h-12 text-orange-500 mb-2" />
                        <span className="text-3xl gradient-text">{attendanceStreak}</span>
                        <span className="text-sm text-gray-600">days</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleMarkAttendance}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Mark Today's Attendance
                  </Button>
                </CardContent>
              </Card>

              {/* Calendar View */}
              <Card className="glass-card md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                          )
                        }
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                          )
                        }
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const isPresent = attendanceDays.includes(day);
                      return (
                        <div
                          key={day}
                          className={`aspect-square flex items-center justify-center rounded-lg text-sm relative ${
                            isPresent
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {day}
                          {isPresent && (
                            <div className="absolute bottom-1 w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Vaccination Tab */}
          <TabsContent value="vaccination" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-end mb-6">
                <Button
                  onClick={() => setShowVaccineForm(!showVaccineForm)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Vaccination
                </Button>
              </div>

              {/* Add Vaccine Form */}
              <AnimatePresence>
                {showVaccineForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Add Vaccination Record</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="vaccineName">Vaccine Name</Label>
                          <Select
                            value={vaccineForm.name}
                            onValueChange={(value) =>
                              setVaccineForm({ ...vaccineForm, name: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select vaccine" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MMR">MMR (Measles, Mumps, Rubella)</SelectItem>
                              <SelectItem value="Polio">Polio</SelectItem>
                              <SelectItem value="Hepatitis A">Hepatitis A</SelectItem>
                              <SelectItem value="Hepatitis B">Hepatitis B</SelectItem>
                              <SelectItem value="DTaP">DTaP (Diphtheria, Tetanus, Pertussis)</SelectItem>
                              <SelectItem value="Varicella">Varicella (Chickenpox)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={vaccineForm.dueDate}
                            onChange={(e) =>
                              setVaccineForm({ ...vaccineForm, dueDate: e.target.value })
                            }
                          />
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                          <Button variant="outline" onClick={() => setShowVaccineForm(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddVaccination}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                          >
                            Submit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Vaccination Timeline */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Vaccination Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vaccinations.map((vaccination, index) => (
                      <motion.div
                        key={vaccination.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-white/50 rounded-lg"
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            vaccination.status === 'completed'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                              : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                          }`}
                        >
                          {vaccination.status === 'completed' ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : (
                            <Bell className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{vaccination.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">Due: {vaccination.dueDate}</p>
                          <Badge
                            variant={vaccination.status === 'completed' ? 'default' : 'secondary'}
                            className={
                              vaccination.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {vaccination.status === 'completed' ? 'Completed' : 'Upcoming'}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Learning Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-end mb-6">
                <Button
                  onClick={() => setShowResourceForm(!showResourceForm)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Resource
                </Button>
              </div>

              {/* Add Resource Form */}
              <AnimatePresence>
                {showResourceForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Add Learning Resource</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="resourceTitle">Title</Label>
                          <Input
                            id="resourceTitle"
                            placeholder="Enter resource title"
                            value={resourceForm.title}
                            onChange={(e) =>
                              setResourceForm({ ...resourceForm, title: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="resourceType">Type</Label>
                          <Select
                            value={resourceForm.type}
                            onValueChange={(value: 'PDF' | 'Link' | 'Video') =>
                              setResourceForm({ ...resourceForm, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PDF">PDF</SelectItem>
                              <SelectItem value="Link">Link</SelectItem>
                              <SelectItem value="Video">Video</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="resourceUrl">
                            {resourceForm.type === 'PDF' ? 'Document Link (Google Drive)' : 'URL'}
                          </Label>
                          <Input
                            id="resourceUrl"
                            type="url"
                            placeholder={
                              resourceForm.type === 'PDF'
                                ? 'https://drive.google.com/file/d/...'
                                : 'Enter URL'
                            }
                            value={resourceForm.url}
                            onChange={(e) =>
                              setResourceForm({ ...resourceForm, url: e.target.value })
                            }
                          />
                          {resourceForm.type === 'PDF' && (
                            <p className="text-xs text-gray-500">Upload your PDF to Google Drive and paste the shareable link</p>
                          )}
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                          <Button variant="outline" onClick={() => setShowResourceForm(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddResource}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                          >
                            Submit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card hover:shadow-xl transition-all group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              resource.type === 'PDF'
                                ? 'bg-gradient-to-br from-red-500 to-pink-500'
                                : resource.type === 'Video'
                                ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                            }`}
                          >
                            <div className="text-white">{getResourceIcon(resource.type)}</div>
                          </div>
                          <Badge variant="secondary">{resource.type}</Badge>
                        </div>
                        <h4 className="font-semibold mb-4">{resource.title}</h4>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-300"
                        >
                          {resource.type === 'PDF' ? (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
