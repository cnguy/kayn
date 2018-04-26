import MatchSuperclass from './MatchSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class MatchlistEndpoint extends MatchSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            accountID: this.accountID.bind(this),
        }

        this.Recent = {
            by: {
                accountID: this.getRecentMatchlistByAccountID.bind(this),
            },
        }

        this.limiter = limiter
    }

    /**
     * Get matchlist for games played on given account ID and platform ID and filtered using given filter parameters, if any.
     *
     * Implements GET `/lol/match/v3/matchlists/by-account/{accountId}`.
     *
     * @param {number} accountID - The account ID of the summoner.
     */
    accountID(accountID) {
        return new Request(
            this.config,
            this.serviceName,
            `matchlists/by-account/${accountID}`,
            METHOD_NAMES.MATCH.GET_MATCHLIST,
            'GET',
            this.limiter,
        )
    }

    /**
     * Get matchlist for last 20 matches played on given account ID and platform ID.
     * This is here for non-breaking purposes as there used to be a /recent endpoint.
     *
     * @param {number} accountID - The account ID of the summoner.
     */
    getRecentMatchlistByAccountID(accountID) {
        return this.accountID(accountID).query({ beginIndex: 0, endIndex: 20 })
    }
}

export default MatchlistEndpoint
