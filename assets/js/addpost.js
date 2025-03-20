import{
 db,
 collection, 
 addDoc 
} from "../config.js"

// Upload Image to Cloudinary
const uploadImg = async () => {
    const file = document.getElementById("img").files[0];
    if (!file) {
        alert("Please select an image!");
        return null;
    }

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
        console.log(error);
        return null;
    }
};


    const addPost = document.getElementById("adding-form");
    addPost.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title")?.value;
    const des = document.getElementById("descrip")?.value;
    const date = document.getElementById("date")?.value;
    const cate = document.getElementById("category")?.value;

    if (!title || !des ) {
        alert("Please fill all the fields!");
        return;
    }

    const imageUrl = await uploadImg();
    if (!imageUrl) return;

    try {
        const docRef = await addDoc(collection(db, "Posts"), {
            title,
            des,
            date : new Date().toLocaleString(),
            imageUrl,
            cate
        });
        alert("Post Added Successfully!");
        console.log("Document written with ID:", docRef.id);
        addPost.reset();

        window.location.href = "../html/profile.html";

        getData();
    }   catch (e) {
        console.error("Error adding document:", e);
    }
});

