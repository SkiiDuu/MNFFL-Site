const teamsTotals = [];
const shortYears = [];

async function initTeamsTotals() {
    for (let i = 0; i < numOfTeams; i++) {
        teamsTotals.push({rosterId: i + 1, fpts: 0, fpts_against: 0, wins: 0, losses: 0});
    }
}

async function getTotalsData() { 
    for (let i = 0; i < years.length; i++) {
        if (leagueSettings[years[i]]["total_rosters"] < numOfTeams) {//check to see if each year is a shorter year so we can later fill in this year for the extra teams with average to make data more balanced
            shortYears.push(years[i], (numOfTeams - leagueSettings[years[i]]["total_rosters"]));
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

async function main() {
    await fetchAllYears(currentYearID);
    await initTeams();
    await fetchRosterData();
    await fetchUserData();
    await initTeamsTotals();
    await fetchLeagueData();
    await getTotalsData();
}

main();
console.log(teamsTotals);
console.log(teams);
console.log(leagueSettings);
console.log(shortYears);