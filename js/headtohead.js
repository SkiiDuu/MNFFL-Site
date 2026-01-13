let currentMatchupStats = {};

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
        option.textContent = names[names.length - 1][0]

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
    let commonYears = [];
    let team1TotalPoints = 0;
    let team2TotalPoints = 0;
    for (let i = 0; i < owners[team1].length; i++) { // get the years that the 2 teams have in common
        for (let j = 0; j < owners[team2].length; j++) {
            if (owners[team1][i][1] == owners[team2][j][1]) {
                commonYears.push(owners[team1][i][1]);
            }
        }
    }
    currentMatchupStats['commonYears'] = commonYears;

    if (commonYears.length == 0) {
        alert('${owners[team1][-1][0]} and ${owners[team2][-1][0]} have never played head-to-head!');
        return;
    }
    for (let i = 0; i < commonYears.length; i++) {
        let team1Idx = owners[team1][i][2] - 1
        let team2Idx = owners[team2][i][2] - 1
        for (let j = 1; j <= numWeeks; j++) {
            if (teams[team1Idx][commonYears[i]]['matchups']['week' + j]['matchup_id'] == teams[team2Idx][commonYears[i]]['matchups']['week' + j]['matchup_id']) { // nasty code, if the two teams did have a match up that week...
                if ((j < leagueSettings[commonYears[i]]['settings']['playoff_week_start']) || (verifyPostseasonGame(j, teams[team1Idx][commonYears[i]]['matchups']['week' + j]['matchup_id'], leagueSettings[commonYears[i]]['settings']['playoff_teams']) == 0)) { // ... AND that game was EITHER in regular season OR it was a meaningful playoff game (not a game where the two teams were eliminated where neither teams sets their rosters)
                    team1TotalPoints += teams[team1Idx][commonYears[i]]['matchups']['week' + j]['points'];
                    team2TotalPoints += teams[team2Idx][commonYears[i]]['matchups']['week' + j]['points'];
                    currentMatchupStats[commonYears[i]]['team1Pts'] = teams[team1Idx][commonYears[i]]['matchups']['week' + j]['points'];
                    currentMatchupStats[commonYears[i]]['team2Pts'] = teams[team2Idx][commonYears[i]]['matchups']['week' + j]['points'];
                }
            }
        }
    }
    console.log(currentMatchupStats);
}

function verifyPostseasonGame(week, matchId, playoffSpots) { //disgusting code, but I did'nt feel like finding the equation that verifies a playoff game
    if (week == 17 && matchId == 1) {
        return 0;
    } else if (week == 16 && matchId <= 2) {
        return 0;
    } else if (week == 15 && matchId <= 2) {
        return 0;
    } else if (playoffSpots > 6 && (week == 15 && matchId <= 3)) {
        return 0;
    } else if (playoffSpots == 8 && (week == 15 && matchId <= 4)) {
        return 0;
    } else {
        return -1;
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
    await fetchMatchupStats("466064624756715520", "470799445009625088")
    }

main();
console.log(teams);
console.log(leagueSettings);
console.log(owners);