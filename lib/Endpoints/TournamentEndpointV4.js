import Endpoint from 'Endpoint'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class TournamentEndpointV4 extends Endpoint {
    constructor(config, limiter) {
        super()

        this.config = config

        this.create = this.createTournamentCode.bind(this)
        this.update = this.updateTournamentCode.bind(this)
        this.get = this.getTournamentByCode.bind(this)
        this.register = this.register.bind(this)
        this.registerProviderData = this.registerProviderData.bind(this)
        this.lobbyEvents = this.lobbyEvents.bind(this)

        this.serviceName = 'tournament'

        this.limiter = limiter
    }

    /**
     * Create a tournament code for the given tournament.
     *
     * Implements POST `/lol/tournament/v4/codes`.
     *
     * @param {number} tournamentID - The ID of the tournament from /lol/tournament/v4/tournaments.
     * @param {object} body - The optional POST body to pass in. See official docs.
     */
    createTournamentCode(tournamentID, body) {
        return new Request(
            this.config,
            this.serviceName,
            'codes',
            METHOD_NAMES.TOURNAMENT.CREATE_TOURNAMENT_CODE,
            'POST',
            this.limiter,
            body,
            true,
            4,
        ).query({ tournamentId: tournamentID })
    }

    /**
     * Update the pick type, map, spectator type, or allowed summoners for a code.
     *
     * Implements PUT `/lol/tournament/v4/codes/{tournamentCode}`.
     *
     * @param {string} tournamentCode - The code of the tournament to update.
     * @param {object} body - The update body. This shouldn't be empty (it would be pointless).
     */
    updateTournamentCode(tournamentCode, body) {
        if (typeof body !== 'object')
            throw new Error(
                'The body of updateTournamentCode should have an object argument',
            )
        if (Object.keys(body).length === 0)
            throw new Error(
                'The body of updateTournamentCode should not be empty',
            )
        return new Request(
            this.config,
            this.serviceName,
            `codes/${tournamentCode}`,
            METHOD_NAMES.TOURNAMENT.UPDATE_TOURNAMENT_CODE,
            'PUT',
            this.limiter,
            body,
            true,
            4,
        )
    }

    /**
     * Returns the tournament code DTO associated with a tournament code string.
     *
     * Implements GET `/lol/tournament/v4/codes/{tournamentCode}`.
     *
     * @param {string} tournamentCode - The code of the tournament.
     */
    getTournamentByCode(tournamentCode) {
        return new Request(
            this.config,
            this.serviceName,
            `codes/${tournamentCode}`,
            METHOD_NAMES.TOURNAMENT.GET_TOURNAMENT_CODE,
            'GET',
            this.limiter,
            null,
            true,
            4,
        )
    }

    /**
     * Creates a tournament and returns its ID.
     *
     * Implements POST `/lol/tournament/v4/tournaments`.
     *
     * @param {number} providerID - The ID of the provider from /lol/tournament/v4/providers.
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
            METHOD_NAMES.TOURNAMENT.REGISTER_TOURNAMENT,
            'POST',
            this.limiter,
            body,
            true,
            4,
        )
    }

    /**
     * Creates a tournament provider and return its ID.
     *
     * Implements POST `/lol/tournament/v4/providers`.
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
            METHOD_NAMES.TOURNAMENT.REGISTER_PROVIDER_DATA,
            'POST',
            this.limiter,
            body,
            true,
            4,
        )
    }

    /**
     * Gets a list of lobby events by tournament code.
     *
     * Implements GET `/lol/tournament/v4/lobby-events/by-code/{tournamentCode}`.
     *
     * @param {string} tournamentCode - The short code to look up lobby events for.
     */
    lobbyEvents(tournamentCode) {
        return new Request(
            this.config,
            this.serviceName,
            `lobby-events/by-code/${tournamentCode}`,
            METHOD_NAMES.TOURNAMENT.GET_LOBBY_EVENTS_BY_CODE,
            'GET',
            this.limiter,
            null,
            true,
            4,
        )
    }
}

export default TournamentEndpointV4
