// All Firebase logic centralized here. Do not import Firebase elsewhere.
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  getFirestore,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

// --------------------------------------------------------------------------------
// Firebase initialization (placeholders - replace with real values via env/config)
// --------------------------------------------------------------------------------
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
const auth = getAuth(app);
const db = getFirestore(app);

// Basic console log to identify Firebase initialization in the browser
try {
  // This indicates client-side SDK is initialized with a project
  // It does not guarantee Firestore rules will allow access.
  // A deeper connectivity probe follows below.
  // eslint-disable-next-line no-console
  console.info('[Firebase] Initialized. Project:', app.options?.projectId || '(unknown)');
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('[Firebase] Initialization log failed:', e);
}

// Connectivity check helper: attempts a read to gauge Firestore reachability.
async function logFirebaseConnectivity() {
  try {
    // Read a dummy doc; it may not exist. Success means Firestore is reachable.
    // If rules deny access, you'll see a permission error which we surface.
    await getDoc(doc(db, '__health', '__ping'));
    // eslint-disable-next-line no-console
    console.info('[Firebase] Firestore reachable (read attempted).');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Firebase] Firestore not reachable:', parseFirebaseError(err));
  }
}
// Kick off connectivity probe (non-blocking)
// No top-level await; this runs in background.
void logFirebaseConnectivity();

// Public helper for on-demand connectivity checks
export async function checkFirebaseConnection() {
  try {
    await getDoc(doc(db, '__health', '__ping'));
    return buildResponse(true, 'Firestore reachable', null);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

// --------------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------------
function buildResponse(success, message, data) {
  return { success, message, data: data ?? null };
}

function parseFirebaseError(error) {
  if (!error || typeof error !== 'object') return 'Unknown error';
  const code = error.code || '';
  const message = error.message || 'Unexpected error';
  // Prefer code when available for clarity, else message
  return code ? code : message;
}

function requireAuthUid() {
  const uid = auth.currentUser?.uid || null;
  if (!uid) {
    throw new Error('auth/not-authenticated');
  }
  return uid;
}

// --------------------------------------------------------------------------------
// Authentication API
// --------------------------------------------------------------------------------
export async function registerUser(email, password, additionalData = {}) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Store user profile in Firestore
    const userProfile = {
      email,
      uid,
      createdAt: serverTimestamp(),
      ...additionalData,
    };
    await setDoc(doc(db, 'users', uid), userProfile, { merge: true });

    return buildResponse(true, 'Registration successful', { uid, email });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function loginUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return buildResponse(true, 'Login successful', {
      uid: cred.user.uid,
      email: cred.user.email,
    });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return buildResponse(true, 'Logout successful', null);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export function onAuthStateChanged(callback) {
  // Returns unsubscribe function
  return fbOnAuthStateChanged(auth, (user) => {
    if (!user) {
      callback(null);
    } else {
      callback({
        uid: user.uid,
        email: user.email,
      });
    }
  });
}

export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return buildResponse(true, 'Password reset email sent', null);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

// --------------------------------------------------------------------------------
// Government Official Authentication API
// --------------------------------------------------------------------------------

/**
 * Register a new government official
 * @param {string} email - Official government email
 * @param {string} password - Password
 * @param {object} officialData - Additional official data (name, department, role)
 */
export async function registerOfficial(email, password, officialData = {}) {
  try {
    // Validate government email domain
    const validDomains = ['gov.in', 'nic.in', 'ernet.in'];
    const domain = email.split('@')[1];
    const isValidDomain = validDomains.some(validDomain => domain?.endsWith(validDomain));

    if (!isValidDomain) {
      return buildResponse(false, 'Invalid government email domain', null);
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Store official profile in Firestore
    const officialProfile = {
      email,
      uid,
      role: 'official',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...officialData,
    };
    await setDoc(doc(db, 'officials', uid), officialProfile, { merge: true });

    return buildResponse(true, 'Official registration successful', { uid, email });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

/**
 * Login a government official
 * @param {string} email - Official government email
 * @param {string} password - Password
 */
export async function loginOfficial(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Verify this is an official account by checking the officials collection
    const officialDoc = await getDoc(doc(db, 'officials', uid));

    if (!officialDoc.exists()) {
      // Not an official account, sign out
      await signOut(auth);
      return buildResponse(false, 'This account is not registered as a government official', null);
    }

    return buildResponse(true, 'Official login successful', {
      uid: cred.user.uid,
      email: cred.user.email,
    });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

/**
 * Get official profile from Firestore
 * @param {string} uid - Official UID (optional, uses current user if not provided)
 */
export async function getOfficialProfile(uid) {
  try {
    const safeUid = uid || requireAuthUid();
    const ref = doc(db, 'officials', safeUid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return buildResponse(false, 'Official profile not found', null);
    }

    return buildResponse(true, 'Official profile fetched', { id: snap.id, ...snap.data() });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

/**
 * Helper function to create the initial official account
 * This is for development/setup purposes
 */
export async function createInitialOfficialAccount() {
  const email = 'manish@gov.in';
  const password = 'qwerty';
  const officialData = {
    name: 'Manish',
    department: 'Digital Governance',
    role: 'Administrator',
  };

  return await registerOfficial(email, password, officialData);
}


// --------------------------------------------------------------------------------
// Helper: Get user profile
// --------------------------------------------------------------------------------
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return { id: userSnap.id, ...userSnap.data() };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// --------------------------------------------------------------------------------
// Firestore: complaints
// --------------------------------------------------------------------------------
export async function submitComplaint(data) {
  try {
    const userId = requireAuthUid();
    const payload = {
      ...data,
      userId,
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      timeline: [
        {
          status: 'Submitted',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          description: 'Complaint filed by citizen'
        }
      ]
    };
    const ref = await addDoc(collection(db, 'complaints'), payload);
    return buildResponse(true, 'Complaint submitted successfully', { id: ref.id });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function getComplaints(userId) {
  try {
    const safeUid = userId || requireAuthUid();
    const q = query(
      collection(db, 'complaints'),
      where('userId', '==', safeUid),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return buildResponse(true, 'Complaints fetched', items);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function getAllComplaints() {
  try {
    // Intended for admin/official use; rely on Firestore security rules for access control
    const q = query(
      collection(db, 'complaints'),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Fetch user details for each complaint
    const itemsWithUserDetails = await Promise.all(
      items.map(async (item) => {
        if (item.userId) {
          const userProfile = await getUserProfile(item.userId);
          if (userProfile) {
            return {
              ...item,
              userName: userProfile.name || userProfile.fullName || 'Unknown',
              userPhone: userProfile.phone || userProfile.phoneNumber || 'N/A',
              userEmail: userProfile.email || 'N/A',
            };
          }
        }
        return item;
      })
    );

    return buildResponse(true, 'All complaints fetched', itemsWithUserDetails);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

// --------------------------------------------------------------------------------
// Firestore: feedback
// --------------------------------------------------------------------------------
export async function submitFeedback(formData) {
  try {
    const userId = auth.currentUser?.uid || null;
    const payload = {
      ...formData,
      userId,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, 'feedback'), payload);
    return buildResponse(true, 'Feedback submitted', { id: ref.id });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function getAllFeedback() {
  try {
    // Intended for admin use; rely on Firestore security rules for access control
    const q = query(
      collection(db, 'feedback'),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Fetch user details for each feedback
    const itemsWithUserDetails = await Promise.all(
      items.map(async (item) => {
        if (item.userId) {
          const userProfile = await getUserProfile(item.userId);
          if (userProfile) {
            return {
              ...item,
              userName: userProfile.name || userProfile.fullName || 'Unknown',
              userPhone: userProfile.phone || userProfile.phoneNumber || 'N/A',
              userEmail: userProfile.email || 'N/A',
            };
          }
        }
        return item;
      })
    );

    return buildResponse(true, 'Feedback fetched', itemsWithUserDetails);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function updateFeedbackStatus(id, status) {
  try {
    await updateDoc(doc(db, 'feedback', id), {
      status,
      updatedAt: serverTimestamp(),
    });
    return buildResponse(true, 'Feedback status updated', { id, status });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

// --------------------------------------------------------------------------------
// Firestore: educationApplications
// --------------------------------------------------------------------------------
export async function submitEducationForm(data) {
  try {
    const userId = requireAuthUid();
    const payload = {
      ...data,
      userId,
      status: 'submitted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, 'educationApplications'), payload);
    return buildResponse(true, 'Application submitted', { id: ref.id });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function getUserApplications(userId) {
  try {
    const safeUid = userId || requireAuthUid();
    const q = query(
      collection(db, 'educationApplications'),
      where('userId', '==', safeUid),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return buildResponse(true, 'Applications fetched', items);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

// --------------------------------------------------------------------------------
// Firestore: appointments
// --------------------------------------------------------------------------------
export async function bookAppointment(data) {
  try {
    const userId = requireAuthUid();
    const payload = {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, 'appointments'), payload);
    return buildResponse(true, 'Appointment booked', { id: ref.id });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function getAppointments(userId) {
  try {
    const safeUid = userId || requireAuthUid();
    // Sorting by a potential 'date' if present, else by createdAt
    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', safeUid),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return buildResponse(true, 'Appointments fetched', items);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

// --------------------------------------------------------------------------------
// Firestore: digitalIDs
// --------------------------------------------------------------------------------
export async function fetchDigitalID(userId) {
  try {
    const safeUid = userId || requireAuthUid();
    const ref = doc(db, 'digitalIDs', safeUid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return buildResponse(false, 'Digital ID not found', null);
    }
    return buildResponse(true, 'Digital ID fetched', { id: snap.id, ...snap.data() });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

// --------------------------------------------------------------------------------
// Firestore: documents
// --------------------------------------------------------------------------------
export async function addDocument(documentData) {
  try {
    const userId = requireAuthUid();
    const payload = {
      ...documentData,
      userId,
      uploadDate: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, 'documents'), payload);
    return buildResponse(true, 'Document added successfully', { id: ref.id });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function getUserDocuments(userId) {
  try {
    const safeUid = userId || requireAuthUid();
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', safeUid),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return buildResponse(true, 'Documents fetched', items);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function getAllDocuments() {
  try {
    const q = query(
      collection(db, 'documents'),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Fetch user details for each document
    const itemsWithUserDetails = await Promise.all(
      items.map(async (item) => {
        if (item.userId) {
          const userProfile = await getUserProfile(item.userId);
          if (userProfile) {
            return {
              ...item,
              userName: userProfile.name || userProfile.fullName || 'Unknown',
              userPhone: userProfile.phone || userProfile.phoneNumber || 'N/A',
              userEmail: userProfile.email || 'N/A',
            };
          }
        }
        return item;
      })
    );

    return buildResponse(true, 'All documents fetched', itemsWithUserDetails);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

export async function deleteDocument(docId) {
  try {
    const userId = requireAuthUid();
    // Verify ownership before deleting
    const docRef = doc(db, 'documents', docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return buildResponse(false, 'Document not found', null);
    }

    if (docSnap.data().userId !== userId) {
      return buildResponse(false, 'Unauthorized to delete this document', null);
    }

    await deleteDoc(docRef);
    return buildResponse(true, 'Document deleted successfully', { id: docId });
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}

// --------------------------------------------------------------------------------
// Firestore: feedback (additional function)
// --------------------------------------------------------------------------------
export async function getUserFeedback(userId) {
  try {
    const safeUid = userId || requireAuthUid();
    const q = query(
      collection(db, 'feedback'),
      where('userId', '==', safeUid),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return buildResponse(true, 'User feedback fetched', items);
  } catch (error) {
    return buildResponse(false, parseFirebaseError(error), null);
  }
}



