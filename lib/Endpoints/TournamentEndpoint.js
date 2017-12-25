import Endpoint from 'Endpoint';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class TournamentEndpoint extends Endpoint {
    constructor(config, limiter) {
        super();

        this.config = config;

        this.create = this.createTournamentCode.bind(this);
        this.get = this.getTournamentByCode.bind(this);
        this.register = this.register.bind(this);
        this.registerProviderData = this.registerProviderData.bind(this);
        this.lobbyEvents = this.lobbyEvents.bind(this);

        this.serviceName = 'tournament';

        this.limiter = limiter;
    }

    /**
     * Create a tournament code for the given tournament.
     *
     * Implements /lol/tournament/v3/codes.
     */
    createTournamentCode(tournamentCode, body) {
        return new Request(
            this.config,
            this.serviceName,
            'codes',
            METHOD_NAMES.TOURNAMENT.CREATE_TOURNAMENT_CODE,
            'POST',
            this.limiter,
            body,
            true,
        );
    }

    /**
     * Returns the tournament code DTO associated with a tournament code string.
     *
     * Implements /lol/tournament/v3/codes/{tournamentCode}.
     *
     * @param {*} tournamentCode
     * @param {*} body
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
        );
    }

    /**
     * Creates a tournament and returns its ID.
     *
     * Implements /lol/tournament/v3/tournaments.
     */
    register(providerID, name = '') {
        const body = {
            providerId: providerID,
        };
        if (name.length > 0) body.name = name;
        return new Request(
            this.config,
            this.serviceName,
            'tournaments',
            METHOD_NAMES.TOURNAMENT.REGISTER_TOURNAMENT,
            'POST',
            this.limiter,
            body,
            true,
        );
    }

    /**
     * Creates a tournament provider and return its ID.
     *
     * Implements /lol/tournament/v3/providers.
     */
    registerProviderData(region = this.config.region.toUpperCase(), url) {
        const body = {
            region: region.toUpperCase(),
            url,
        };
        return new Request(
            this.config,
            this.serviceName,
            'providers',
            METHOD_NAMES.TOURNAMENT.REGISTER_PROVIDER_DATA,
            'POST',
            this.limiter,
            body,
            true,
        );
    }

    /**
     * Gets a list of lobby events by tournament code.
     *
     * Implements /lol/tournament/v3/lobby-events/by-code/{tournamentCode}.
     *
     * @param {*} tournamentCode
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
        );
    }
}

export default TournamentEndpoint;
