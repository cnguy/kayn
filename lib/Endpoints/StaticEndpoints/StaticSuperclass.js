import Endpoint from 'Endpoint';

class StaticSuperclass extends Endpoint {
  constructor() {
    super();

    this.serviceName = 'static-data';
  }
}

export default StaticSuperclass;
