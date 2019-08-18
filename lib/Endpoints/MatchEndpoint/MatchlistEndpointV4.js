import MatchSuperclass from './MatchSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class MatchlistEndpointV4 extends MatchSuperclass {
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
     * Implements GET `/lol/match/v4/matchlists/by-account/{encryptedAccountId}`.
     *
     * @param {string} accountID - The account ID of the summoner.
     */
    accountID(accountID) {
        return new Request(
            this.config,
            this.serviceName,
            `matchlists/by-account/${accountID}`,
            METHOD_NAMES.MATCH.GET_MATCHLIST_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get matchlist for last 20 matches played on given account ID and platform ID.
     * This is here for non-breaking purposes as there used to be a /recent endpoint.
     *
     * @param {number} accountID - The account ID of the summoner.
     */
    getRecentMatchlistByAccountID(accountID) {
        return this.accountID(accountID).query({
            beginIndex: 0,
            endIndex: 20,
        })
    }
}

export default MatchlistEndpointV4
