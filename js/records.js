async function main() {
    await fetchAllYears(currentYearID);
    await fetchLeagueData();
    setLeagueFavicon(leagueSettings[years[years.length - 1]]['avatar']);
    setLeagueSubPageLogo(leagueSettings[years[years.length - 1]]['avatar']);
}

main();