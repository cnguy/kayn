import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';

class ChallengerEndpoint extends LeagueSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
  }

  list(queueID) {
    return new Request(
      this.config,
      this.serviceName,
      `masterleagues/by-queue/${queueID}`,
    );
  }
}

export default ChallengerEndpoint;
