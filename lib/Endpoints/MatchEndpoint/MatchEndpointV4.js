import MatchSuperclass from './MatchSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class MatchEndpointV4 extends MatchSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.get = this.get.bind(this)
        this.timeline = this.timeline.bind(this)

        this.Tournament = {
            listMatchIDs: this.listMatchIDs.bind(this),
            get: this.getTournamentMatch.bind(this),
        }

        this.limiter = limiter
    }

    /**
     * Get match by match ID.
     *
     * Implements GET `/lol/match/v4/matches/{matchId}`.
     *
     * @param {number} matchID - The ID of the match.
     */
    get(matchID) {
        return new Request(
            this.config,
            this.serviceName,
            `matches/${matchID}`,
            METHOD_NAMES.MATCH.GET_MATCH_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get match timeline by match ID.
     *
     * Implements GET `/lol/match/v4/timelines/by-match/{matchId}`.
     *
     * @param {number} matchID - The ID of the match.
     */
    timeline(matchID) {
        return new Request(
            this.config,
            this.serviceName,
            `timelines/by-match/${matchID}`,
            METHOD_NAMES.MATCH.GET_MATCH_TIMELINE_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get match IDs by tournament code.
     *
     * Implements GET `/lol/match/v4/matches/by-tournament-code/{tournamentCode}/ids`.
     *
     * @param {string} tournamentCode - The code of the tournament.
     */
    listMatchIDs(tournamentCode) {
        return new Request(
            this.config,
            this.serviceName,
            `matches/by-tournament-code/${tournamentCode}/ids`,
            METHOD_NAMES.MATCH.GET_MATCH_IDS_BY_TOURNAMENT_CODE_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get match by match ID and tournament code.
     *
     * Implements GET `/lol/match/v4/matches/{matchId}/by-tournament-code/{tournamentCode}`.
     *
     * @param {number} matchID - The ID of the match.
     * @param {string} tournamentCode - The code of the tournament.
     */
    getTournamentMatch(matchID, tournamentCode) {
        return new Request(
            this.config,
            this.serviceName,
            `matches/${matchID}/by-tournament-code/${tournamentCode}`,
            METHOD_NAMES.MATCH.GET_MATCH_BY_TOURNAMENT_CODE_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default MatchEndpointV4
