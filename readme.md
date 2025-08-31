*ONLY COMPATIBLE WITH NFL "SLEEPER" FANTASY LEAGUES*

Simply change the currentYearID variable to your desired league ID

.
.
.

Current TODO:
    <br />-LEAGUE DATA
        <br />> use current team names in the table, but have a chart at the bottom of past owners and what years they controled the team for, also add an '*' for teams that did not exist in lesser team years.
        <br />> rememberr that i added a average index in teamsTotals in order to fill in years where there were less teams, (also maybe add to readme that if your league has varied number of teams year to year to "opt" in or out of averaging the league for the extra teams)
        <br />> Topics in table: fpts, fptsA, wins, losses, champs, pwins, plosses, trades, 
    <br /> <br />- ROSTERS
        <br />> add emoji to champions per year

Assumptions: 
    - users in the league dont switch teams slots at all, meaning if they left the league and came back in a differnt years they are still in the same "slot"

known needed fixes:
    -fixup the main.js file with the years and years codes situation\
    -find the correct way to do the right franchises and stuff (the roster_id meathod is bad for poritibility)
    -add past names, in the users fetch part
    -due to things like matchups using roster_id to id differnt people, maybe add in a variable that tracks which name is associated with that id number per year, like if someone changes roster_id's for some reason......
    - in leageSettings the array is of length 2026 because leagueSettings[year] makes it of year legnth and not of years.length length, this issue is integreated with much of the logic within the displayRosters function.

known "un-needed" fixes:
    - loading page (everything pops up at once)
    - make team cards titles look better (less space between teamname and username)
    - make title on title page automatically connect to correct league, same with the thumbnail