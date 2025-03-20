import{
    GoogleAuthProvider ,
    signInWithPopup,
    signOut,
    auth
} from "../config.js"

////////////sign in with google

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const _sigInWithGoogle = async () => {
    try {
        await signOut(auth); 
        console.log("User signed out before sign-in attempt.");

        const result = await signInWithPopup(auth, provider); 
        console.log("User signed in:", result.user);
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
    }
};

document.getElementById("sigInWithGoogle")?.addEventListener("click", _sigInWithGoogle);
