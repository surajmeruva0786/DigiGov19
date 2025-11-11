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
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
    return buildResponse(true, 'Feedback fetched', items);
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

// Optional: export a minimal read-only helper for diagnostics if needed
export const firebaseInternal = {
  // Not for external Firebase usage; exposed for potential diagnostics only
  getCurrentUser: () => (auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : null),
};


