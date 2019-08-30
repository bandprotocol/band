# Sport Events (Kovan)

This dataset provides up-to-date final sport results from major sport leagues.

| Contract              | Address                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dataset Token         | [0x799107D5a6d31533Cf2bc18C58EBdA89FeDe9908](https://kovan.etherscan.io/address/0x799107D5a6d31533Cf2bc18C58EBdA89FeDe9908) |
| Dataset Oracle        | [0xF904Db9817E4303c77e1Df49722509a0d7266934](https://kovan.etherscan.io/address/0xF904Db9817E4303c77e1Df49722509a0d7266934) |
| Governance Parameters | [0x96C1a83bdb74e3116Af2CF63463008202a2c4857](https://kovan.etherscan.io/address/0x96C1a83bdb74e3116Af2CF63463008202a2c4857) |

## Key-Value Format

Similar to other datasets on Band Protocol, data consumers query for sport data by providing an _input key_ in return for an _output value_. We cover the specification in this subsection.

### Input Key

An input key consists of multiple parts, concatnated with character `/`. Some parts are optional for some sports so be careful!

1. A 3-letter league identifier, such as `EPL`, `NFL`, etc.
2. The local date of the competition in the format of `YYYYMMDD`.
3. The abbreviated symbol of home team/player and away team/player, separated by `-`.
4. **Optional**. For sports that are possible to have more than one match of two same teams, an integer count of match must be included (`1` for first match, `2` for second, ...). Only relevant for `MLB` as of current.

Below is an example of query keys.

| Key (ascii)              | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `EPL/20190811/NEW-ARS`   | Newcastle vs Arsenal match on August 8, 2019                 |
| `NFL/20190203/LAR-NE`    | NFB match of the Rams vs the Patriots on February 3, 2019    |
| `NBA/20190430/MIL-BOS`   | NBA match of the Bucks vs the Celtics on April 30, 2019      |
| `MLB/20190819/HOU-DET/1` | 1<sup>st</sup> MLB match of the Astros vs the Tigers on August 19, 2019 |

### Output Value

Only 2 bytes of the 32-byte output should be considered. The first byte can be parsed to an 8-byte integer representing the score of the home team/player. The second byte is the same for the away team/player.

## Support Sport Leagues

### EPL - The Premier League 🇬🇧⚽️ [](https://www.premierleague.com/)

| Abbrev | Full name         |
| :----: | ----------------- |
| `ARS`  | Arsenal           |
| `AVL`  | Aston Villa       |
| `BOU`  | Bournemouth       |
| `BHA`  | Brighton          |
| `BUR`  | Burnley           |
| `CAR`  | Cardiff           |
| `CHE`  | Chelsea           |
| `CRY`  | Crystal Palace    |
| `EVE`  | Everton           |
| `FUL`  | Fulham            |
| `HUD`  | Huddersfield Town |
| `LEI`  | Leicester         |
| `LIV`  | Liverpool         |
| `MNC`  | Man City          |
| `MAN`  | Man United        |
| `NEW`  | Newcastle         |
| `NOR`  | Norwich           |
| `SHFU` | Sheffield United  |
| `SOU`  | Southampton       |
| `TOT`  | Tottenham         |
| `WAT`  | Watford           |
| `WHU`  | West Ham          |
| `WOL`  | Wolves            |

### NFL - The National Football League 🇺🇸🏈 [](https://nfl.com)

| Abbrev | Full name            |
| :----: | -------------------- |
| `ARI`  | Arizona Cardinals    |
| `ATL`  | Atlanta Falcons      |
| `BAL`  | Baltimore Ravens     |
| `BUF`  | Buffalo Bills        |
| `CAR`  | Carolina Panthers    |
| `CHI`  | Chicago Bears        |
| `CIN`  | Cincinnati Bengals   |
| `CLE`  | Cleveland Browns     |
| `DAL`  | Dallas Cowboys       |
| `DEN`  | Denver Broncos       |
| `DET`  | Detroit Lions        |
|  `GB`  | Green Bay Packers    |
| `HOU`  | Houston Texans       |
| `IND`  | Indianapolis Colts   |
| `JAC`  | Jacksonville Jaguars |
|  `KC`  | Kansas City Chiefs   |
| `LAC`  | Los Angeles Chargers |
| `LAR`  | Los Angeles Rams     |
| `MIA`  | Miami Dolphins       |
| `MIN`  | Minnesota Vikings    |
|  `NE`  | New England Patriots |
|  `NO`  | New Orleans Saints   |
| `NYG`  | New York Giants      |
| `NYJ`  | New York Jets        |
| `OAK`  | Oakland Raiders      |
| `PHI`  | Philadelphia Eagles  |
| `PIT`  | Pittsburgh Steelers  |
|  `SF`  | San Francisco 49ers  |
| `SEA`  | Seattle Seahawks     |
|  `TB`  | Tampa Bay Buccaneers |
| `TEN`  | Tennessee Titans     |
| `WAS`  | Washington Redskins  |

### NBA - The National Basketball Association 🇺🇸🏀 [](https://nba.com)

| Abbrev | Full name              |
| :----: | ---------------------- |
| `ATL`  | Atlanta Hawks          |
| `BOS`  | Boston Celtics         |
| `BKN`  | Brooklyn Nets          |
| `CHA`  | Charlotte Hornets      |
| `CHI`  | Chicago Bulls          |
| `CLE`  | Cleveland Cavaliers    |
| `DAL`  | Dallas Mavericks       |
| `DEN`  | Denver Nuggets         |
| `DET`  | Detroit Pistons        |
| `GSW`  | Golden State Warriors  |
| `HOU`  | Houston Rockets        |
| `IND`  | Indiana Pacers         |
| `LAC`  | Los Angeles Clippers   |
| `LAL`  | Los Angeles Lakers     |
| `MEM`  | Memphis Grizzlies      |
| `MIA`  | Miami Heat             |
| `MIL`  | Milwaukee Bucks        |
| `MIN`  | Minnesota Timberwolves |
| `NOP`  | New Orleans Pelicans   |
| `NYK`  | New York Knicks        |
| `OKC`  | Oklahoma City Thunder  |
| `ORL`  | Orlando Magic          |
| `PHI`  | Philadelphia 76ers     |
| `PHX`  | Phoenix Suns           |
| `POR`  | Portland Trail Blazers |
| `SAC`  | Sacramento Kings       |
| `SAS`  | San Antonio Spurs      |
| `TOR`  | Toronto Raptors        |
| `UTA`  | Utah Jazz              |
| `WAS`  | Washington Wizards     |

### MLB - Major League Baseball 🇺🇸⚾️ [](https://mlb.com)

| Abbrev | Full name             |
| :----: | --------------------- |
| `ARI`  | Arizona Diamondbacks  |
| `ATL`  | Atlanta Braves        |
| `BAL`  | Baltimore Orioles     |
| `BOS`  | Boston Red Sox        |
| `CHC`  | Chicago Cubs          |
| `CWS`  | Chicago White Sox     |
| `CIN`  | Cincinnati Reds       |
| `CLE`  | Cleveland Indians     |
| `COL`  | Colorado Rockies      |
| `DET`  | Detroit Tigers        |
| `HOU`  | Houston Astros        |
|  `KC`  | Kansas City Royals    |
| `LAA`  | Los Angeles Angels    |
| `LAD`  | Los Angeles Dodgers   |
| `MIA`  | Miami Marlins         |
| `MIL`  | Milwaukee Brewers     |
| `MIN`  | Minnesota Twins       |
| `NYM`  | New York Mets         |
| `NYY`  | New York Yankees      |
| `OAK`  | Oakland Athletics     |
| `PHI`  | Philadelphia Phillies |
| `PIT`  | Pittsburgh Pirates    |
|  `SD`  | San Diego Padres      |
|  `SF`  | San Francisco Giants  |
| `SEA`  | Seattle Mariners      |
| `STL`  | St. Louis Cardinals   |
|  `TB`  | Tampa Bay Rays        |
| `TEX`  | Texas Rangers         |
| `TOR`  | Toronto Blue Jays     |
| `WSH`  | Washington Nationals  |
