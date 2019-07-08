const allTeams = {
  'Atlanta Braves': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg',
  },
  'Philadelphia Phillies': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/4/47/New_Phillies_logo.png',
  },
  'Chicago Cubs': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/8/80/Chicago_Cubs_logo.svg',
  },
  'Los Angeles Dodgers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/6/69/Los_Angeles_Dodgers_logo.svg',
  },
  'Toronto Blue Jays': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/b/ba/Toronto_Blue_Jays_logo.svg',
  },
  'Los Angeles Angels': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/8/8b/Los_Angeles_Angels_of_Anaheim.svg',
  },
  'Texas Rangers': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/41/Texas_Rangers.svg',
  },
  'Cleveland Indians': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/e/ee/Cleveland_Indians_primary_logo.svg',
  },
  'Detroit Tigers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/e/e3/Detroit_Tigers_logo.svg',
  },
  'Tampa Bay Rays': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c6/Tampa_Bay_Rays.svg',
  },
  'Oakland Athletics': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/a/a4/Oakland_A%27s_logo.svg',
  },
  'Baltimore Orioles': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/7/75/Baltimore_Orioles_cap.svg',
  },
  'Boston Red Sox': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg',
  },
  'Kansas City Royals': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/1/1c/Kansas_City_Royals.svg',
  },
  'San Francisco Giants': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/5/58/San_Francisco_Giants_Logo.svg',
  },
  'Colorado Rockies': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/3/31/Colorado_Rockies_logo.svg',
  },
  'San Diego Padres': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/a/a4/SDPadres_logo.svg',
  },
  'Minnesota Twins': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/7/71/Minnesota_Twins_logo.svg',
  },
  'Milwaukee Brewers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/1/11/Milwaukee_Brewers_Logo.svg',
  },
  'Miami Marlins': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/f/fd/Marlins_team_logo.svg',
  },
  'St. Louis Cardinals': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/9/9d/St._Louis_Cardinals_logo.svg',
  },
  'Seattle Mariners': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/b/b0/Seattle_Mariners_logo.svg',
  },
  'Houston Astros': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/6/6b/Houston-Astros-Logo.svg',
  },
  'Chicago White Sox': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/c/c1/Chicago_White_Sox.svg',
  },
  'New York Mets': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7b/New_York_Mets.svg',
  },
  'New York Yankees': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/2/25/NewYorkYankees_PrimaryLogo.svg',
  },
  'Washington Nationals': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/a/a3/Washington_Nationals_logo.svg',
  },
  'Arizona Diamondbacks': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/8/89/Arizona_Diamondbacks_logo.svg',
  },
  'Cincinnati Reds': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/0/01/Cincinnati_Reds_Logo.svg',
  },
  'Pittsburgh Pirates': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/8/81/Pittsburgh_Pirates_logo_2014.svg',
  },
  'Sacramento Kings': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c7/SacramentoKings.svg',
  },
  'Cleveland Cavaliers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/4/4b/Cleveland_Cavaliers_logo.svg',
  },
  'Minnesota Timberwolves': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/c/c2/Minnesota_Timberwolves_logo.svg',
  },
  'Miami Heat': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg',
  },
  'Denver Nuggets': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg',
  },
  'Portland Trail Blazers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/2/21/Portland_Trail_Blazers_logo.svg',
  },
  'Boston Celtics': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg',
  },
  'Indiana Pacers': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Indiana_Pacers.svg',
  },
  'Houston Rockets': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Rockets.svg',
  },
  'Utah Jazz': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/0/04/Utah_Jazz_logo_%282016%29.svg',
  },
  'Oklahoma City Thunder': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/5/5d/Oklahoma_City_Thunder.svg',
  },
  'Detroit Pistons': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Pistons_logo17.svg',
  },
  'Phoenix Suns': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg',
  },
  'New Orleans Pelicans': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/0/0d/New_Orleans_Pelicans_logo.svg',
  },
  'Memphis Grizzlies': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/f/f1/Memphis_Grizzlies.svg',
  },
  'Dallas Mavericks': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/9/97/Dallas_Mavericks_logo.svg',
  },
  'San Antonio Spurs': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/a/a2/San_Antonio_Spurs.svg',
  },
  'New York Knicks': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg',
  },
  'Orlando Magic': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/1/10/Orlando_Magic_logo.svg',
  },
  'Toronto Raptors': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/3/36/Toronto_Raptors_logo.svg',
  },
  'Brooklyn Nets': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/4/44/Brooklyn_Nets_newlogo.svg',
  },
  'Philadelphia 76ers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/0/0e/Philadelphia_76ers_logo.svg',
  },
  'Golden State Warriors': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg',
  },
  'Los Angeles Clippers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/b/bb/Los_Angeles_Clippers_%282015%29.svg',
  },
  'Washington Wizards': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/0/02/Washington_Wizards_logo.svg',
  },
  'Milwaukee Bucks': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg',
  },
  'Los Angeles Lakers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg',
  },
  'Chicago Bulls': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg',
  },
  'Atlanta Hawks': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg',
  },
  'Charlotte Hornets': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/c/c4/Charlotte_Hornets_%282014%29.svg',
  },
  'Chicago Bears': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/5/5c/Chicago_Bears_logo.svg',
  },
  'Seattle Seahawks': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/8/8e/Seattle_Seahawks_logo.svg',
  },
  'New Orleans Saints': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/5/50/New_Orleans_Saints_logo.svg',
  },
  'Philadelphia Eagles': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/8/8e/Philadelphia_Eagles_logo.svg',
  },
  'New England Patriots': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg',
  },
  'Los Angeles Chargers': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/7/72/NFL_Chargers_logo.svg',
  },
  'Kansas City Chiefs': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg',
  },
  'Indianapolis Colts': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/0/00/Indianapolis_Colts_logo.svg',
  },
  'Baltimore Ravens': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/1/16/Baltimore_Ravens_logo.svg',
  },
  'Houston Texans': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Texans_logo.svg',
  },

  'Dallas Cowboys': {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Dallas_Cowboys.svg',
  },
  'Los Angeles Rams': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/8/8a/Los_Angeles_Rams_logo.svg',
  },
  'Huddersfield Town': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/7/7d/Huddersfield_Town_A.F.C._logo.png',
  },
  Southampton: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
  },
  Arsenal: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  },
  Chelsea: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  },
  Watford: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e2/Watford.svg',
  },
  Everton: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
  },
  'Crystal Palace': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg',
  },
  Burnley: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg',
  },
  Leicester: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
  },
  Liverpool: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  },
  Newcastle: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
  },
  Fulham: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
  },
  'Man City': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  },
  Wolves: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
  },
  Cardiff: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/3/3c/Cardiff_City_crest.svg',
  },
  Bournemouth: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
  },
  'Man United': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  },
  'West Ham': {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
  },
  Tottenham: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  },
  Brighton: {
    logo:
      'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
  },
  home: {
    logo: 'https://png.pngtree.com/svg/20170609/692da67c8b.svg',
  },
  away: {
    logo: 'https://png.pngtree.com/svg/20170322/7bc60df58b.svg',
  },
  default: {
    logo: 'https://png.pngtree.com/svg/20170605/69c46a788b.svg',
  },
}

export const getDetail = (name, type) => {
  if (!allTeams[name]) {
    return allTeams[type] || allTeams.default
  }
  return allTeams[name]
}
