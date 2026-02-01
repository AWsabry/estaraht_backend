# Firebase Admin SDK Setup Guide

This guide explains how to connect Firebase Authentication to your backend for deleting users when doctors or patients are deleted from the dashboard.

## What You Need from Firebase

To connect Firebase Admin SDK, you need credentials from your Firebase project. There are three methods to provide these credentials:

### Method 1: Service Account JSON File (Recommended for Local Development)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project

2. **Generate Service Account Key**
   - Click on the gear icon (⚙️) → Project Settings
   - Go to the "Service Accounts" tab
   - Click "Generate New Private Key"
   - Download the JSON file (e.g., `serviceAccountKey.json`)

3. **Add to Your Project**
   - Place the JSON file in a secure location (e.g., `estraht-backend/config/serviceAccountKey.json`)
   - **IMPORTANT**: Add this file to `.gitignore` to never commit it to Git
   
4. **Update .env File**
   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=config/serviceAccountKey.json
   ```

### Method 2: Environment Variables (Recommended for Production/Deployment)

This method is better for deployment platforms like Heroku, Vercel, Railway, etc.

1. **Get Service Account Credentials**
   - Follow steps 1-2 from Method 1 to download the JSON file
   - Open the JSON file and extract these values:

2. **Add to .env File**
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   ```

   **Important Notes:**
   - The `FIREBASE_PRIVATE_KEY` must include the quotes
   - Keep the `\n` characters in the private key (they represent newlines)
   - The private key should look like: `"-----BEGIN PRIVATE KEY-----\nMIIE...your key...==\n-----END PRIVATE KEY-----\n"`

### Method 3: Google Cloud Application Default Credentials (ADC)

Use this when you're using **gcloud CLI** or running on **Google Cloud** (Cloud Run, Compute Engine, etc.).

1. **Install Google Cloud SDK** (if not already installed)
   - Download: https://cloud.google.com/sdk/docs/install

2. **Set up Application Default Credentials**
   ```bash
   gcloud auth application-default login
   ```
   - This opens a browser to sign in with your Google account
   - Credentials are saved locally (e.g. `~/.config/gcloud/application_default_credentials.json`)

3. **Add to .env File**
   ```env
   FIREBASE_USE_ADC=true
   FIREBASE_PROJECT_ID=your-project-id
   ```

4. **When running on GCP** (Cloud Run, GKE, Compute Engine), ADC is often set automatically—you only need `FIREBASE_USE_ADC=true` and `FIREBASE_PROJECT_ID`.

**Use cases:**
- Local development with your own Google account
- Services running on Google Cloud that use the default service account

## Example Service Account JSON Structure

When you download the service account key, it will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

You need:
- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY`
- `client_email` → `FIREBASE_CLIENT_EMAIL`

## Security Best Practices

1. **Never commit credentials to Git**
   - Add to `.gitignore`:
     ```
     # Firebase
     serviceAccountKey.json
     config/serviceAccountKey.json
     **/serviceAccountKey.json
     ```

2. **Use environment variables in production**
   - Set them in your hosting platform's dashboard
   - Never hardcode credentials in your code

3. **Restrict Service Account Permissions**
   - In Firebase Console → IAM & Admin
   - Ensure the service account only has necessary permissions

## Testing the Setup

1. **Start your backend server**
   ```bash
   npm run dev
   ```

2. **Check the console output**
   - You should see: `✅ Firebase Admin initialized with service account file`
   - Or: `✅ Firebase Admin initialized with environment variables`
   - If you see: `⚠️ Firebase credentials not found`, check your .env file

3. **Test deletion**
   - Try deleting a doctor or patient from the dashboard
   - Check the API response - it should include:
     ```json
     {
       "success": true,
       "message": "Doctor deleted successfully",
       "firebaseDeleted": true,
       "firebaseMessage": "Firebase user deleted successfully"
     }
     ```

## Troubleshooting

### Error: "Firebase credentials not found"
- Check that your `.env` file has the correct variables
- Verify the service account file path is correct
- Make sure you've restarted the server after updating `.env`

### Error: "auth/user-not-found"
- This is normal if the user doesn't exist in Firebase Auth
- The system treats this as a success (user already deleted)

### Error: "Insufficient permissions"
- Your service account doesn't have permission to delete users
- Go to Firebase Console → IAM & Admin
- Add "Firebase Authentication Admin" role to your service account

### Private Key Format Issues
- Ensure the private key includes `\n` characters
- The key should be wrapped in quotes in the `.env` file
- Don't remove the BEGIN/END markers

## How It Works

When you delete a doctor or patient from the dashboard:

1. **Dashboard** sends DELETE request to backend
2. **Backend** deletes the record from Supabase database
3. **Backend** calls Firebase Admin SDK to delete the user from Firebase Auth
4. **Response** includes both database and Firebase deletion status

The system is designed to be resilient:
- If Firebase is not configured, it will skip Firebase deletion and only delete from database
- If the user doesn't exist in Firebase, it continues without error
- All operations are logged for debugging

## Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Service Account Setup](https://firebase.google.com/docs/admin/setup#initialize-sdk)
- [Firebase Auth Admin API](https://firebase.google.com/docs/auth/admin)
