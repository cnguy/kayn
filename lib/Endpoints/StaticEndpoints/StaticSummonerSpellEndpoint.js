import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

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
    return new Request(this.config, this.serviceName, this.resourceName);
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
    );
  }
}

export default StaticSummonerSpellEndpoint;
