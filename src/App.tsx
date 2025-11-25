import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { AnimatePresence } from 'motion/react';
import { LanguageProvider } from './contexts/LanguageContext';

// Import components
import { RoleSelection } from './components/RoleSelection';
import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { ForgotPassword } from './components/ForgotPassword';
import { VoiceSetup } from './components/VoiceSetup';
import { CitizenDashboard } from './components/CitizenDashboard';
import { GovernmentSchemes } from './components/GovernmentSchemes';
import { Complaints } from './components/Complaints';
import { Applications } from './components/Applications';
import { Analytics } from './components/Analytics';
import { BillPayments } from './components/BillPayments';
import { Children } from './components/Children';
import { ChildDetail } from './components/ChildDetail';
import { DigitalIdCard } from './components/DigitalIdCard';
import { EducationAssistance } from './components/EducationAssistance';
import { HealthServices } from './components/HealthServices';
import { CitizenFeedback } from './components/CitizenFeedback';
import { Documents } from './components/Documents';
import { ErrorPage } from './components/ErrorPage';
import { OfficialLogin } from './components/OfficialLogin';
import { OfficialDashboard } from './components/OfficialDashboard';
import { OfficialAnalytics } from './components/OfficialAnalytics';
import { OfficialForgotPassword } from './components/OfficialForgotPassword';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { PageTransition } from './components/PageTransition';
import { ChatbotWidget } from './components/ChatbotWidget';
import { VoiceControlIndicator } from './components/VoiceControlIndicator';
import { VoiceControlPanel } from './components/VoiceControlPanel';

type Page =
  | 'home'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'voice-setup'
  | 'dashboard'
  | 'schemes'
  | 'complaints'
  | 'applications'
  | 'children'
  | 'child-detail'
  | 'bill-payments'
  | 'documents'
  | 'digital-id'
  | 'health'
  | 'feedback'
  | 'education'
  | 'analytics'
  | 'official-login'
  | 'official-dashboard'
  | 'official-analytics'
  | 'official-forgot-password';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOfficialAuthenticated, setIsOfficialAuthenticated] = useState(false);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const userName = 'John Doe';
  const [officialName, setOfficialName] = useState('');
  const [officialDepartment, setOfficialDepartment] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const toggleChatbot = () => setIsChatbotOpen(prev => !prev);
  const [isVoiceControlOpen, setIsVoiceControlOpen] = useState(false);



  // Force light mode
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');

  // Listen for voice control toggle event
  useEffect(() => {
    const handleToggleVoicePanel = () => {
      setIsVoiceControlOpen(prev => !prev);
    };

    window.addEventListener('toggleVoiceControl', handleToggleVoicePanel);
    return () => window.removeEventListener('toggleVoiceControl', handleToggleVoicePanel);
  }, []);

  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }, []);

  // Initial loading on app mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500); // Show loading for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: string, childId?: string) => {
    setCurrentPage(page as Page);
    if (childId) {
      setSelectedChildId(childId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setTransitionMessage('Logging you in...');
    setIsTransitioning(true);

    setTimeout(() => {
      setIsAuthenticated(true);
      setShowVoiceSetup(true);
      setIsTransitioning(false);
    }, 1500);
  };

  const handleRegistrationComplete = () => {
    setTransitionMessage('Setting up your account...');
    setIsTransitioning(true);

    setTimeout(() => {
      setIsAuthenticated(true);
      setShowVoiceSetup(true);
      setIsTransitioning(false);
    }, 1500);
  };

  const handleVoiceEnable = () => {
    setShowVoiceSetup(false);
    setCurrentPage('dashboard');
  };

  const handleVoiceSkip = () => {
    setShowVoiceSetup(false);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handleOfficialLogin = (name: string, department: string) => {
    setTransitionMessage('Accessing Official Portal...');
    setIsTransitioning(true);

    setTimeout(() => {
      setOfficialName(name);
      setOfficialDepartment(department);
      setIsOfficialAuthenticated(true);
      setCurrentPage('official-dashboard');
      setIsTransitioning(false);
    }, 1500);
  };

  const handleOfficialLogout = () => {
    setIsOfficialAuthenticated(false);
    setOfficialName('');
    setOfficialDepartment('');
    setCurrentPage('home');
  };

  const renderPage = () => {
    // Show login if not authenticated and trying to access protected citizen pages
    if (!isAuthenticated && !['home', 'login', 'register', 'forgot-password', 'official-login', 'official-dashboard', 'official-analytics', 'official-forgot-password', '404', '500'].includes(currentPage)) {
      return (
        <PageTransition key="login-redirect">
          <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        </PageTransition>
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <PageTransition key="home">
            <RoleSelection onNavigate={handleNavigate} />
          </PageTransition>
        );

      case 'login':
        return (
          <PageTransition key="login">
            <Login onLogin={handleLogin} onNavigate={handleNavigate} />
          </PageTransition>
        );

      case 'register':
        return (
          <PageTransition key="register">
            <Registration onNavigate={handleNavigate} onComplete={handleRegistrationComplete} />
          </PageTransition>
        );

      case 'forgot-password':
        return (
          <PageTransition key="forgot-password">
            <ForgotPassword onNavigate={handleNavigate} />
          </PageTransition>
        );

      case 'dashboard':
        return (
          <PageTransition key="dashboard">
            <CitizenDashboard
              onNavigate={handleNavigate}
              userName={userName}
              onLogout={handleLogout}
              onToggleChatbot={toggleChatbot}
            />
          </PageTransition>
        );

      case 'digital-id':
        return (
          <PageTransition key="digital-id">
            <DigitalIdCard userName={userName} onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'education':
        return (
          <PageTransition key="education">
            <EducationAssistance onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'health':
        return (
          <PageTransition key="health">
            <HealthServices onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'feedback':
        return (
          <PageTransition key="feedback">
            <CitizenFeedback onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'schemes':
        return (
          <PageTransition key="schemes">
            <GovernmentSchemes onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'complaints':
        return (
          <PageTransition key="complaints">
            <Complaints onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'applications':
        return (
          <PageTransition key="applications">
            <Applications onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'children':
        return (
          <PageTransition key="children">
            <Children onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'child-detail':
        return (
          <PageTransition key={`child-detail-${selectedChildId}`}>
            <ChildDetail onNavigate={handleNavigate} childId={selectedChildId} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'bill-payments':
        return (
          <PageTransition key="bill-payments">
            <BillPayments onNavigate={handleNavigate} onToggleChatbot={toggleChatbot} />
          </PageTransition>
        );

      case 'documents':
        return (
          <PageTransition key="documents">
            <Documents onNavigate={handleNavigate} />
          </PageTransition>
        );

      case 'analytics':
        return (
          <PageTransition key="analytics">
            <Analytics onNavigate={handleNavigate} />
          </PageTransition>
        );

      case 'official-login':
        return (
          <PageTransition key="official-login">
            <OfficialLogin
              onLogin={handleOfficialLogin}
              onBack={() => handleNavigate('home')}
              onForgotPassword={() => handleNavigate('official-forgot-password')}
            />
          </PageTransition>
        );

      case 'official-forgot-password':
        return (
          <PageTransition key="official-forgot-password">
            <OfficialForgotPassword
              onBack={() => handleNavigate('official-login')}
            />
          </PageTransition>
        );

      case 'official-dashboard':
        if (!isOfficialAuthenticated) {
          return (
            <PageTransition key="official-dashboard-login">
              <OfficialLogin
                onLogin={handleOfficialLogin}
                onBack={() => handleNavigate('home')}
                onForgotPassword={() => handleNavigate('official-forgot-password')}
              />
            </PageTransition>
          );
        }
        return (
          <PageTransition key="official-dashboard">
            <OfficialDashboard
              officialName={officialName}
              department={officialDepartment}
              onLogout={handleOfficialLogout}
              onShowAnalytics={() => handleNavigate('official-analytics')}
            />
          </PageTransition>
        );

      case 'official-analytics':
        if (!isOfficialAuthenticated) {
          return (
            <PageTransition key="official-analytics-login">
              <OfficialLogin
                onLogin={handleOfficialLogin}
                onBack={() => handleNavigate('home')}
                onForgotPassword={() => handleNavigate('official-forgot-password')}
              />
            </PageTransition>
          );
        }
        return (
          <PageTransition key="official-analytics">
            <OfficialAnalytics
              officialName={officialName}
              department={officialDepartment}
              onBack={() => handleNavigate('official-dashboard')}
            />
          </PageTransition>
        );

      case '404':
        return (
          <PageTransition key="404">
            <ErrorPage errorCode="404" onNavigate={handleNavigate} />
          </PageTransition>
        );

      case '500':
        return (
          <PageTransition key="500">
            <ErrorPage errorCode="500" onNavigate={handleNavigate} />
          </PageTransition>
        );

      default:
        return (
          <PageTransition key="default">
            <RoleSelection onNavigate={handleNavigate} />
          </PageTransition>
        );
    }
  };

  // Show initial loading screen
  if (isInitialLoading) {
    return (
      <LoadingScreen
        message="Initializing DigiGov Platform..."
        onComplete={() => setIsInitialLoading(false)}
        duration={2500}
      />
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen light">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>

        {showVoiceSetup && (
          <VoiceSetup onEnable={handleVoiceEnable} onSkip={handleVoiceSkip} />
        )}
        <Toaster />
        <ChatbotWidget isOpen={isChatbotOpen} onToggle={toggleChatbot} />
        <VoiceControlPanel isOpen={isVoiceControlOpen} onClose={() => setIsVoiceControlOpen(false)} />
        <VoiceControlIndicator />
      </div>
    </LanguageProvider>
  );
}

export default App;
