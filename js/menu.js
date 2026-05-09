async function generateBanner() {
    container = document.getElementById("banner");
    container.innerHTML = "";

    for(i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i]);
        const data = await response.json();
        avatarId = data.avatar;
        
        const img = document.createElement("img");
        img.src = "https://sleepercdn.com/avatars/" + avatarId;
        img.alt = "League image for" +years[i];
        img.classList.add("LeagueImage", years[i]);
        container.appendChild(img);
    }
}

function setLeagueName(name) {
    const el = document.getElementById("league-name");
    if (!el) return;

    el.textContent = name;
}

function changeLeague() {
    const input = document.getElementById("leagueIDInput").value.trim();
    if (input !== "") {
        localStorage.setItem("leagueID", input);
        location.reload();
    }
}

async function main(){
    const savedID = localStorage.getItem("leagueID");
    if (savedID) {
        currentYearID = savedID;
    }

    await fetchAllYears(currentYearID);
    await generateBanner();
    await fetchLeagueData();
    setLeagueFavicon(leagueSettings[years[years.length - 1]]['avatar']);
    setLeagueName(leagueSettings[years[years.length - 1]]['name']);
}

main();
