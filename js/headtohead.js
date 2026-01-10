function createTeamDropdown(id) {
    const select = document.createElement("select");
    select.classList.add("h2h-dropdown");
    select.id = id;

    const placeholderOption = document.createElement("option");
    placeholderOption.textContent = "Select a team";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    for (const ownerId in owners) {
        const names = owners[ownerId];
        const option = document.createElement("option");
        option.value = ownerId
        option.textContent = names[names.length - 1]

        select.appendChild(option);
    }

    return select;
}

async function genHeadToHeadSelectors() {
    const container = document.getElementById("teamButton");
    container.innerHTML = "";

    const team1Select = createTeamDropdown("team1");
    const team2Select = createTeamDropdown("team2");

    const button = document.createElement("button");
    button.classList.add("h2h-dropdown");
    button.textContent = "View Matchup History";

    button.onclick = () => {
        const team1 = team1Select.value;
        const team2 = team2Select.value;

        if (!team1 || !team2 || team1 === team2) return;

        displayMatchups(team1, team2);
    };

    container.appendChild(team1Select);
    container.appendChild(team2Select);
    container.appendChild(button);
}

async function main() {
    await fetchAllYears(currentYearID);
    await initTeams();
    await loadPlayerDB();
    await fetchRosterData();
    await fetchUserData();
    await fetchLeagueData();
    await fetchMatchups();
    await genHeadToHeadSelectors(); 
    }

main();
console.log(teams);
console.log(leagueSettings);
console.log(owners);