import SpectatorSuperclass from './SpectatorSuperclass';
import Request from 'RequestClient/Request';

class FeaturedGamesEndpoint extends SpectatorSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
  }

  list() {
    return new Request(this.config, this.serviceName, 'featured-games');
  }
}

export default FeaturedGamesEndpoint;
