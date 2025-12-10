# DigiGov19 - Digital Government Services Portal

A comprehensive digital government services platform built with React, TypeScript, and Firebase, providing citizens with seamless access to government services and enabling officials to manage applications efficiently.

## 🌟 Features

### For Citizens

#### 1. **Dashboard**
- Personalized welcome with user statistics
- Quick access to all services
- Real-time notifications
- Multi-language support (English/Hindi)
- Voice-enabled navigation

#### 2. **Government Schemes**
- Browse available government schemes
- Filter by state and category
- Detailed scheme information (benefits, eligibility)
- Apply for schemes with complete form
- Track application status

#### 3. **Complaints Management**
- File complaints across multiple departments
- Track complaint status in real-time
- View official responses
- Status timeline visualization
- AI-powered suggestions for complaint descriptions

#### 4. **Document Services**
- Request government documents (Birth Certificate, Income Certificate, etc.)
- Upload supporting documents via Google Drive links
- Track document request status
- Download approved documents

#### 5. **Scholarship Applications**
- Apply for educational scholarships
- Complete application forms with all details
- Track application status
- View approval/rejection status

#### 6. **Citizen Feedback**
- Submit feedback on government services
- Categorize feedback (Complaint, Suggestion, Compliment, Inquiry)
- Priority levels (Low, Medium, High)
- Track feedback status
- AI-powered suggestions for feedback descriptions

#### 7. **Bill Payments**
- Pay utility bills (Electricity, Water, Gas)
- Secure payment processing
- Payment history tracking

#### 8. **Children Services**
- Manage child records
- Education-related services
- Child welfare programs

#### 9. **Health Services**
- Book appointments
- View health records
- Access health schemes

#### 10. **Digital ID Card**
- View digital identity card
- QR code for verification
- Downloadable format

#### 11. **Analytics**
- Personal service usage statistics
- Application trends
- Visual charts and graphs

### For Government Officials

#### 1. **Official Dashboard**
- Overview of all citizen applications
- Statistics and analytics
- Quick action buttons

#### 2. **Application Management**
- Review citizen applications
- Approve/Reject applications
- Add comments and feedback
- Filter by status and type

#### 3. **Complaint Management**
- View all citizen complaints
- Assign to departments
- Update status
- Provide official responses

#### 4. **Document Verification**
- Review document requests
- Verify supporting documents
- Approve/Reject requests

#### 5. **Feedback Management**
- View citizen feedback
- Respond to feedback
- Track resolution status

#### 6. **Analytics & Reports**
- Generate reports
- View trends and statistics
- Export data

## 🚀 Advanced Features

### 1. **AI-Powered Suggestions**
Powered by Google Gemini AI:
- **Smart Complaint Descriptions**: Get AI-generated suggestions while writing complaints
- **Feedback Assistance**: AI helps formulate clear and effective feedback
- **Real-time Suggestions**: Suggestions appear as you type
- **Context-Aware**: Suggestions based on selected department/category

### 2. **Voice Assistant**
Complete voice-enabled navigation:
- **Navigation Commands**: "Go to complaints", "Show my documents"
- **Form Filling**: "Fill my name as Rajesh Kumar"
- **Actions**: "Submit form", "Go back"
- **All Service Modules**: Voice access to all 11 service modules
- **Hands-Free Operation**: Complete website navigation via voice

### 3. **Real-Time Search**
- **Global Search**: Search across schemes, complaints, documents, and applications
- **Debounced Search**: Optimized with 300ms delay
- **Categorized Results**: Results grouped by type
- **Instant Navigation**: Click to navigate to results
- **Fuzzy Matching**: Find results even with typos

### 4. **Multi-Language Support**
- **English & Hindi**: Complete translation support
- **Instant Switching**: Change language from dropdown
- **Persistent Preference**: Language choice saved in localStorage
- **400+ Translations**: Comprehensive coverage of all UI text

### 5. **Real-Time Notifications**
- **Firebase Integration**: Real-time notification updates
- **Categorized Notifications**: Success, Info, Warning, Error
- **Mark as Read**: Individual or bulk actions
- **Delete Notifications**: Clean up notification panel

### 6. **Responsive Design**
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large tap targets and gestures
- **Progressive Web App**: Can be installed on devices

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Radix UI** - Accessible component primitives

### Backend & Services
- **Firebase 10.14.0**
  - Authentication (Email/Password)
  - Firestore Database (Real-time)
  - Cloud Storage (Document uploads)
- **Google Gemini AI** - AI-powered suggestions
- **Web Speech API** - Voice recognition

### Key Libraries
- **React Hook Form** - Form management
- **Sonner** - Toast notifications
- **CMDK** - Command menu
- **Class Variance Authority** - Component variants
- **Embla Carousel** - Carousels

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Google Gemini API key

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/DigiGov19.git
cd DigiGov19
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Configure Firebase**

Update `src/firebase.js` with your Firebase configuration:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

5. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

6. **Build for Production**
```bash
npm run build
```

## 🗄️ Firebase Setup

### Firestore Collections

The application uses the following Firestore collections:

1. **users** - User profiles and data
2. **complaints** - Citizen complaints
3. **documents** - Document requests
4. **applications** - Scholarship applications
5. **feedback** - Citizen feedback
6. **notifications** - User notifications
7. **schemes** - Government schemes (optional)

### Security Rules

Ensure proper Firestore security rules are configured to protect user data.

## 🎯 Usage

### For Citizens

1. **Register/Login**
   - Create account with email and password
   - Complete profile with Aadhaar details
   - Add family members (optional)

2. **Navigate Services**
   - Use dashboard quick stats
   - Click service modules
   - Use search bar for quick access
   - Use voice commands

3. **Apply for Services**
   - Fill application forms
   - Upload required documents
   - Track application status

4. **Track Progress**
   - View notifications
   - Check application status
   - View analytics

### For Officials

1. **Login**
   - Use official credentials
   - Access official dashboard

2. **Manage Applications**
   - Review pending applications
   - Approve/Reject with comments
   - Update status

3. **Respond to Complaints**
   - View complaints by department
   - Add official responses
   - Update resolution status

## 🎤 Voice Commands

### Navigation
- "Go to dashboard"
- "Open complaints"
- "Show my documents"
- "Go to schemes"
- "View my applications"
- "Give feedback"
- "Show my digital ID"

### Form Filling
- "Fill my name as [name]"
- "Enter phone number [number]"
- "Set amount to [amount]"

### Actions
- "Submit form"
- "Go back"
- "Cancel"

See [Voice Assistant Guide](./voice_assistant_guide.md) for complete list.

## 🌐 Multi-Language

Switch between English and Hindi:
- Click language dropdown in navbar
- Select preferred language
- Entire website translates instantly
- Preference saved automatically

## 🔍 Search Functionality

Global search across all services:
- Type in search bar
- Results appear in real-time
- Click result to navigate
- Searches: Schemes, Complaints, Documents, Applications

## 🤖 AI Features

### Gemini AI Integration
- **Smart Suggestions**: AI-powered text suggestions
- **Context-Aware**: Based on selected category/department
- **Real-Time**: Suggestions as you type
- **Easy to Use**: Click chip to insert suggestion

## 📱 Responsive Design

Optimized for:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (375px+)

## 🔐 Security Features

- Firebase Authentication
- Secure data storage
- User-specific data access
- Protected routes
- Input validation
- XSS protection

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Smooth Animations**: Framer Motion animations
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Accessibility**: ARIA labels and keyboard navigation

## 📊 Analytics

Track your service usage:
- Application statistics
- Complaint trends
- Document requests
- Visual charts (Recharts)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Government of India for inspiration
- Firebase for backend services
- Google Gemini AI for AI capabilities
- Radix UI for accessible components
- Shadcn/ui for component designs

## 📞 Support

For support, email support@digigov19.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] More languages (Tamil, Telugu, etc.)
- [ ] Biometric authentication
- [ ] Offline mode
- [ ] Advanced analytics
- [ ] Integration with more government services

---

**Made with ❤️ for Digital India**
