import Endpoint from 'Endpoint'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class TournamentStubEndpointV4 extends Endpoint {
    constructor(config, limiter) {
        super()

        this.config = config

        this.create = this.createTournamentCode.bind(this)
        this.register = this.register.bind(this)
        this.registerProviderData = this.registerProviderData.bind(this)
        this.lobbyEvents = this.lobbyEvents.bind(this)

        this.serviceName = 'tournament-stub'

        this.limiter = limiter
    }

    /**
     * Create a mock tournament code for the given tournament.
     *
     * Implements POST `/lol/tournament-stub/v4/codes`.
     *
     * @param {number} tournamentID - The ID of the tournament from /lol/tournament-stub/v4/tournaments.
     * @param {object} body - The optional POST body to pass in. See official docs.
     */
    createTournamentCode(tournamentID, body) {
        return new Request(
            this.config,
            this.serviceName,
            'codes',
            METHOD_NAMES.TOURNAMENT_STUB.CREATE_TOURNAMENT_CODE_V4,
            'POST',
            this.limiter,
            body,
            true,
            4,
        ).query({ tournamentId: tournamentID })
    }

    /**
     * Creates a mock tournament and returns its ID.
     *
     * Implements POST `/lol/tournament-stub/v4/tournaments`.
     *
     * @param {number} providerID - The ID of the provider from /lol/tournament-stub/v4/providers.
     * @param {string} name - An optional name to pass in. It'll only be used if the length is > 0.
     */
    register(providerID, name = '') {
        const body = {
            providerId: providerID,
        }
        if (name.length > 0) body.name = name
        return new Request(
            this.config,
            this.serviceName,
            'tournaments',
            METHOD_NAMES.TOURNAMENT_STUB.REGISTER_TOURNAMENT_V4,
            'POST',
            this.limiter,
            body,
            true,
            4,
        )
    }

    /**
     * Creates a mock tournament provider and return its ID.
     *
     * Implements POST `/lol/tournament-stub/v4/providers`.
     *
     * @param {string} region - A region string ('na'/'euw'). Just use kayn's REGIONS dictionary.
     * @param {url} url - The provider's callback URL to which tournament game results in this region should be posted. See official docs.
     */
    registerProviderData(region = this.config.region.toUpperCase(), url) {
        const body = {
            region: region.toUpperCase(),
            url,
        }
        return new Request(
            this.config,
            this.serviceName,
            'providers',
            METHOD_NAMES.TOURNAMENT_STUB.REGISTER_PROVIDER_DATA_V4,
            'POST',
            this.limiter,
            body,
            true,
            4,
        )
    }

    /**
     * Gets a mock list of lobby events by tournament code.
     *
     * Implements GET `/lol/tournament-stub/v4/lobby-events/by-code/{tournamentCode}`.
     *
     * @param {string} tournamentCode - The short code to look up lobby events for.
     */
    lobbyEvents(tournamentCode) {
        return new Request(
            this.config,
            this.serviceName,
            `lobby-events/by-code/${tournamentCode}`,
            METHOD_NAMES.TOURNAMENT_STUB.GET_LOBBY_EVENTS_BY_CODE_V4,
            'GET',
            this.limiter,
            null,
            true,
            4,
        )
    }
}

export default TournamentStubEndpointV4
