import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class ChallengerEndpoint extends LeagueSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
  }

  list(queueName) {
    return new Request(
      this.config,
      this.serviceName,
      `challengerleagues/by-queue/${queueName}`,
      METHOD_NAMES.LEAGUE.GET_CHALLENGER_LEAGUE,
    );
  }
}

export default ChallengerEndpoint;
