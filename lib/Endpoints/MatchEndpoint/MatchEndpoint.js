import MatchSuperclass from './MatchSuperclass';
import Request from 'RequestClient/Request';

class MatchEndpoint extends MatchSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
    this.timeline = this.timeline.bind(this);
  }

  get(matchID) {
    return new Request(this.config, this.serviceName, `matches/${matchID}`);
  }

  timeline(matchID) {
    return new Request(
      this.config,
      this.serviceName,
      `timelines/by-match/${matchID}`,
    );
  }
}

export default MatchEndpoint;
