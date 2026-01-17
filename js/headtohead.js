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
        currentMatchupStats = {};
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

    for (let i = 0; i < owners[team1].length; i++) { // get the years that the 2 teams have in common
        for (let j = 0; j < owners[team2].length; j++) {
            if (owners[team1][i][1] == owners[team2][j][1]) {
                commonYears.push(owners[team1][i][1]);
            }
        }
    }
    currentMatchupStats['players'] = [team1, team2];
    currentMatchupStats['commonYears'] = commonYears;
    currentMatchupStats['matchups'] = [];
    currentMatchupStats['team1TotalPoints'] = 0;
    currentMatchupStats['team2TotalPoints'] = 0;

    if (commonYears.length == 0) {
        alert(`${owners[team1].at(-1)[0]} and ${owners[team2].at(-1)[0]} have never played head-to-head!`);

        return;
    }
    currentMatchupStats['matchups'] = [];
    currentMatchupStats['team1Wins'] = 0;
    currentMatchupStats['team1Loses']= 0;
    currentMatchupStats['team2Wins'] = 0;
    currentMatchupStats['team2Loses'] = 0;
    team1AvatarLink = "";
    team2AvatarLink = "";
    for (let i = 0; i < commonYears.length; i++) {
        let team1Idx = owners[team1][i][2] - 1
        let team2Idx = owners[team2][i][2] - 1
        for (let j = 1; j <= numWeeks; j++) {
            if (leagueSettings[commonYears[i]]['settings']['leg'] < 15 && teams[team1Idx][commonYears[i]]['matchups']['week' + j] == undefined && teams[team2Idx][commonYears[i]]['matchups']['week' + j] == undefined) {
                return;
            }
            if (teams[team1Idx][commonYears[i]]['matchups']['week' + j]['matchup_id'] == teams[team2Idx][commonYears[i]]['matchups']['week' + j]['matchup_id']) { // nasty code but... IF the two teams DID match up that week...
                if ((j < leagueSettings[commonYears[i]]['settings']['playoff_week_start']) || (verifyPlayoffGame(j, teams[team1Idx][commonYears[i]]['matchups']['week' + j]['matchup_id'], leagueSettings[commonYears[i]]['settings']['playoff_teams']) == 0)) { // ... AND that game was EITHER in regular season OR it was a meaningful playoff game (not a game where the two teams were eliminated where neither teams sets their rosters), THEN its valid
                    
                    let tempMatchupStats = {};
                    tempMatchupStats[commonYears[i] + "_" + j] = {
                        matchup: []
                    };
                    currentMatchupStats['team1TotalPoints'] += teams[team1Idx][commonYears[i]]['matchups']['week' + j]['points'];
                    currentMatchupStats['team2TotalPoints'] += teams[team2Idx][commonYears[i]]['matchups']['week' + j]['points'];

                    tempMatchupStats[commonYears[i] + "_" + j]['team1Pts'] = teams[team1Idx][commonYears[i]]['matchups']['week' + j]['points'];
                    tempMatchupStats[commonYears[i] + "_" + j]['team2Pts'] = teams[team2Idx][commonYears[i]]['matchups']['week' + j]['points'];
                    // add tempstats to get avatarlink and teamname from owners object, then after that replace the current names and pictures that are being displayed with the new data
                    avatarId1 = teams[team1Idx][commonYears[i]]["avatarId"];
                    avatarId2 = teams[team2Idx][commonYears[i]]["avatarId"]; 

                    if (teams[team1Idx][commonYears[i]]["teamAvatar"] != undefined) {
                        team1AvatarLink = teams[team1Idx][commonYears[i]]["teamAvatar"];
                    } else {
                        team1AvatarLink = "https://sleepercdn.com/avatars/" + avatarId1;
                    }
                    if (teams[team2Idx][commonYears[i]]["teamAvatar"] != undefined) {
                        team2AvatarLink = teams[team2Idx][commonYears[i]]["teamAvatar"];
                    } else {
                        team2AvatarLink = "https://sleepercdn.com/avatars/" + avatarId2;
                    }

                    tempMatchupStats[commonYears[i] + "_" + j]['team1AvatarLink'] = team1AvatarLink;
                    tempMatchupStats[commonYears[i] + "_" + j]['team2AvatarLink'] = team2AvatarLink;

                    if (teams[team1Idx][commonYears[i]]["teamName"] != undefined) {
                        tempMatchupStats[commonYears[i] + "_" + j]['team1Name'] = teams[team1Idx][commonYears[i]]["teamName"];
                    } else {
                        tempMatchupStats[commonYears[i] + "_" + j]['team1Name'] = teams[team1Idx][commonYears[i]]["displayName"];
                    }
                    
                    if (teams[team2Idx][commonYears[i]]["teamName"] != undefined) {
                        tempMatchupStats[commonYears[i] + "_" + j]['team2Name'] = teams[team2Idx][commonYears[i]]["teamName"];
                    } else {
                        tempMatchupStats[commonYears[i] + "_" + j]['team2Name'] = teams[team2Idx][commonYears[i]]["displayName"];
                    }


                    if (tempMatchupStats[commonYears[i] + "_" + j]['team1Pts'] > tempMatchupStats[commonYears[i] + "_" + j]['team2Pts']) {
                        currentMatchupStats['team1Wins'] += 1;
                        currentMatchupStats['team2Loses'] += 1; 
                    } else {
                        currentMatchupStats['team2Wins'] += 1;
                        currentMatchupStats['team1Loses'] += 1;
                    }
                    tempMatchupStats[commonYears[i] + "_" + j]['matchup'].push(commonYears[i]);
                    tempMatchupStats[commonYears[i] + "_" + j]['matchup'].push(j);
                    tempMatchupStats[commonYears[i] + "_" + j]['team1Avatar'] = teams[team1Idx][commonYears[i]]["avatarId"];
                    tempMatchupStats[commonYears[i] + "_" + j]['team2Avatar'] = teams[team2Idx][commonYears[i]]["avatarId"];
                    // decided not to include roster stuff becuase if someone really wants to see the rosters that each team had in a past matchup they can easily find it in sleeper with the info that is given about the matchup!
                    if (j > 14) {
                        tempMatchupStats[commonYears[i] + "_" + j]["playoff"] = true;
                    } else {
                        tempMatchupStats[commonYears[i] + "_" + j]["playoff"] = false;
                    }
                    currentMatchupStats['matchups'].push( tempMatchupStats[commonYears[i] + "_" + j]);
                }
            }
        }
    }
}

async function displayMatchups(team1, team2) { // AI was used to create these functions that disaply the data
    await fetchMatchupStats(team1, team2);
    
    const container = document.getElementById("teamsContainer");
    container.innerHTML = "";

    const summarySection = createSummarySection();
    container.appendChild(summarySection);

    const historySection = document.createElement("div");
    historySection.className = "matchup-history";

    for (let i = 0; i < currentMatchupStats['matchups'].length; i++) {
        const matchupCard = createMatchupCard(i);
        historySection.append(matchupCard);
    }
    container.appendChild(historySection);
}

function createSummarySection() {
    const section = document.createElement("div");
    section.className = "matchup-summary";

    const team1Block = createTeamSummaryBlock(1);
    const team2Block = createTeamSummaryBlock(2);

    section.appendChild(team1Block); // this is 152
    section.appendChild(createVsDivider());
    section.appendChild(team2Block);

    return section;
}

function createTeamSummaryBlock(team) {
    const block = document.createElement("div");
    block.className = "team-summary";

    const logo = document.createElement("img");
    logo.className = "team-logo"; 

    avatarId = currentMatchupStats['matchups'][ currentMatchupStats['matchups'].length - 1]['team' + team + 'Avatar'];
    logo.src = "https://sleepercdn.com/avatars/" + avatarId;

    const name = document.createElement("h2");

    playerId = currentMatchupStats['players'][team - 1]; 
    latestYearIdx = owners[playerId].length - 1

    name.textContent = owners[playerId][latestYearIdx][0];

    const stats = document.createElement("div");

    const totalPoints = document.createElement("p");
    totalPoints.textContent = `Total Points: ${currentMatchupStats['team' + team + 'TotalPoints']}`;

    const record = document.createElement("p");
    record.textContent = `Record: ${currentMatchupStats['team' + team + 'Wins']} - ${currentMatchupStats['team' + team + 'Loses']}`;

    stats.appendChild(totalPoints);
    stats.appendChild(record);

    block.appendChild(logo);
    block.appendChild(name);
    block.appendChild(stats);

    return block;
}

function createVsDivider() {
    const vs = document.createElement("div");
    vs.className = "vs-divider";
    vs.textContent = "VS";
    return vs;
}

function createMatchupCard(matchup) {
    const card = document.createElement("div");
    card.className = "matchup-card";

    const header = document.createElement("h3");
    header.textContent = `Week ${currentMatchupStats['matchups'][matchup]['matchup'][1]}, ${currentMatchupStats['matchups'][matchup]['matchup'][0]}`;

    const body = document.createElement("div");
    body.className = "matchup-body";

    avatarId1 = currentMatchupStats['matchups'][matchup]['team1Avatar'];
    avatarId2 = currentMatchupStats['matchups'][matchup]['team2Avatar'];
    playerId1 = currentMatchupStats['players'][0];
    playerId2 = currentMatchupStats['players'][1];
    latestYearIdx1 = owners[playerId1].length - 1;
    latestYearIdx2 = owners[playerId2].length - 1;

    const team1Line = createMatchupTeamLine(
        currentMatchupStats['matchups'][matchup]['team1Name'], //team name
        currentMatchupStats['matchups'][matchup]['team1AvatarLink'], // avatar
        currentMatchupStats['matchups'][matchup]['team1Pts'] //team 1 points for this matchup
    );

    const team2Line = createMatchupTeamLine( // could be wrong
        currentMatchupStats['matchups'][matchup]['team2Name'],
        currentMatchupStats['matchups'][matchup]['team2AvatarLink'],
        currentMatchupStats['matchups'][matchup]['team2Pts']
    );

    body.appendChild(team1Line);
    body.appendChild(team2Line);

    if (currentMatchupStats['matchups']['playoffs'] == true) {
        const badge = document.createElement("span");
        badge.className = "playoff-badge";
        badge.textContent = "Playoffs";
        card.appendChild(badge);
    }

    card.appendChild(header);
    card.appendChild(body);

    return card;
}

function createMatchupTeamLine(name, avatarId, points) {
    const line = document.createElement("div");
    line.className = "matchup-team-line";

    const logo = document.createElement("img");
    logo.src = avatarId;
    logo.className = "small-logo";

    const teamName = document.createElement("span");
    teamName.textContent = name;

    const pts = document.createElement("span");
    pts.textContent = points + " pts";

    line.appendChild(logo);
    line.appendChild(teamName);
    line.appendChild(pts);

    return line;
}


async function main() {
    await fetchAllYears(currentYearID);
    await fetchLeagueData();
    setLeagueFavicon(leagueSettings[years[years.length - 1]]['avatar']);
    setLeagueSubPageLogo(leagueSettings[years[years.length - 1]]['avatar']);
    await initTeams();
    await loadPlayerDB();
    await fetchRosterData();
    await fetchUserData();
    await fetchMatchups();
    await fetchOwnerData();
    await genHeadToHeadSelectors();
    //await fetchMatchupStats("470052994147151872", "470799445009625088")
    }

main();
/* console.log(teams);
console.log(leagueSettings);
console.log(owners);
console.log(currentMatchupStats); */