import{
    signOut,
    auth,
    db, 
    collection, 
    getDocs ,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    addDoc,
    onAuthStateChanged
} from "../config.js"


// ////// Logout

document.addEventListener("DOMContentLoaded", () => {
    const logout = document.getElementById("logout");
    const iconlogout = document.getElementById("icon-logout");

    if (logout) logout.addEventListener("click", userlogout);
    if (iconlogout) iconlogout.addEventListener("click", userlogout);
});

async function userlogout(e) {
    e.preventDefault();
    
    if (!auth.currentUser) {
        alert("No user is logged in.");
        return;
    }
    try {
        await signOut(auth);
        alert("Logout Successful!");
        window.location.href = "../index.html"; 
        return;
    } catch (error) {
        console.error("Logout Error:", error);
        alert("Error logging out. Check console.");
    }
}


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
        let html = "";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const postId = doc.id;
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
                   <i class="fav-icon fa-solid fa-star" data-id="${postId}""></i>
                   <button class="upd-btn" id="upd-${doc.id}">Update</button> 
                   <button class="del-btn" id="del-${doc.id}">Delete</button>
                   </div>
                   </div>
               </div>`;
        });

        const blogsContainer = document.getElementById("blogs");
        if (html) {
            blogsContainer.innerHTML = html;
            attachEventListeners();
        } else {
            blogsContainer.innerHTML = "<p>No posts available.</p>"; 
        }
        
        document.querySelectorAll(".fav-icon").forEach((icon) => {
            icon.addEventListener("click", async (event) => {
                const postId = event.target.getAttribute("data-id");
                if (postId) {
                    await toggleFavorite(postId);
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

async function toggleFavorite(postId) {
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
            alert("Removed from Favorites");
        } else {
            await addDoc(favCollection, {
                postId,
                userId: currentUserId
            });
            alert("Added to Favorites");
        }
    } catch (error) {
        console.error("Error updating favorite:", error);
    }
}

document.addEventListener("DOMContentLoaded", getData);

//// Delete Post
async function deletePost(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        await deleteDoc(doc(db, "Posts", id));
        alert("Post Deleted!");
        getData(); 
    } catch (error) {
        alert("Error deleting post");
        console.error(error);
    }
}

// ////// Update Post
let currentPostId = null; 

function attachEventListeners() {
    document.querySelectorAll(".del-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const postId = btn.id.replace("del-", "");
            deletePost(postId);
        });
    });

    document.querySelectorAll(".upd-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const postId = btn.id.replace("upd-", "");
            openUpdateModal(postId);
        });
    });
}

async function openUpdateModal(postId) {
    currentPostId = postId; 

    try {
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            const postData = postSnap.data();
            document.getElementById("update-title").value = postData.title;
            document.getElementById("update-desc").value = postData.des;
            document.getElementById("update-cate").value = postData.cate;

            document.getElementById("update-post-modal").style.display = "flex";
        } else {
            alert("Post not found!");
        }
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("update-post-modal").style.display = "none";
});

document.getElementById("save-post-btn").addEventListener("click", async () => {
    if (!currentPostId) return;

    const newTitle = document.getElementById("update-title").value;
    const newDesc = document.getElementById("update-desc").value;
    const newCate = document.getElementById("update-cate").value;

    if (!newTitle || !newDesc) {
        alert("Title and Description cannot be empty!");
        return;
    }

    try {
        const postRef = doc(db, "Posts", currentPostId);
        await updateDoc(postRef, {
            title: newTitle,
            des: newDesc,
            cate: newCate,
        });

        alert("Post Updated Successfully!");
        document.getElementById("update-post-modal").style.display = "none"; 
        getData(); 
    } catch (error) {
        console.error("Error updating post:", error);
        alert("Error updating post. Please try again.");
    }
});

window.addEventListener("click", (event) => {
    const modal = document.getElementById("update-post-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

//  /// Profile

async function loadUserProfile() {
    onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
            const userData = userSnap.data();

            document.getElementById("user-name").innerText = userData.name;
            document.getElementById("user-email").innerText = userData.email;
            document.getElementById("user-bio").innerText = userData.bio || "No bio available.";

            if (userData.photoURL) {
                document.getElementById("profile-pic").src = userData.photoURL || "../assets/img/imgicon.png";
             }
         } else {
          alert("User data not found in Firestore!");
        }
        } catch (error) {
        console.error("Error loading profile:", error);
      }
    } else {
        window.location.href = "../index.html";
     }
  });
}

document.addEventListener("DOMContentLoaded", loadUserProfile);

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
    if (!user) {
         window.location.href = "../html/login.html";
        } else {
            loadUserProfile(user);
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const profileIcon = document.getElementById("profile-icon"); 

    if (profileIcon) {
        profileIcon.addEventListener("click", (e) => {
            e.preventDefault(); 

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    window.location.href = "../html/profile.html";
                } else {
                    alert("Please login first!");
                    window.location.href = "../html/login.html";
                }
            });
        });
    }
});
   

// /// Profile Update

document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("edit-btn");
    const modal = document.getElementById("edit-profile-modal");
    const closeModal = document.querySelector(".close-btn");
    const saveBtn = document.getElementById("save-profile-btn");

    const userName = document.getElementById("user-name");
    const userBio = document.getElementById("user-bio");

    editBtn.addEventListener("click", () => {
        modal.style.display = "flex";

        document.getElementById("new-name").value = userName.innerText;
        document.getElementById("new-bio").value = userBio.innerText;
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    saveBtn.addEventListener("click", async () => {
        const newName = document.getElementById("new-name").value;
        const newBio = document.getElementById("new-bio").value;

        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "Users", user.uid);
                await updateDoc(userRef, { name: newName, bio: newBio });

                userName.innerText = newName;
                userBio.innerText = newBio;

                modal.style.display = "none";
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile. Please try again.");
        }
    });

        window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

