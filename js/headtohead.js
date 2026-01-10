async function genTeamDropdown() {
    const container = document.getElementById("teamButton");
    container.innerHTML = "";

    const select = document.createElement("select");
    select.classList.add("h2h-dropdown");

    const placeholderOption = document.createElement("option");
    placeholderOption.textContent = "Select a team";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    for (let i = 0; i < teams.length; i++) {
        const option = document.createElement("option");
        option.value = teams[i][years[-1]]["teamName"];
        option.textContent = teams[i][years[-1]]["teamName"];
        select.appendChild(option);
    }
}

async function main() {
    await fetchAllYears(currentYearID);
    await initTeams();
    await loadPlayerDB();
    await fetchRosterData();
    await fetchUserData();
    await fetchLeagueData();
    await fetchMatchups();
    await genTeamDropdown();
    }

main();
console.log(teams);
console.log(leagueSettings);
console.log(owners);