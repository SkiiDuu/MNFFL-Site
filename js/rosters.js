async function genYearDropdown() { // contrary to the title of the function, this gen's year and week dropdowns...
    const container = document.getElementById("yearButtons"); 
    container.innerHTML = "";

    const select = document.createElement("select");
    select.classList.add("roster-dropdown");

    const placeholderOption = document.createElement("option");
    placeholderOption.textContent = "Select a year";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    for (let i = 0; i < years.length; i++) {
        const option = document.createElement("option");
        option.value = years[i];
        option.textContent = years[i];
        select.appendChild(option);
    }

    const weekSelect = document.createElement("select");
    weekSelect.classList.add("roster-dropdown");

    for (let w = 1; w <= numWeeks; w++) {
        const option = document.createElement("option");
        option.value = w;
        option.textContent = w;
        if (w == 1) {
            option.selected = true;
        }

        weekSelect.appendChild(option);
    }

    select.onchange = function() {
        let year = select.value;
        let week = weekSelect.value;
        if (week) {
            displayRosters(year, week);
        }
    };

    weekSelect.onchange = function() {
        let year = select.value;
        let week = weekSelect.value;
        if (year && week) {
            displayRosters(year, week);
        }
    };

    container.appendChild(select);
    container.appendChild(weekSelect);
}

for (i = 0; i < teams.length; i++) {
    totalWins = 0;
    for (j = 0; j < years.length; j++) {
        totalWins = totalWins + teams[i][years[j]]["metadata"]["wins"];
    }
}

async function displayRosters(year, week) { //massive function i feel like... getting into spagetti code territory for sure.
    const container = document.getElementById("rosterContainer");

    container.innerHTML = "";

    for (let i = 0; i < leagueSettings[year]["total_rosters"]; i++) { 
        const teamDiv = document.createElement("div");
        teamDiv.classList.add("teamcard");

        const teamTitle = document.createElement("h2");

        const teamAvatar = document.createElement("h3");

        const userTitle = document.createElement("h4");

        if(teams[i][year]["ownerId"] == teams[i][years[years.length - 1]]["ownerId"]) { //only works with teams that are within the current year
            displayName = teams[i][years[years.length - 1]]["displayName"];
        } else {
            displayName = teams[i][year]["displayName"];
        }


        if (teams[i][year]["teamName"] == undefined) {
            teamTitle.textContent = teams[i][year]["displayName"];
            //userTitle.textContent = displayName;
            //teamTitle.append(" (" + displayName + ")");
            userTitle.textContent = " (" + displayName + ")";
        } else {
            teamTitle.textContent = teams[i][year]["teamName"];
            //userTitle.textContent = displayName;
            //teamTitle.append(" (" + displayName + ")");
            userTitle.textContent = " (" + displayName + ")";
        }

        avatarId = teams[i][year]["avatarId"];

        if (teams[i][year]["teamAvatar"] != undefined) {
            const img = document.createElement("img");
            img.src = teams[i][year]["teamAvatar"];
            img.classList.add("rosterAvatar");
            teamAvatar.appendChild(img);
        } else {

            const img = document.createElement("img");
            img.src = "https://sleepercdn.com/avatars/" + avatarId;
            img.classList.add("rosterAvatar");
            teamAvatar.appendChild(img);
        }
        
        const starterList = document.createElement("ul");
        if (teams[i][year]["matchups"]["week" + week]) { 
            for (let j = 0; j < teams[i][year]["matchups"]["week" + week]["starters"].length; j++) {
                const li = document.createElement("li");
                const pos =  leagueSettings[year]["roster_positions"][j];
                const name = getPlayerName(teams[i][year]["matchups"]["week" + week]["starters"][j]);
                li.innerHTML = "<span class='" + pos + "'>" + pos + "</span> " + "<span class='player'>" + name + "</span>";
                starterList.appendChild(li);
            }

            const benchList = document.createElement("ul");
            for (let j = 0; j < teams[i][year]["matchups"]["week" + week]["players"].length; j++) {
                if (!teams[i][year]["matchups"]["week" + week]["starters"].includes(teams[i][year]["matchups"]["week" + week]["players"][j])) { //unreadable AF but this makes sure we are adding a non-starter
                    const li = document.createElement("li");
                    const pos = li.textContent = getPlayerPos(teams[i][year]["matchups"]["week" + week]["players"][j]);
                    const name = getPlayerName(teams[i][year]["matchups"]["week" + week]["players"][j]);
                    li.innerHTML = "<span class='" + pos + "'>" + pos + "</span> " + "<span class='player'>" + name + "</span>";
                    benchList.appendChild(li);
                }
            }
            teamDiv.appendChild(teamTitle);
            teamDiv.appendChild(userTitle);
            teamDiv.appendChild(teamAvatar);
            teamDiv.appendChild(starterList);
            teamDiv.appendChild(benchList);
            container.appendChild(teamDiv);
        } else {
            teamDiv.appendChild(teamTitle);
            teamDiv.appendChild(userTitle);
            teamDiv.appendChild(teamAvatar);
            container.appendChild(teamDiv);
        }
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
    await genYearDropdown();
    await displayRosters(years[years.length - 2], 1);
    }

main();
console.log(teams);
console.log(leagueSettings);