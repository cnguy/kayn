import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';

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
    );
  }
}

export default ChallengerEndpoint;
