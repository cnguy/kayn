import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class MasterEndpoint extends LeagueSuperclass {
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
      METHOD_NAMES.LEAGUE.GET_MASTER_LEAGUE,
    );
  }
}

export default MasterEndpoint;
