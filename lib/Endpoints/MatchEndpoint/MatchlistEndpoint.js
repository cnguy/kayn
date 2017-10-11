import MatchSuperclass from './MatchSuperclass';
import Request from 'RequestClient/Request';

class MatchlistEndpoint extends MatchSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.by = {
      accountID: this.accountID.bind(this),
    };
  }

  accountID(accountID) {
    return new Request(
      this.config,
      this.serviceName,
      `matchlists/by-account/${accountID}`,
    );
  }
}

export default MatchlistEndpoint;
