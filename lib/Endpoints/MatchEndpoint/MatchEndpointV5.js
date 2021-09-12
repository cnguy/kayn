import METHOD_NAMES from 'Enums/method-names'
import Request from 'RequestClient/Request'
import MatchSuperclass from './MatchSuperclass'

class MatchEndpointV5 extends MatchSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.get = this.get.bind(this)
        this.timeline = this.timeline.bind(this)
        this.by = {
            puuid: this.puuid.bind(this),
        }
        this.limiter = limiter
    }

    /**
     * Get match by match ID.
     *
     * Implements GET `/lol/match/v5/matches/{matchId}`.
     *
     * @param {number} matchID - The ID of the match.
     */
    get(matchID) {
        return new Request(
            this.config,
            this.serviceName,
            `matches/${matchID}`,
            METHOD_NAMES.MATCH.GET_MATCH_V5,
            'GET',
            this.limiter,
            null,
            false,
            5,
        )
    }

     /**
     * Get matchlist for games played on given account ID and platform ID and filtered using given filter parameters, if any.
     *
     * Implements GET `/lol/match/v5/matches/by-puuid/{puuid}/ids`.
     *
     * @param {string} puuid - The account ID of the summoner.
     */
      puuid(puuid) {
        return new Request(
            this.config,
            this.serviceName,
            `matches/by-puuid/${puuid}/ids`,
            METHOD_NAMES.MATCH.GET_MATCHLIST_V5,
            'GET',
            this.limiter,
            null,
            false,
            5,
        )
    }


    /**
     * Get match timeline by match ID.
     *
     * Implements GET `/lol/match/v5/timelines/by-match/{matchId}`.
     *
     * @param {number} matchID - The ID of the match.
     */
    timeline(matchID) {
        return new Request(
            this.config,
            this.serviceName,
            `matches/${matchID}/timeline`,
            METHOD_NAMES.MATCH.GET_MATCH_TIMELINE_V5,
            'GET',
            this.limiter,
            null,
            false,
            5,
        )
    }

    
}

export default MatchEndpointV5
