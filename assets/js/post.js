import{
    db, 
    collection, 
    getDocs ,
    addDoc,
    deleteDoc,
    doc,
    auth
} from "../config.js"

// /// Current user
let currentUserId = null; 
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUserId = user.uid;  
        console.log("Current User ID:", currentUserId);
        getData();
    } else {
        console.log("No user logged in.");
        currentUserId = null;
        getData();
    }
});

// ////// Fetch Data

async function getData() {
    try {
        const querySnapshot = await getDocs(collection(db, "Posts"));
        const userFavorites = await getUserFavorites();

        let html = "";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const postId = doc.id;
            const isFavorited = userFavorites.includes(postId) ? "favorited" : "";
            console.log(postId);

            html += `
                <div class="card mb-3 blog-card" data-id="${doc.id}">
                   <img src="${data.imageUrl || "../assets/img/imgicon.png"}" class="card-img-left" alt="Blog Image">
                   <div class="card-body blog-content">
                   <h5 class="card-title">${data.title}</h5>
                   <p class="card-text">${data.des}</p>
                   <div class="blog-footer">
                   <p class="card-text">${data.cate}</p>
                   <span>${data.date}</span>
                   <i class="fav-icon fa-solid fa-star" data-id="${postId}"></i>
                   </div>
                   </div>
               </div>`;
        });

        const blogsContainer = document.getElementById("blogs");
        if (html) {
            blogsContainer.innerHTML = html;
        } else {
            blogsContainer.innerHTML = "<p class = 'nopost'>No posts available.</p>"; 
        }

        document.querySelectorAll(".fav-icon").forEach((icon) => {
            icon.addEventListener("click", async (event) => {
                const postId = event.target.getAttribute("data-id");
                if (postId) {
                    await toggleFavorite(postId , event.target);
                } else {
                    console.error("postId not found!");
                }
            });
        });

    } catch (error) {
        alert("Error fetching data");
        console.error(error);
    }
}

async function toggleFavorite(postId ,icon) {
    if (!currentUserId) {
        alert("Please log in to save favorites!");
        return;
    }

    try {
        const favCollection = collection(db, "Favorites");
        const favSnapshot = await getDocs(favCollection);
        let favDocId = null;

        favSnapshot.forEach((doc) => {
            if (doc.data().postId === postId && doc.data().userId === currentUserId) {
                favDocId = doc.id;
            }
        });

        if (favDocId) {
            await deleteDoc(doc(db, "Favorites", favDocId));
            icon.classList.remove("favorited");
            alert("Removed from Favorites");
        } else {
            await addDoc(favCollection, {
                postId,
                userId: currentUserId
            });
            icon.classList.add("favorited");
            alert("Added to Favorites");
        }
    } catch (error) {
        console.error("Error updating favorite:", error);
    }
}

document.addEventListener("DOMContentLoaded", getData);

// Fetch user favorites
async function getUserFavorites() {
    if (!currentUserId) return [];
    
    const favSnapshot = await getDocs(collection(db, "Favorites"));
    let userFavorites = [];

    favSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === currentUserId) {
            userFavorites.push(data.postId);
        }
    });

    return userFavorites;
}





