// note that these matchlist calls are actually a part of the match endpoint
import MatchSuperclass from './MatchSuperclass';
import Request from 'RequestClient/Request';

class MatchlistEndpoint extends MatchSuperclass {
  constructor(config) {
    super();

    this.accountID = this.accountID.bind(this);

    this.config = config;

    this.by = {
      accountID: this.accountID,
    };
  }

  accountID(val) {
    return new Request(
      this.config,
      this.resourceName,
      `matchlists/by-account/${val}`,
    );
  }
}

export default MatchlistEndpoint;
