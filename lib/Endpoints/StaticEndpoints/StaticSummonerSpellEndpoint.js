import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticSummonerSpellEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'summoner-spells';
  }

  /**
   * Retrieves summoner spell list.
   */
  list() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_SUMMONER_SPELL_LIST,
    );
  }

  /**
   * Retrieves summoner spell by ID.
   * @param {number} summonerSpellID - The id of the summoner spell. 
   */
  get(summonerSpellID) {
    return new Request(
      this.config,
      this.serviceName,
      `${this.resourceName}/${summonerSpellID}`,
      METHOD_NAMES.GET_SUMMONER_SPELL_BY_ID,
    );
  }
}

export default StaticSummonerSpellEndpoint;
