const teamsTotals = [];
const shortYears = [];
const yearsAvgs = {};

async function initTeamsTotals() {
    for (let i = 0; i < numOfTeams; i++) {
        teamsTotals.push({rosterId: i + 1, fpts: 0, fpts_against: 0, wins: 0, losses: 0});
    }
}

async function initYearsAvgs() {
    for (let i = 0; i < years.length; i++) {
        yearsAvgs[years[i]] = {fpts: 0, fpts_against: 0, wins: 0, losses: 0};
    }
}

async function getTotalsData() { 
    for (let i = 0; i < years.length; i++) {
        if (leagueSettings[years[i]]["total_rosters"] < numOfTeams) {//check to see if each year is a shorter year so we can later fill in this year for the extra teams with average to make data more balanced
            shortYears.push(years[i]);
        }
        for (let j = 0; j < leagueSettings[years[i]]["total_rosters"]; j++) {
            if (!isNaN(teams[j][years[i]]["metadata"]["fpts_against"])) {
                teamsTotals[j]["fpts_against"] += teams[j][years[i]]["metadata"]["fpts_against"];
            }            
            teamsTotals[j]["fpts"] += teams[j][years[i]]["metadata"]["fpts"];
            teamsTotals[j]["wins"] += teams[j][years[i]]["metadata"]["wins"];
            teamsTotals[j]["losses"] += teams[j][years[i]]["metadata"]["losses"];
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

async function main() {
    await fetchAllYears(currentYearID);
    await initTeams();
    await initYearsAvgs();
    await fetchRosterData();
    await fetchUserData();
    await initTeamsTotals();
    await fetchLeagueData();
    await getTotalsData();
    await getYearsAvgs();
    await fillShortYears();
}

main();
console.log(teamsTotals);
console.log(teams);
console.log(leagueSettings);
console.log(shortYears);
console.log(yearsAvgs);