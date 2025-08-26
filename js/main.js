let currentYearID = '1183100419290038272';
let numWeeks = 17; 
let numOfTeams = 0;
let yearIDs = [];
let yearIDstest = [];
let years = []; 
const teams = [];
let leagueSettings = {};

async function fetchAllYears(leagueID) {
    const response = await fetch("https://api.sleeper.app/v1/league/" + leagueID);
    const data = await response.json();
    yearIDs.unshift(data.league_id);
    years.unshift(data.season);
    if (data.settings.num_teams > numOfTeams) {
        numOfTeams = data.settings.num_teams;
    }
    if (data.previous_league_id == null){

    } else {
        await fetchAllYears(data.previous_league_id);
    }
}

function initTeams() {
    for (let i = 0; i < numOfTeams; i++) {
        teams.push({rosterId: i + 1});
        for (let j = 0; j < years.length; j++) {
            teams[i][years[j]] = {};
        }
    }
}

async function fetchRosterData () {
    for (let i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/rosters"); 
        const data = await response.json();
        for (let j = 0; j < data.length; j++) {
            teamIdx = data[j].roster_id - 1;
            teams[teamIdx][years[i]]["ownerId"] = data[j].owner_id;
            teams[teamIdx][years[i]]["starters"] = data[j].starters;
            teams[teamIdx][years[i]]["players"] = data[j].players;
            teams[teamIdx][years[i]]["metadata"] = data[j].settings;
            teams[teamIdx][years[i]]["bench"] = [];
            for (k = 0; k < teams[teamIdx][years[i]]["players"].length; k++) { // maybe bad, too many things in 1 function, but i fill the benches here
                if(!teams[teamIdx][years[i]]["starters"].includes(teams[teamIdx][years[i]]["players"][k])) { //i feel like its getting a little unreadable here
                    teams[teamIdx][years[i]]["bench"].push(teams[teamIdx][years[i]]["players"][k]);
                }
            }
        }
    }
}

async function fetchUserData() {
    for (let i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/users");
        const data = await response.json();
        for (let j = 0; j < data.length; j++) {
            for (let k = 0; k < teams.length; k++) { // maybe uneccesary but this finds what team each element in data is linked with
                if (teams[k][years[i]]["ownerId"] == data[j].user_id) {
                    teamIdx = k;
                }
            }
            teams[teamIdx][years[i]]["teamName"] = data[j].metadata.team_name;
            teams[teamIdx][years[i]]["displayName"] = data[j].display_name; //the "Rich" line
            teams[teamIdx][years[i]]["teamAvatar"] = data[j].metadata.avatar;
            teams[teamIdx][years[i]]["avatarId"] = data[j].avatar; //the "Rich + Noah" line
        }
    }
}


async function fetchLeagueData() {
    for (let i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i]);
        const data = await response.json();
        leagueSettings[years[i]] = data;
    }
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

async function loadPlayerDB() { //probably bad because you need to fetch 5MB everytime, maybe?
    const res = await fetch("players.json");
    const data = await res.json();
    playerDB = data;
}

function getPlayerName(id) {
    if (isNaN(id)) {
        return id;
    } else if(playerDB && playerDB[id]) {
        return playerDB[id].full_name;
    } else {
        console.log(id + " not found ");
        return id;
    }
}

function getPlayerPos(id) {
    if (isNaN(id)) {
        return "DEF";
    } else if(playerDB && playerDB[id]) {
        return playerDB[id].position;
    }
    console.log(playerDB[id] + " not found ");
}


