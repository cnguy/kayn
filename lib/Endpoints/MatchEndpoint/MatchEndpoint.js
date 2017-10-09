import MatchSuperclass from './MatchSuperclass';
import Request from 'RequestClient/Request';

class MatchEndpoint extends MatchSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
    this.timeline = this.timeline.bind(this);
  }

  get(val) {
    return new Request(this.config, this.resourceName, `matches/${val}`);
  }

  timeline(val) {
    return new Request(
      this.config,
      this.resourceName,
      `timelines/by-match/${val}`,
    );
  }
}

export default MatchEndpoint;
