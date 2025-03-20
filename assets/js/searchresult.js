import { db, 
         collection, 
         getDocs } from "../config.js";

async function getSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get("category");

    if (!selectedCategory) {
        document.getElementById("blogs").innerHTML = "<p>No category selected.</p>";
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, "Posts"));
        let html = "";

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (data.cate === selectedCategory) {
                html += `
                    <div class="card mb-3 blog-card" data-id="${doc.id}">
                   <img src="${data.imageUrl || "../assets/img/imgicon.png"}" class="card-img-left" alt="Blog Image">
                        <div class="card-body blog-content">
                            <h5 class="card-title">${data.title}</h5>
                            <p class="card-text">${data.des}</p>
                            <div class="blog-footer">
                                <p class="card-text">${data.cate}</p>
                                <span>${data.date}</span>
                                <a href="../html/post.html?id=${doc.id}">See More</a>
                            </div>
                        </div>
                    </div>`;
            }
        });

        document.getElementById("blogs").innerHTML = html || "<p>No posts found in this category.</p>";
    } catch (error) {
        console.error("Error fetching search results:", error);
        document.getElementById("blogs").innerHTML = "<p>Error loading posts.</p>";
    }
}

document.addEventListener("DOMContentLoaded", getSearchResults);
