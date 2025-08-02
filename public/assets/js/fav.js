import { db, 
        collection, 
        getDocs,  
        auth }from "../config.js";


let currentUserId = null; 

auth.onAuthStateChanged( (user) => {
    if (user) {
        currentUserId = user.uid;
        console.log(" Logged-in User ID:", currentUserId);
        getFavorites(); 
    } else {
        console.warn(" No user is logged in!");
    }
});

async function getFavorites() {
    if (!currentUserId) {
        console.warn("User not logged in, cannot fetch favorites");
        return;
    }

    try {
        const favCollection = collection(db, "Favorites");
        const favSnapshot = await getDocs(favCollection);

        let html = "";
        let favoritePostIds = [];
        favSnapshot.forEach((doc) => {
            const favData = doc.data();
            if (favData.userId === currentUserId) {
                favoritePostIds.push(favData.postId);
            }
        });

        if (favoritePostIds.length === 0) {
            document.getElementById("favorites").innerHTML = "<p>No favorite posts found.</p>";
            return;
        }

        const postsCollection = collection(db, "Posts");
        const postsSnapshot = await getDocs(postsCollection);

        postsSnapshot.forEach((doc) => {
            const postData = doc.data();
            const postId = doc.id;

            if (favoritePostIds.includes(postId)) { 
                html += `
                   
                  <div class="card mb-3 blog-card" >
                   <img src="${postData.imageUrl || "../assets/img/imgicon.png"}" class="card-img-left" alt="Blog Image">
                   <div class="card-body blog-content">
                   <h5 class="card-title">${postData.title}</h5>
                   <p class="card-text">${postData.des}</p>
                   <div class="blog-footer">
                   <p class="card-text">${postData.cate}</p>
                   <span>${postData.date}</span>
                   <i class="fav-icon fa-solid fa-star" data-id="${postId}"></i>
                   </div>
                   </div>
               </div>`;
                    
            }
        });

        document.getElementById("favorites").innerHTML = html || "<p>No favorite posts found.</p>";

    } catch (error) {
        console.error("Error fetching favorites:", error);
    }
}