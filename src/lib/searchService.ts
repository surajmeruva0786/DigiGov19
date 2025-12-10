import { collection, query, where, getDocs, orderBy, limit, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

// Get Firestore instance
const firebaseConfig = {
    apiKey: "AIzaSyDb5KCyZI4gxaPqx4DZQQfxlGbU7YSspbo",
    authDomain: "digigov19.firebaseapp.com",
    projectId: "digigov19",
    storageBucket: "digigov19.firebasestorage.app",
    messagingSenderId: "690080012169",
    appId: "1:690080012169:web:7108e44a0fd31541c5f358",
    measurementId: "G-XTLL085NQC"
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface SearchResult {
    id: string;
    type: 'scheme' | 'complaint' | 'document' | 'application';
    title: string;
    description: string;
    status?: string;
    date?: string;
    icon?: string;
}

/**
 * Search across all services
 */
export async function searchAll(searchQuery: string, userId?: string): Promise<SearchResult[]> {
    if (!searchQuery || searchQuery.trim().length < 2) {
        return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    try {
        // Search in parallel
        const [schemes, complaints, documents, applications] = await Promise.all([
            searchSchemes(query),
            searchComplaints(query, userId),
            searchDocuments(query, userId),
            searchApplications(query, userId),
        ]);

        // Combine and limit results (top 2-3 per category)
        results.push(...schemes.slice(0, 3));
        results.push(...complaints.slice(0, 2));
        results.push(...documents.slice(0, 2));
        results.push(...applications.slice(0, 2));

        return results;
    } catch (error) {
        console.error('Error searching:', error);
        return [];
    }
}

/**
 * Search government schemes
 */
async function searchSchemes(searchQuery: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    // Predefined schemes (since they're not in Firestore)
    const schemes = [
        {
            id: '1',
            name: 'प्रधानमंत्री छात्रवृत्ति योजना',
            nameEn: 'Prime Minister Scholarship Scheme',
            description: 'छात्रों के लिए वित्तीय सहायता',
            category: 'Education',
        },
        {
            id: '2',
            name: 'आयुष्मान भारत योजना',
            nameEn: 'Ayushman Bharat Scheme',
            description: 'स्वास्थ्य बीमा योजना',
            category: 'Health',
        },
        {
            id: '3',
            name: 'प्रधानमंत्री आवास योजना',
            nameEn: 'Pradhan Mantri Awas Yojana',
            description: 'किफायती आवास योजना',
            category: 'Housing',
        },
        {
            id: '4',
            name: 'मुद्रा योजना',
            nameEn: 'MUDRA Yojana',
            description: 'लघु व्यवसाय ऋण',
            category: 'Business',
        },
        {
            id: '5',
            name: 'बेटी बचाओ बेटी पढ़ाओ',
            nameEn: 'Beti Bachao Beti Padhao',
            description: 'बालिका सशक्तिकरण',
            category: 'Women',
        },
        {
            id: '6',
            name: 'प्रधानमंत्री किसान सम्मान निधि',
            nameEn: 'PM-KISAN',
            description: 'किसानों के लिए वित्तीय सहायता',
            category: 'Agriculture',
        },
    ];

    // Filter schemes based on search query
    const filtered = schemes.filter((scheme) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            scheme.name.toLowerCase().includes(searchLower) ||
            scheme.nameEn.toLowerCase().includes(searchLower) ||
            scheme.description.toLowerCase().includes(searchLower) ||
            scheme.category.toLowerCase().includes(searchLower)
        );
    });

    return filtered.map((scheme) => ({
        id: scheme.id,
        type: 'scheme',
        title: scheme.nameEn,
        description: scheme.description,
        status: scheme.category,
    }));
}

/**
 * Search user's complaints
 */
async function searchComplaints(searchQuery: string, userId?: string): Promise<SearchResult[]> {
    if (!userId) return [];

    try {
        const complaintsRef = collection(db, 'complaints');
        const q = query(
            complaintsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        const snapshot = await getDocs(q);
        const complaints = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Filter by search query
        const filtered = complaints.filter((complaint: any) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                complaint.subject?.toLowerCase().includes(searchLower) ||
                complaint.description?.toLowerCase().includes(searchLower) ||
                complaint.department?.toLowerCase().includes(searchLower) ||
                complaint.status?.toLowerCase().includes(searchLower)
            );
        });

        return filtered.map((complaint: any) => ({
            id: complaint.id,
            type: 'complaint',
            title: complaint.subject || 'Complaint',
            description: complaint.department || '',
            status: complaint.status,
            date: complaint.createdAt?.toDate?.()?.toLocaleDateString() || '',
        }));
    } catch (error) {
        console.error('Error searching complaints:', error);
        return [];
    }
}

/**
 * Search user's documents
 */
async function searchDocuments(searchQuery: string, userId?: string): Promise<SearchResult[]> {
    if (!userId) return [];

    try {
        const documentsRef = collection(db, 'documents');
        const q = query(
            documentsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        const snapshot = await getDocs(q);
        const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Filter by search query
        const filtered = documents.filter((doc: any) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                doc.documentType?.toLowerCase().includes(searchLower) ||
                doc.purpose?.toLowerCase().includes(searchLower) ||
                doc.status?.toLowerCase().includes(searchLower)
            );
        });

        return filtered.map((doc: any) => ({
            id: doc.id,
            type: 'document',
            title: doc.documentType || 'Document',
            description: doc.purpose || '',
            status: doc.status,
            date: doc.createdAt?.toDate?.()?.toLocaleDateString() || '',
        }));
    } catch (error) {
        console.error('Error searching documents:', error);
        return [];
    }
}

/**
 * Search user's scholarship applications
 */
async function searchApplications(searchQuery: string, userId?: string): Promise<SearchResult[]> {
    if (!userId) return [];

    try {
        const applicationsRef = collection(db, 'scholarshipApplications');
        const q = query(
            applicationsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        const snapshot = await getDocs(q);
        const applications = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Filter by search query
        const filtered = applications.filter((app: any) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                app.schemeName?.toLowerCase().includes(searchLower) ||
                app.studentName?.toLowerCase().includes(searchLower) ||
                app.status?.toLowerCase().includes(searchLower) ||
                app.course?.toLowerCase().includes(searchLower)
            );
        });

        return filtered.map((app: any) => ({
            id: app.id,
            type: 'application',
            title: app.schemeName || 'Scholarship Application',
            description: app.course || app.studentName || '',
            status: app.status,
            date: app.createdAt?.toDate?.()?.toLocaleDateString() || '',
        }));
    } catch (error) {
        console.error('Error searching applications:', error);
        return [];
    }
}
