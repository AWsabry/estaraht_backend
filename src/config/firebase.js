import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp = null;

export const initializeFirebase = () => {
  try {
    if (firebaseApp) {
      return firebaseApp;
    }

    // Service account JSON file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccountPath = join(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      console.log('✅ Firebase Admin initialized with service account file');
      return firebaseApp;
    }

    console.warn('⚠️ Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT_PATH in .env');
    return null;
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    return null;
  }
};

// Initialize Firebase on module load
initializeFirebase();

// Helper function to delete user from Firebase Auth
export const deleteFirebaseUser = async (uid) => {
  try {
    if (!firebaseApp) {
      console.warn('Firebase not initialized. Skipping Firebase user deletion.');
      return { success: false, message: 'Firebase not configured' };
    }

    await admin.auth().deleteUser(uid);
    console.log(`✅ Successfully deleted Firebase user: ${uid}`);
    return { success: true, message: 'Firebase user deleted successfully' };
  } catch (error) {
    console.error(`❌ Error deleting Firebase user ${uid}:`, error.message);

    // User not found in Firebase = already deleted, treat as success
    if (error.code === 'auth/user-not-found') {
      return { success: true, message: 'User not found in Firebase (may already be deleted)' };
    }

    // ADC / credential errors: don't throw, return result so API and DB delete still succeed
    const isCredentialError =
      error.message?.includes('default credentials') ||
      error.message?.includes('OAuth2') ||
      error.message?.includes('Could not load');
    if (isCredentialError) {
      console.warn('Firebase credentials unavailable. Run: gcloud auth application-default login');
      return {
        success: false,
        message: 'Firebase credentials not loaded. Run: gcloud auth application-default login'
      };
    }

    return { success: false, message: error.message };
  }
};

export default admin;
