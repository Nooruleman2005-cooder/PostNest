import {
    auth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    getDoc, 
    doc,
    db
} from "../config.js";

const login = document.getElementById("login-form");

login.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential?.user;

        if (user) {
            const userRef = doc(db, "Users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data(); 
                
                console.log("User Data:", userData);
                alert(`Login Successfully! Welcome, ${userData.name}`);

                localStorage.setItem("userData", JSON.stringify(userData));

                window.location.href = "../html/profile.html";
            } else {
                alert("User data not found in Firestore!");
            }
        }
    } catch (error) {
        console.log("Login Error", error.message);
        alert(error.message);
    }
});


//  //// Foget-pass

const ForgetPassword = document.getElementById("forget-pass");
ForgetPassword.addEventListener("click", async (e)=>{
    e.preventDefault();
    
    let email = document.getElementById("email").value ;
    if (!email) {
        alert("Please enter your email to reset the password!");
        return;
    }
    try{
      await sendPasswordResetEmail(auth, email);
      alert("succesfull send an email to your account!");
    }
    catch(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    };
});





