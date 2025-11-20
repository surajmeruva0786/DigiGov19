# Creating the Initial Government Official Account

## Quick Start

To create the initial official account (`manish@gov.in`), follow these steps:

### Step 1: Run Your Development Server
```bash
npm run dev
```

### Step 2: Open Browser Console
1. Open your app in the browser (usually http://localhost:3000)
2. Press `F12` to open Developer Tools
3. Go to the "Console" tab

### Step 3: Create the Account
Copy and paste this command into the console:

```javascript
const { createInitialOfficialAccount } = await import('./firebase.js');
const result = await createInitialOfficialAccount();
console.log(result);
```

### Step 4: Verify Success
You should see a success message with:
- Email: `manish@gov.in`
- Password: `qwerty`
- UID: (Firebase generated ID)

### Step 5: Login
1. Navigate to the Official Login page
2. Enter:
   - Email: `manish@gov.in`
   - Password: `qwerty`
3. Click "Access Official Portal"

## What Gets Created

The account creation process:
1. ✅ Creates user in Firebase Authentication
2. ✅ Stores profile in Firestore `officials` collection with:
   - Name: "Manish"
   - Department: "Digital Governance"
   - Role: "Administrator"

## Troubleshooting

**If you see "email-already-in-use" error:**
- The account already exists! Just login with the credentials above.

**If you see "permission-denied" error:**
- Check your Firestore security rules
- Make sure Firebase is properly configured

**If imports fail:**
- Make sure you're running the command from the app's page
- Try refreshing the page and running again

## Adding More Officials

See the [walkthrough documentation](file:///C:/Users/HP/.gemini/antigravity/brain/5c98254c-06e7-4d2a-8b12-ff4816f48f2a/walkthrough.md) for instructions on adding additional official accounts.
