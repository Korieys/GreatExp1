export const getFirebaseErrorMessage = (error: any): string => {
    if (!error || !error.code) {
        return "An unknown error occurred. Please try again.";
    }

    switch (error.code) {
        // Auth Errors
        case 'auth/email-already-in-use':
            return "This email is already registered. Please login instead.";
        case 'auth/invalid-email':
            return "Please enter a valid email address.";
        case 'auth/user-disabled':
            return "This account has been disabled. Please contact support.";
        case 'auth/user-not-found':
            return "No account found with this email.";
        case 'auth/wrong-password':
            return "Incorrect password. Please try again.";
        case 'auth/weak-password':
            return "Password should be at least 6 characters.";
        case 'auth/operation-not-allowed':
            return "This operation is not currently allowed.";
        case 'auth/too-many-requests':
            return "Too many failed attempts. Please try again later.";
        case 'auth/network-request-failed':
            return "Network error. Please check your connection.";
        case 'auth/requires-recent-login':
            return "Please login again to verify your identity.";
        case 'auth/invalid-credential':
            return "Invalid credentials. Please check your email and password.";

        // Firestore Errors
        case 'permission-denied':
            return "You do not have permission to perform this action.";
        case 'unavailable':
            return "Service unavailable. Please check your connection.";

        default:
            console.error("Firebase Error:", error.code, error.message);
            return "Something went wrong. Please try again.";
    }
};
