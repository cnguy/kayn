import Endpoint from 'Endpoint'

class PlatformSuperclass extends Endpoint {
    constructor() {
        super()

        this.serviceName = 'platform'
    }
}

export default PlatformSuperclass
