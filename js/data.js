const teamsTotals = [];
const shortYears = [];
const yearsAvgs = {};
let playoffStats = {};
let oppList = [];

async function initOppList() {
    oppList = [];

    for (let yearIdx = 0; yearIdx < years.length; yearIdx++) {
        const year = years[yearIdx];
        const startWeek = leagueSettings[year].settings.playoff_week_start;
        const endWeek   = leagueSettings[year].settings.leg;

        oppList[yearIdx] = {};

        for (let week = startWeek; week <= endWeek; week++) {
            oppList[yearIdx][week] = {
                1: 99,
                2: 99,
                3: 99,
                4: 99
            };
        }
    }
}


async function initTeamsTotals() {
    for (let i = 0; i < numOfTeams; i++) {
        teamsTotals.push({rosterId: i + 1, fpts: 0, fpts_against: 0, wins: 0, losses: 0, playoffWins: 0, playoffLosses: 0, playoffPts: 0, champLosses: 0, champWins: 0});
    }
}

async function initYearsAvgs() {
    for (let i = 0; i < years.length; i++) {
        yearsAvgs[years[i]] = {fpts: 0, fpts_against: 0, wins: 0, losses: 0};
    }
}

async function getTotalsData() { 
    for (let i = 0; i < years.length; i++) {
        if (leagueSettings[years[i]]["total_rosters"] < leagueSettings[years[years.length - 1]]["total_rosters"]) {//check to see if each year is a shorter year so we can later fill in this year for the extra teams with average to make data more balanced
            shortYears.push(years[i]);
        }
        for (let j = 0; j < leagueSettings[years[i]]["total_rosters"]; j++) {
            if (!isNaN(teams[j][years[i]]["metadata"]["fpts_against"])) {
                teamsTotals[j]["fpts_against"] += teams[j][years[i]]["metadata"]["fpts_against"];
            }            
            teamsTotals[j]["fpts"] += teams[j][years[i]]["metadata"]["fpts"];
            teamsTotals[j]["wins"] += teams[j][years[i]]["metadata"]["wins"];
            teamsTotals[j]["losses"] += teams[j][years[i]]["metadata"]["losses"];
            fetchPlayoffStats(i, j);
        }
    }
}

async function getYearsAvgs() {
    for (let i = 0; i < years.length; i++) {
        for (let j = 0; j < leagueSettings[years[i]]["total_rosters"]; j++) {
            if (!isNaN(teams[j][years[i]]["metadata"]["fpts_against"])) {
                yearsAvgs[years[i]]["fpts_against"] += teams[j][years[i]]["metadata"]["fpts_against"];
            }            
            yearsAvgs[years[i]]["fpts"] += teams[j][years[i]]["metadata"]["fpts"];
            yearsAvgs[years[i]]["wins"] += teams[j][years[i]]["metadata"]["wins"];
            yearsAvgs[years[i]]["losses"] += teams[j][years[i]]["metadata"]["losses"];
        }
        yearsAvgs[years[i]]["fpts"] = Math.round(yearsAvgs[years[i]]["fpts"] / leagueSettings[years[i]]["total_rosters"]);
        yearsAvgs[years[i]]["fpts_against"] =  Math.round(yearsAvgs[years[i]]["fpts_against"] / leagueSettings[years[i]]["total_rosters"]);
        yearsAvgs[years[i]]["wins"] =  Math.round(yearsAvgs[years[i]]["wins"] / leagueSettings[years[i]]["total_rosters"]);
        yearsAvgs[years[i]]["losses"] =  Math.round(yearsAvgs[years[i]]["losses"] / leagueSettings[years[i]]["total_rosters"]);
    }
}


async function fillShortYears() {
    for (let i = 0; i < shortYears.length; i++) {
        let numOfTeamsShort = leagueSettings[shortYears[i]]["total_rosters"];
        let teamsShort = numOfTeams - numOfTeamsShort;
        for (let j = 0; j < teamsShort; j++) { 
            teamsTotals[numOfTeamsShort + j]["fpts_against"] +=  yearsAvgs[shortYears[i]]["fpts_against"];         
            teamsTotals[numOfTeamsShort + j]["fpts"] +=  yearsAvgs[shortYears[i]]["fpts"];
            teamsTotals[numOfTeamsShort + j]["wins"] += yearsAvgs[shortYears[i]]["wins"];
            teamsTotals[numOfTeamsShort + j]["losses"] += yearsAvgs[shortYears[i]]["losses"];
        }
    }
}

async function fetchPlayoffStats(yearIdx, teamIdx) {
    for(let i = leagueSettings[years[yearIdx]]["settings"]['playoff_week_start'] ; i <= leagueSettings[years[yearIdx]]["settings"]['leg']; i++) {
        populatePlayoffStats(yearIdx, teamIdx, i, teams[teamIdx][years[yearIdx]]['matchups']['week' + i]['matchup_id']);
    }
}

function populatePlayoffStats(yearIdx, teamIdx, week, id) {
    if (id == null || id < 1 || id > 4) {
        return;
    }
    if (verifyPlayoffGame(week, id, leagueSettings[years[yearIdx]]['settings']['playoff_teams']) == 0) {
        let gamePts = teams[teamIdx][years[yearIdx]]['matchups']['week' + week]['points'];
        teamsTotals[teamIdx]['playoffPts'] += gamePts;
        oppIdx = oppList[yearIdx][week][id];
        if (oppIdx < 99) {
            if (gamePts > teams[oppIdx][years[yearIdx]]['matchups']['week' + week]['points']) {
                teamsTotals[teamIdx]['playoffWins'] += 1;
                teamsTotals[oppIdx]['playoffLosses'] += 1;
                if (week == 17) { // bad practice...
                    teamsTotals[teamIdx]['champWins'] += 1;
                    teamsTotals[oppIdx]['champLosses'] += 1;
                }
            } else {
                 teamsTotals[teamIdx]['playoffLosses'] += 1;
                 teamsTotals[oppIdx]['playoffWins'] += 1;
                 if (week == 17) {
                    teamsTotals[oppIdx]['champWins'] += 1;
                    teamsTotals[teamIdx]['champLosses'] += 1;
                }
            }
        } else {
             oppList[yearIdx][week][id] = teamIdx; 
        }
    }
}

async function main() {
    await fetchAllYears(currentYearID);
    await fetchLeagueData();
    setLeagueFavicon(leagueSettings[years[years.length - 1]]['avatar']);
    setLeagueSubPageLogo(leagueSettings[years[years.length - 1]]['avatar']);

    await initTeams();
    await initYearsAvgs();
    await fetchRosterData();
    await fetchUserData();
    await fetchMatchups();

    await initOppList();
    await initTeamsTotals();
    await getTotalsData();
    await getYearsAvgs();
    await fillShortYears();
    console.log(oppList);
}

main();
console.log(oppList);
console.log(teamsTotals);
console.log(teams);
console.log(leagueSettings);
console.log(shortYears);
console.log(yearsAvgs);