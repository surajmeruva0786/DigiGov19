import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  Eye,
  Download,
  Trash2,
  FileText,
  File,
  FileImage,
  Award,
  CreditCard,
  GraduationCap,
  Home,
  Heart,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

interface DocumentsProps {
  onNavigate: (page: string) => void;
}

interface Document {
  id: string;
  type: string;
  name: string;
  uploadDate: string;
  fileSize: string;
  category: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
}

export function Documents({ onNavigate }: DocumentsProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [deleteDocumentItem, setDeleteDocumentItem] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentLink, setDocumentLink] = useState('');

  const documentTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card', category: 'aadhaar' },
    { value: 'pan', label: 'PAN Card', category: 'other' },
    { value: 'ration', label: 'Ration Card', category: 'ration' },
    { value: 'birth', label: 'Birth Certificate', category: 'certificates' },
    { value: 'education', label: 'Education Certificate', category: 'certificates' },
    { value: 'income', label: 'Income Certificate', category: 'certificates' },
    { value: 'caste', label: 'Caste Certificate', category: 'certificates' },
    { value: 'residence', label: 'Residence Certificate', category: 'certificates' },
    { value: 'passport', label: 'Passport', category: 'other' },
    { value: 'voter', label: 'Voter ID', category: 'other' },
    { value: 'driving', label: 'Driving License', category: 'other' },
    { value: 'medical', label: 'Medical Certificate', category: 'other' },
  ];

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { getUserDocuments } = await import('../firebase');
      const result = await getUserDocuments();

      console.log('getUserDocuments result:', result); // Debug log

      if (result.success) {
        setDocuments(result.data || []);
        console.log('Documents loaded:', result.data?.length || 0); // Debug log
      } else {
        console.error('Failed to load documents:', result.message); // Debug log
        toast.error(result.message || 'Failed to load documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error(`Error loading documents: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      'Aadhaar Card': CreditCard,
      'Ration Card': Home,
      'Birth Certificate': Award,
      'Education Certificate': GraduationCap,
      'PAN Card': CreditCard,
      'Voter ID': CreditCard,
      'Income Certificate': Briefcase,
      'Medical Certificate': Heart,
    };
    const Icon = iconMap[type] || FileText;
    return Icon;
  };

  const handleUpload = async () => {
    if (!documentType || !documentName || !documentLink) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate URL
    try {
      new URL(documentLink);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsUploading(true);
    try {
      const { addDocument } = await import('../firebase');
      const typeInfo = documentTypes.find(t => t.value === documentType);

      const documentData = {
        type: typeInfo?.label || documentType,
        name: documentName,
        category: typeInfo?.category || 'other',
        fileUrl: documentLink,
        fileType: 'pdf',
        fileSize: 'Link',
      };

      const result = await addDocument(documentData);

      if (result.success) {
        toast.success('Document added successfully!');
        setDocumentType('');
        setDocumentName('');
        setDocumentLink('');
        setShowUploadForm(false);
        // Refresh documents list
        fetchDocuments();
      } else {
        toast.error(result.message || 'Failed to add document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (doc: Document) => {
    try {
      const { deleteDocument } = await import('../firebase');
      const result = await deleteDocument(doc.id);

      if (result.success) {
        toast.success('Document deleted successfully');
        setDeleteDocumentItem(null);
        setPreviewDocument(null);
        // Refresh documents list
        fetchDocuments();
      } else {
        toast.error(result.message || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading ${doc.name}...`);
  };

  const filteredDocuments = documents.filter(doc =>
    selectedCategory === 'all' || doc.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('dashboard')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-gray-900">Documents</h1>
                <p className="text-sm text-gray-600">Manage your documents</p>
              </div>
            </div>

            <Button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Form */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="border-2 border-blue-200 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900">Upload New Document</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowUploadForm(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Document Type */}
                    <div className="space-y-2">
                      <Label htmlFor="doc-type" className="text-gray-700">Document Type *</Label>
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger id="doc-type">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Document Name */}
                    <div className="space-y-2">
                      <Label htmlFor="doc-name" className="text-gray-700">Document Name *</Label>
                      <Input
                        id="doc-name"
                        placeholder="Enter document name"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Document Link */}
                  <div className="space-y-2">
                    <Label htmlFor="doc-link" className="text-gray-700">Document Link (Google Drive) *</Label>
                    <Input
                      id="doc-link"
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={documentLink}
                      onChange={(e) => setDocumentLink(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Upload your document to Google Drive and paste the shareable link here</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowUploadForm(false);
                        setDocumentType('');
                        setDocumentName('');
                        setDocumentLink('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Document
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl bg-white shadow-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="aadhaar">Aadhaar</TabsTrigger>
            <TabsTrigger value="ration">Ration</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Documents Grid */}
        {isLoading ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-16 h-16 text-blue-500 mb-4 animate-spin" />
              <p className="text-gray-600">Loading documents...</p>
            </CardContent>
          </Card>
        ) : filteredDocuments.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600 mb-4">
                Upload your first document to get started
              </p>
              <Button
                onClick={() => setShowUploadForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => {
              const Icon = getDocumentIcon(doc.type);
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="cursor-pointer hover:shadow-xl transition-shadow border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {doc.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-gray-900 mb-2 line-clamp-2">{doc.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{doc.uploadDate}</span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setPreviewDocument(doc)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteDocumentItem(doc)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-5xl h-[80vh]" aria-describedby="document-preview-description">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{previewDocument?.name}</DialogTitle>
          </DialogHeader>
          <p id="document-preview-description" className="sr-only">Preview and details of the selected document</p>

          {previewDocument && (
            <div className="grid md:grid-cols-3 gap-6 h-full">
              {/* Preview Area */}
              <div className="md:col-span-2 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {previewDocument.fileType === 'pdf' ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <FileText className="w-24 h-24 text-red-500 mb-4" />
                    <p className="text-gray-900 mb-2">PDF Document</p>
                    <p className="text-sm text-gray-600 mb-4">
                      PDF preview not available
                    </p>
                    <Button
                      onClick={() => handleDownload(previewDocument)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src="https://images.unsplash.com/photo-1554224311-beee4ced5577?w=800"
                      alt={previewDocument.name}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                )}
              </div>

              {/* Details Sidebar */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Document Type</Label>
                    <p className="text-gray-900">{previewDocument.type}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Upload Date</Label>
                    <p className="text-gray-900">{previewDocument.uploadDate}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">File Size</Label>
                    <p className="text-gray-900">{previewDocument.fileSize}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Category</Label>
                    <Badge className="mt-1 bg-blue-100 text-blue-700">
                      {previewDocument.category}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => handleDownload(previewDocument)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setDeleteDocumentItem(previewDocument);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDocumentItem} onOpenChange={() => setDeleteDocumentItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDocumentItem?.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDocumentItem && handleDelete(deleteDocumentItem)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
