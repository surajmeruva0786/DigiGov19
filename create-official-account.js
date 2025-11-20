/**
 * Direct Account Creation Script
 * 
 * This script creates the initial official account directly in the browser console
 * without needing to import from firebase.js
 * 
 * Instructions:
 * 1. Open your app in the browser
 * 2. Open browser console (F12)
 * 3. Copy and paste this ENTIRE script
 * 4. Press Enter
 */

(async function createOfficialAccount() {
    try {
        console.log('🚀 Starting official account creation...');

        // Import Firebase modules
        const { getAuth, createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore, doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

        // Get Firebase instances (they should already be initialized by your app)
        const auth = getAuth();
        const db = getFirestore();

        const email = 'manish@gov.in';
        const password = 'qwerty';

        console.log('📧 Creating account for:', email);

        // Create the authentication account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        console.log('✅ Authentication account created!');
        console.log('UID:', uid);

        // Create the Firestore profile
        const officialProfile = {
            email: email,
            uid: uid,
            name: 'Manish',
            department: 'Digital Governance',
            role: 'Administrator',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, 'officials', uid), officialProfile);

        console.log('✅ Firestore profile created!');
        console.log('\n🎉 SUCCESS! Official account is ready!');
        console.log('\n📋 Login Credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('\nYou can now login with these credentials!');

    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.code === 'auth/email-already-in-use') {
            console.log('\n✅ Good news! The account already exists!');
            console.log('📋 Login Credentials:');
            console.log('Email: manish@gov.in');
            console.log('Password: qwerty');
        } else {
            console.error('Full error:', error);
        }
    }
})();
