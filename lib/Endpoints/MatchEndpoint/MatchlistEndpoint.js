// note that these matchlist calls are actually a part of the match endpoint
import MatchSuperclass from './MatchSuperclass';
import Request from 'RequestClient/Request';

class MatchlistEndpoint extends MatchSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
  }

  get(val) {
    return new Request(
      this.config,
      this.resourceName,
      `matchlists/by-account/${val}`,
    );
  }
}

export default MatchlistEndpoint;
