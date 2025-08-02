import {
     auth,
     createUserWithEmailAndPassword,
     db,
     setDoc,
     doc} from "../config.js"

//Upload Image to Cloudinary
const uploadImg = async (file) => {
    const cloudName = "dinqgoctg";
    const presetName = "NoorXclodinary";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetName);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        return data.secure_url; 
    } catch (error) {
        console.error("Image upload error:", error);
        return "../assets/img/imgicon.png"; 
    }
}


const signup = document.getElementById("signup-form");
signup.addEventListener("submit"  , async (e)=>{

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const fileInput = document.getElementById("prof-img");
    
    const file = fileInput.files[0];

    if ( !email || !password || !name || !fileInput) {
        alert("Please fill all fields!");
        return;
    }

    try{
        let userCredential = await createUserWithEmailAndPassword(
            auth, email, password
        );
        const user = userCredential?.user;

        let profileImgUrl = "../assets/img/imgicon.png"; 
        if (file) {
            profileImgUrl = await uploadImg(file);
        }

        await setDoc(doc(db, "Users", user.uid), {
            name: name,
            email: email,
            photoURL: profileImgUrl,
            bio: "No bio available." 
        });

        alert("Signed up Successfully");
        console.log( user);
        signup.reset();
    }

    catch(error){
      console.log("Signup Error",error.message);
    }

});
