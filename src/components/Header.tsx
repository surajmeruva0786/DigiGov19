import { useState, useEffect } from 'react';
import { Search, Globe, Menu, User, Bell, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onSearch: (query: string) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ onNavigate, currentPage, onSearch, isAuthenticated, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('EN');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onNavigate('search');
    }
  };

  const menuItems = [
    { label: 'Home', page: 'home', id: 'menu-home' },
    { label: 'Services', page: 'home', id: 'menu-services' },
    { label: 'Education', page: 'education', id: 'menu-education' },
    { label: 'Health', page: 'health', id: 'menu-health' },
    { label: 'Feedback', page: 'feedback', id: 'menu-feedback' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-card shadow-lg'
          : 'bg-white/80 backdrop-blur-md border-b border-white/20'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="ml-3 gradient-text">DigiGov</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.page)}
                className={`relative px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.page
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {currentPage === item.page && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Search, Language, Notifications, Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search */}
            <motion.form
              onSubmit={handleSearch}
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:bg-white transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </motion.form>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-white/50">
                  <Globe className="w-4 h-4 mr-2" />
                  {language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card">
                <DropdownMenuItem onClick={() => setLanguage('EN')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ES')}>Español</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('FR')}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('AR')}>العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="relative hover:bg-white/50">
                    <Bell className="w-5 h-5" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-lg">
                      3
                    </Badge>
                  </Button>
                </motion.div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" className="hover:bg-white/50">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card">
                    <DropdownMenuItem onClick={() => onNavigate('profile')}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('digital-id')}>
                      Digital ID Card
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => onNavigate('login')} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-white/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden pb-4 border-t border-gray-200/50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.form
                onSubmit={handleSearch}
                className="my-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </motion.form>
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.page);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-2 rounded-lg ${
                      currentPage === item.page
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {isAuthenticated ? (
                  <>
                    <motion.button
                      onClick={() => {
                        onNavigate('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      My Profile
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        onNavigate('digital-id');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Digital ID Card
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    Login
                  </motion.button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
