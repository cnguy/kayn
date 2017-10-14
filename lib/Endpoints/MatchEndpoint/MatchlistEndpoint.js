import MatchSuperclass from './MatchSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

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
      METHOD_NAMES.MATCH.GET_MATCH_LIST,
    );
  }
}

export default MatchlistEndpoint;
