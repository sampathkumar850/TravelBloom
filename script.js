// 🌍 Load Recommendations on Page Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded. Running fetchRecommendations()");
    fetchRecommendations();
});

    
    // Ensure search box is editable
    let searchBox = document.getElementById("search-box");
    
    console.log("Search Box Loaded:", searchBox);
    console.log("Disabled:", searchBox.disabled);
    console.log("ReadOnly:", searchBox.readOnly);
    
    // Ensure input is editable
    searchBox.disabled = false;
    searchBox.readOnly = false;
    searchBox.style.color = "black";
    searchBox.style.backgroundColor = "white";
    searchBox.style.cursor = "text";

    // Detect Enter key press for search
    searchBox.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchDestinations();
        }
    });

    // Attach event listener to search box for real-time filtering
    searchBox.addEventListener("input", function (e) {
        console.log("Typing Detected:", e.target.value);
        searchDestinations();
    });


// 🌎 Fetch Recommendations from JSON
async function fetchRecommendations() {
    try {
        console.log("🌍 Fetching JSON file...");

        const response = await fetch("http://127.0.0.1:5500/travel_recommendation_api.json");
        
        if (!response.ok) throw new Error(`❌ Fetch failed with status: ${response.status}`);

        const data = await response.json();
        console.log("✅ JSON Loaded:", data);

        displayRecommendations(data.destinations);
    } catch (error) {
        console.error("⚠️ Error fetching JSON:", error);
        document.getElementById("recommendations").innerHTML =
            "<p class='text-red-500 text-center'>⚠️ Failed to load recommendations. Please check console for errors.</p>";
    }
}



// 🔎 Search Destinations
async function searchDestinations() {
    const searchQuery = document.getElementById("search-box").value.trim().toLowerCase();
    console.log("🔍 Search Query:", searchQuery);

    if (searchQuery === "") {
        console.log("❌ Search query is empty. Reloading all recommendations.");
        fetchRecommendations();
        return;
    }

    try {
        console.log("🌍 Fetching JSON data...");
        const response = await fetch("http://127.0.0.1:5500/travel_recommendation_api.json");

        if (!response.ok) throw new Error("❌ JSON fetch failed.");
        console.log("✅ JSON Fetch Successful!");

        const data = await response.json();
        console.log("✅ JSON Data Loaded:", data);

        // 🔍 Debugging: Show all destinations
        console.log("📌 Available Destinations:", data.destinations);

        // 🔍 Debugging: Ensure filtering logic works
        const filteredResults = data.destinations.filter(destination =>
            destination.name.toLowerCase().includes(searchQuery) ||
            destination.type.toLowerCase().includes(searchQuery) ||
            destination.location.toLowerCase().includes(searchQuery)
        );

        console.log("🎯 Filtered Results:", filteredResults);

        if (filteredResults.length === 0) {
            console.log("⚠️ No matching results.");
        }

        displayRecommendations(filteredResults);
    } catch (error) {
        console.error("⚠️ Error fetching search results:", error);
    }
}







// 🧹 Clear Search Box & Reload Recommendations
function clearSearch() {
    document.getElementById("search-box").value = ""; // Clears input field
    fetchRecommendations(); // Reload all destinations
}

// 📌 Display Recommendations in the HTML
function displayRecommendations(destinations) {
    const container = document.getElementById("recommendations");

    if (!container) {
        console.error("❌ ERROR: #recommendations div not found in HTML.");
        return;
    }

    container.innerHTML = ""; // Clear previous results

    if (!destinations.length) {
        container.innerHTML = "<p class='text-gray-500 text-center'>❌ No destinations found.</p>";
        return;
    }

    destinations.forEach((destination, index) => {
        console.log(`✅ Rendering Destination ${index + 1}:`, destination);

        const div = document.createElement("div");
        div.className = "bg-white p-6 shadow-lg rounded-lg transform hover:scale-105 transition duration-300";

        div.innerHTML = `
            <img src="${destination.image}" alt="${destination.name}" class="w-full h-40 object-cover rounded">
            <h4 class="text-lg font-bold mt-3">${destination.name}</h4>
            <p class="text-gray-600">${destination.description}</p>
            <p class="text-sm text-blue-500 mt-2"><i class="fas fa-map-marker-alt"></i> ${destination.location}</p>
        `;

        container.appendChild(div);
    });

    // 📌 Auto-scroll to results
    container.scrollIntoView({ behavior: "smooth", block: "start" });
}




