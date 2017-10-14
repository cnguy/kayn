import MatchSuperclass from './MatchSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class MatchEndpoint extends MatchSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
    this.timeline = this.timeline.bind(this);
  }

  get(matchID) {
    return new Request(
      this.config,
      this.serviceName,
      `matches/${matchID}`,
      METHOD_NAMES.MATCH.GET_MATCH,
    );
  }

  timeline(matchID) {
    return new Request(
      this.config,
      this.serviceName,
      `timelines/by-match/${matchID}`,
      METHOD_NAMES.MATCH.GET_MATCH_TIMELINE,
    );
  }
}

export default MatchEndpoint;
