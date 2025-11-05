import { Search, FileText, ExternalLink, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface SearchResultsProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onNavigate: (page: string) => void;
}

export function SearchResults({ searchQuery, onSearch, onNavigate }: SearchResultsProps) {
  const searchResults = [
    {
      title: 'Digital ID Card Services',
      description: 'Access and manage your digital identification card. View, download, and share your verified digital ID with government services.',
      category: 'Identity Services',
      page: 'digital-id',
      relevance: 95,
    },
    {
      title: 'Health Services - Book Appointments',
      description: 'Schedule medical appointments, access health records, and connect with healthcare providers through our digital platform.',
      category: 'Health',
      page: 'health',
      relevance: 88,
    },
    {
      title: 'Education Assistance Programs',
      description: 'Apply for educational grants, scholarships, and financial assistance programs for K-12 through graduate education.',
      category: 'Education',
      page: 'education',
      relevance: 82,
    },
    {
      title: 'Submit Citizen Feedback',
      description: 'Share your feedback, suggestions, and concerns about government services. Track your submissions and receive responses.',
      category: 'Feedback',
      page: 'feedback',
      relevance: 75,
    },
    {
      title: 'Account Settings and Profile',
      description: 'Manage your account settings, update personal information, and customize your DigiGov experience.',
      category: 'Account',
      page: 'profile',
      relevance: 70,
    },
  ];

  const relatedSearches = [
    'digital id verification',
    'healthcare appointments',
    'education grants',
    'government services',
    'citizen portal',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Search */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('dashboard')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="mb-0">Search Results</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for services..."
            defaultValue={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-12 text-lg h-14"
          />
        </div>
        <p className="text-gray-600 mt-3">
          Found {searchResults.length} results for "{searchQuery}"
        </p>
      </div>

      {/* Search Results */}
      <div className="space-y-4 mb-8">
        {searchResults.map((result, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-blue-600 hover:underline" onClick={() => onNavigate(result.page)}>
                      {result.title}
                    </h3>
                    <Badge variant="secondary">{result.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{result.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>Relevance: {result.relevance}%</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate(result.page)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Related Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Related Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {relatedSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSearch(search)}
              >
                {search}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-blue-900 mb-2">Can't find what you're looking for?</h3>
        <p className="text-blue-800 mb-4">
          Try refining your search or contact our support team for assistance.
        </p>
        <div className="flex gap-3">
          <Button variant="outline">Contact Support</Button>
          <Button variant="outline" onClick={() => onNavigate('feedback')}>
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
