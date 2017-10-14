import SpectatorSuperclass from './SpectatorSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class FeaturedGamesEndpoint extends SpectatorSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
  }

  list() {
    return new Request(
      this.config,
      this.serviceName,
      'featured-games',
      METHOD_NAMES.SPECTATOR.GET_FEATURED_GAMES,
    );
  }
}

export default FeaturedGamesEndpoint;
