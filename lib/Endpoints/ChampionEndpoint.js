import PlatformSuperclass from './PlatformSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class ChampionEndpoint extends PlatformSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
    this.list = this.list.bind(this);

    this.serviceName = 'platform';
  }

  get(val) {
    return new Request(
      this.config,
      this.serviceName,
      `champions/${val}`,
      METHOD_NAMES.CHAMPION.GET_CHAMPION_BY_ID,
    );
  }

  list() {
    return new Request(
      this.config,
      this.serviceName,
      `champions`,
      METHOD_NAMES.CHAMPION.GET_CHAMPIONS,
    );
  }
}

export default ChampionEndpoint;
