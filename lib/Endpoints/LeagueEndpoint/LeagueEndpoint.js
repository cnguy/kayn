import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class LeagueEndpoint extends LeagueSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.by = {
      id: this.id.bind(this),
    };
  }

  /**
   * Get league with given ID, including inactive entries. 
   * 
   * Implements /lol/league/v3/leagues/{leagueID}.
   *  
   * @param {number} leagueID - The ID of the league. 
   */
  id(leagueID) {
    return new Request(
      this.config,
      this.serviceName,
      `leagues/${leagueID}`,
      METHOD_NAMES.LEAGUE.GET_LEAGUE_BY_ID,
    );
  }
}

export default LeagueEndpoint;
