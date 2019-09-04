# 体育赛事 (Kovan)

这个数据集提供来自主要运动联盟的最新的运动结果。

| 合约              | 地址                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 数据集 Token         | [0x799107D5a6d31533Cf2bc18C58EBdA89FeDe9908](https://kovan.etherscan.io/address/0x799107D5a6d31533Cf2bc18C58EBdA89FeDe9908) |
| 数据集 Oracle        | [0xF904Db9817E4303c77e1Df49722509a0d7266934](https://kovan.etherscan.io/address/0xF904Db9817E4303c77e1Df49722509a0d7266934) |
| 治理参数 | [0x96C1a83bdb74e3116Af2CF63463008202a2c4857](https://kovan.etherscan.io/address/0x96C1a83bdb74e3116Af2CF63463008202a2c4857) |

## Key-Value 格式

与Band Protocol 上的其他数据集类似，数据消费者通过提供 _输入键_ 来查询财务数据，以返回一个 _输出值_。我们在本小节中讨论了这种格式。

### 输入值

输入键由多个部分组成，由 `/` 连接。有些运动是可选的，所以要小心!

1. 由3个字母的联赛标识符，类似 `EPL`，`NFL` 等。
2. 比赛的本地日期采用`YYYYMMDD`格式。
3. 主队/队员和客队/队员的缩写符号，用`-`分隔。
4. **可选**。可能有两支相同球队有超过一场比赛的比赛，必须包含匹配的整数计数(`1` 表示第1场比赛, `2` 表示第2场比赛 ...)。 仅与当前`MLB`相关。

下面是查询键的一个例子。

| Key (ascii)              | 说明                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `EPL/20190811/NEW-ARS`   | 2019年8月8日 纽卡斯尔vs 阿森纳的比赛                |
| `NFL/20190203/LAR-NE`    | 2019年2月3日公羊队vs爱国者队的NFB比赛    |
| `NBA/20190430/MIL-BOS`   | 2019年4月30日雄鹿vs凯尔特人的NBA比赛     |
| `MLB/20190819/HOU-DET/1` | 2019年8月19日太空人vs老虎队的 MLB第一场比赛 |

### 输出值

只需要考虑32字节输出中的2个字节。第1个字节可以解析为一个8byte的整数，表示主队/球员的得分。第1个字节对于客场球队/球员是相同的。

## 支持的体育运动联盟

### EPL - [英超联赛](https://www.premierleague.com/)

| 缩写 | 全称         |
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

### NFL - [美国橄榄球大联盟](https://nfl.com)

| 缩写 | 全称             |
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

### NBA - [美职篮](https://nba.com)

| 缩写 | 全称             |
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

### MLB - [美国职业棒球大联盟](https://mlb.com)

| 缩写 | 全称             |
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
