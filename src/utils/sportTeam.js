const NBA_TEAM = [
  { label: 'Atlanta Hawks', value: 'ATL' },
  { label: 'Boston Celtics', value: 'BOS' },
  { label: 'Brooklyn Nets', value: 'BKN' },
  { label: 'Charlotte Hornets', value: 'CHA' },
  { label: 'Chicago Bulls', value: 'CHI' },
  { label: 'Cleveland Cavaliers', value: 'CLE' },
  { label: 'Dallas Mavericks', value: 'DAL' },
  { label: 'Denver Nuggets', value: 'DEN' },
  { label: 'Detroit Pistons', value: 'DET' },
  { label: 'Golden State Warriors', value: 'GSW' },
  { label: 'Houston Rockets', value: 'HOU' },
  { label: 'Indiana Pacers', value: 'IND' },
  { label: 'Los Angeles Clippers', value: 'LAC' },
  { label: 'Los Angeles Lakers', value: 'LAL' },
  { label: 'Memphis Grizzlies', value: 'MEM' },
  { label: 'Miami Heat', value: 'MIA' },
  { label: 'Milwaukee Bucks', value: 'MIL' },
  { label: 'Minnesota Timberwolves', value: 'MIN' },
  { label: 'New Orleans Pelicans', value: 'NOP' },
  { label: 'New York Knicks', value: 'NYK' },
  { label: 'Oklahoma City Thunder', value: 'OKC' },
  { label: 'Orlando Magic', value: 'ORL' },
  { label: 'Philadelphia 76ers', value: 'PHI' },
  { label: 'Phoenix Suns', value: 'PHX' },
  { label: 'Portland Trail Blazers', value: 'POR' },
  { label: 'Sacramento Kings', value: 'SAC' },
  { label: 'San Antonio Spurs', value: 'SAS' },
  { label: 'Toronto Raptors', value: 'TOR' },
  { label: 'Utah Jazz', value: 'UTA' },
  { label: 'Washington Wizards', value: 'WAS' },
]

const EPL_TEAM = [
  { label: 'Arsenal', value: 'ARS' },
  { label: 'Bournemouth', value: 'BOU' },
  { label: 'Brighton', value: 'BHA' },
  { label: 'Burnley', value: 'BUR' },
  { label: 'Cardiff', value: 'CAR' },
  { label: 'Chelsea', value: 'CHE' },
  { label: 'Crystal Palace', value: 'CRY' },
  { label: 'Everton', value: 'EVE' },
  { label: 'Fulham', value: 'FUL' },
  { label: 'Huddersfield Town', value: 'HUD' },
  { label: 'Leicester', value: 'LEI' },
  { label: 'Liverpool', value: 'LIV' },
  { label: 'Man City', value: 'MNC' },
  { label: 'Man United', value: 'MAN' },
  { label: 'Newcastle', value: 'NEW' },
  { label: 'Southampton', value: 'SOU' },
  { label: 'Tottenham', value: 'TOT' },
  { label: 'Watford', value: 'WAT' },
  { label: 'West Ham', value: 'WHU' },
  { label: 'Wolves', value: 'WOL' },
]

const MLB_TEAM = [
  { label: 'Arizona Diamondbacks', value: 'ARI' },
  { label: 'Atlanta Braves', value: 'ATL' },
  { label: 'Baltimore Orioles', value: 'BAL' },
  { label: 'Boston Red Sox', value: 'BOS' },
  { label: 'Chicago Cubs', value: 'CHC' },
  { label: 'Chicago White Sox', value: 'CWS' },
  { label: 'Cincinnati Reds', value: 'CIN' },
  { label: 'Cleveland Indians', value: 'CLE' },
  { label: 'Colorado Rockies', value: 'COL' },
  { label: 'Detroit Tigers', value: 'DET' },
  { label: 'Houston Astros', value: 'HOU' },
  { label: 'Kansas City Royals', value: 'KC' },
  { label: 'Los Angeles Angels', value: 'LAA' },
  { label: 'Los Angeles Dodgers', value: 'LAD' },
  { label: 'Miami Marlins', value: 'MIA' },
  { label: 'Milwaukee Brewers', value: 'MIL' },
  { label: 'Minnesota Twins', value: 'MIN' },
  { label: 'New York Mets', value: 'NYM' },
  { label: 'New York Yankees', value: 'NYY' },
  { label: 'Oakland Athletics', value: 'OAK' },
  { label: 'Philadelphia Phillies', value: 'PHI' },
  { label: 'Pittsburgh Pirates', value: 'PIT' },
  { label: 'San Diego Padres', value: 'SD' },
  { label: 'San Francisco Giants', value: 'SF' },
  { label: 'Seattle Mariners', value: 'SEA' },
  { label: 'St. Louis Cardinals', value: 'STL' },
  { label: 'Tampa Bay Rays', value: 'TB' },
  { label: 'Texas Rangers', value: 'TEX' },
  { label: 'Toronto Blue Jays', value: 'TOR' },
  { label: 'Washington Nationals', value: 'WSH' },
]

const NFL_TEAM = [
  { label: 'Arizona Cardinals', value: 'ARI' },
  { label: 'Atlanta Falcons', value: 'ATL' },
  { label: 'Baltimore Ravens', value: 'BAL' },
  { label: 'Buffalo Bills', value: 'BUF' },
  { label: 'Carolina Panthers', value: 'CAR' },
  { label: 'Chicago Bears', value: 'CHI' },
  { label: 'Cincinnati Bengals', value: 'CIN' },
  { label: 'Cleveland Browns', value: 'CLE' },
  { label: 'Dallas Cowboys', value: 'DAL' },
  { label: 'Denver Broncos', value: 'DEN' },
  { label: 'Detroit Lions', value: 'DET' },
  { label: 'Green Bay Packers', value: 'GB' },
  { label: 'Houston Texans', value: 'HOU' },
  { label: 'Indianapolis Colts', value: 'IND' },
  { label: 'Jacksonville Jaguars', value: 'JAC' },
  { label: 'Kansas City Chiefs', value: 'KC' },
  { label: 'Los Angeles Chargers', value: 'LAC' },
  { label: 'Los Angeles Rams', value: 'LAR' },
  { label: 'Miami Dolphins', value: 'MIA' },
  { label: 'Minnesota Vikings', value: 'MIN' },
  { label: 'New England Patriots', value: 'NE' },
  { label: 'New Orleans Saints', value: 'NO' },
  { label: 'New York Giants', value: 'NYG' },
  { label: 'New York Jets', value: 'NYJ' },
  { label: 'Oakland Raiders', value: 'OAK' },
  { label: 'Philadelphia Eagles', value: 'PHI' },
  { label: 'Pittsburgh Steelers', value: 'PIT' },
  { label: 'San Francisco 49ers', value: 'SF' },
  { label: 'Seattle Seahawks', value: 'SEA' },
  { label: 'Tampa Bay Buccaneers', value: 'TB' },
  { label: 'Tennessee Titans', value: 'TEN' },
  { label: 'Washington Redskins', value: 'WAS' },
]

export const getNBATeamByCode = code => {
  return NBA_TEAM[
    Object.keys(NBA_TEAM).filter(each => NBA_TEAM[each].value === code)[0]
  ]
}

export const getEPLTeamByCode = code => {
  return EPL_TEAM[
    Object.keys(EPL_TEAM).filter(each => EPL_TEAM[each].value === code)[0]
  ]
}

export const getMLBTeamByCode = code => {
  return MLB_TEAM[
    Object.keys(MLB_TEAM).filter(each => MLB_TEAM[each].value === code)[0]
  ]
}

export const getNFLTeamByCode = code => {
  return NFL_TEAM[
    Object.keys(NFL_TEAM).filter(each => NFL_TEAM[each].value === code)[0]
  ]
}

export const getOptionsByType = type => {
  switch (type) {
    case 'NBA':
      return NBA_TEAM
    case 'EPL':
      return EPL_TEAM
    case 'MLB':
      return MLB_TEAM
    case 'NFL':
      return NFL_TEAM
    default:
      console.warn('Cannot find this sport type')
      break
  }
}

export const getSportTeamByCode = (type, code) => {
  switch (type) {
    case 'NBA':
      return getNBATeamByCode(code)
    case 'EPL':
      return getEPLTeamByCode(code)
    case 'MLB':
      return getMLBTeamByCode(code)
    case 'NFL':
      return getNFLTeamByCode(code)
    default:
      console.warn('Cannot find this sport type')
      break
  }
}
