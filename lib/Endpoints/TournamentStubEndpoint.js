import Endpoint from 'Endpoint';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class TournamentStubEndpoint extends Endpoint {
    constructor(config, limiter) {
        super();

        this.config = config;

        this.createTournamentCode = this.createTournamentCode.bind(this);
        this.register = this.register.bind(this);
        this.registerProviderData = this.registerProviderData.bind(this);
        this.lobbyEvents = this.lobbyEvents.bind(this);

        this.serviceName = 'tournament-stub';

        this.limiter = limiter;
    }

    /**
     * Create a mock tournament code for the given tournament.
     *
     * Implements /lol/tournament-stub/v3/codes.
     */
    createTournamentCode(tournamentCode, body) {
        return new Request(
            this.config,
            this.serviceName,
            'codes',
            METHOD_NAMES.TOURNAMENT_STUB.CREATE_TOURNAMENT_CODE,
            'POST',
            this.limiter,
            body,
            true,
        ).query({ tournamentId: tournamentCode });
    }

    /**
     * Creates a mock tournament and returns its ID.
     *
     * Implements /lol/tournament-stub/v3/tournaments.
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
            METHOD_NAMES.TOURNAMENT_STUB.REGISTER_TOURNAMENT,
            'POST',
            this.limiter,
            body,
            true,
        );
    }

    /**
     * Creates a mock tournament provider and return its ID.
     *
     * Implements /lol/tournament-stub/v3/providers.
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
            METHOD_NAMES.TOURNAMENT_STUB.REGISTER_PROVIDER_DATA,
            'POST',
            this.limiter,
            body,
            true,
        );
    }

    /**
     * Gets a mock list of lobby events by tournament code.
     *
     * Implements /lol/tournament-stub/v3/lobby-events/by-code/{tournamentCode}.
     *
     * @param {*} tournamentCode
     */
    lobbyEvents(tournamentCode) {
        return new Request(
            this.config,
            this.serviceName,
            `lobby-events/by-code/${tournamentCode}`,
            METHOD_NAMES.TOURNAMENT_STUB.GET_LOBBY_EVENTS_BY_CODE,
            'GET',
            this.limiter,
            null,
            true,
        );
    }
}

export default TournamentStubEndpoint;
