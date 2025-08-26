CURRENTLY ONLY COMPATIBLE WITH NFL SLEEPER LEAGUES

Current TODO:
    - read sleeperapi > to get weekly matchups with weekly players > match this data with teams > make dropdown for weeks on "Rosters" page
                                                                                                > make "Head to head" page
    - ask Will about the rosters page layout?
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
    