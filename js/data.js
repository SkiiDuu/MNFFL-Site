const teamsTotals = [];

async function initTeamsTotals() {
    for (let i = 0; i < numOfTeams + 1; i++) {
        teamsTotals.push({rosterId: i + 1});
    }
}

async function getTotalsData() {
    for (let i = 0; i < years.length; i++) {
        for (let j = 0; J < leagueSettings[i]["total_rosters"]; j++) {
            //this function is gonna be fun to write...
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
}

main();
console.log(teamsTotals);
console.log(teams);
console.log(leagueSettings);