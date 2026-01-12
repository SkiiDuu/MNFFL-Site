let currentMatchupstats = {};

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

async function fetchMatchupStats(team1, team2) {
    // get stats like: total points for each team, total record (team 1 first), each match up (who won, points for each, year, week, playoffs?, unique things that matchup(teamname, logo)), rosters?, 

}


async function fetchMatchups() {
    for (let i = 0; i < years.length; i++) {
        let weekPromises = [];

        for (let j = 1; j < numWeeks + 1; j++) {
            let url = "https://api.sleeper.app/v1/league/" + yearIDs[i] + "/matchups/" + j;
            let promise = fetch(url).then(function(res) {
                return res.json();
            }); 
            weekPromises.push(promise);
        }

        let allWeekData = await Promise.all(weekPromises);

        for (let j = 0; j < allWeekData.length; j++) {
            let data = allWeekData[j];
            for (let k = 0; k < numOfTeams; k++) {
                if (!teams[k][years[i]]["matchups"]) {
                    teams[k][years[i]]["matchups"] = {};
                }
                teams[k][years[i]]["matchups"]["week" + (j + 1)] = data[k];
            }
        }
    }
}

async function displayMatchups(team1, team2) {
    fetchMatchupStats(team1, team2);
}

async function main() {
    await fetchAllYears(currentYearID);
    await initTeams();
    await loadPlayerDB();
    await fetchRosterData();
    await fetchUserData();
    await fetchLeagueData();
    await fetchMatchups();
    await fetchOwnerData();
    await genHeadToHeadSelectors(); 
    }

main();
console.log(teams);
console.log(leagueSettings);
console.log(owners);