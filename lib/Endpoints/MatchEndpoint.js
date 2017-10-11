import Endpoint from 'Endpoint';
import Request from 'RequestClient/Request';

class MatchEndpoint extends Endpoint {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
    this.list = this.list.bind(this);
    this.timeline = this.timeline.bind(this);

    this.resourceName = 'match';
  }

  get(matchID) {
    return new Request(this.config, this.resourceName, `matches/${matchID}`);
  }

  list(accountID) {
    return new Request(
      this.config,
      this.resourceName,
      `matchlists/by-account/${accountID}`,
    );
  }

  timeline(matchID) {
    return new Request(
      this.config,
      this.resourceName,
      `timelines/by-match/${matchID}`,
    );
  }
}

export default MatchEndpoint;
