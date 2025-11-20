/**
 * Setup Script for Creating Initial Government Official Account
 * 
 * This script creates the initial official account for manish@gov.in
 * Run this once to set up the account in Firebase Authentication and Firestore
 * 
 * Usage:
 * 1. Open your browser console on the app
 * 2. Copy and paste this entire script
 * 3. Run: await setupInitialOfficialAccount()
 */

async function setupInitialOfficialAccount() {
    try {
        console.log('Starting official account setup...');

        // Import the Firebase function
        const { createInitialOfficialAccount } = await import('./firebase.js');

        // Create the account
        const result = await createInitialOfficialAccount();

        if (result.success) {
            console.log('✅ Success! Official account created:');
            console.log('Email: manish@gov.in');
            console.log('Password: qwerty');
            console.log('UID:', result.data.uid);
            console.log('\nYou can now login with these credentials!');
        } else {
            console.error('❌ Error creating account:', result.message);

            // Check if account already exists
            if (result.message.includes('email-already-in-use')) {
                console.log('\n✅ Account already exists! You can login with:');
                console.log('Email: manish@gov.in');
                console.log('Password: qwerty');
            }
        }
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

// Auto-run the setup
console.log('Official Account Setup Script Loaded');
console.log('Run: await setupInitialOfficialAccount()');
