require('dotenv').config()

import RiotRateLimiter from 'riot-ratelimiter-temp'
const RRLStrategies = require('riot-ratelimiter-temp/dist/RateLimiter').STRATEGY

import merge from 'lodash.merge'

import Logger from './Logger'

import ParameterHelper from './Utils/ParameterHelper'

import ChallengerEndpoint from './Endpoints/LeagueEndpoint/ChallengerEndpoint'
import ChampionEndpoint from './Endpoints/ChampionEndpoint'
import ChampionMasteryEndpoint from './Endpoints/ChampionMasteryEndpoint'
import ChampionRotationEndpoint from './Endpoints/ChampionRotationEndpoint'
import CurrentGameEndpoint from './Endpoints/SpectatorEndpoint/CurrentGameEndpoint'
import DDragonChampionEndpoint from './Endpoints/DDragonEndpoints/DDragonChampionEndpoint'
import DDragonItemEndpoint from './Endpoints/DDragonEndpoints/DDragonItemEndpoint'
import DDragonLanguageEndpoint from './Endpoints/DDragonEndpoints/DDragonLanguageEndpoint'
import DDragonLanguageStringEndpoint from './Endpoints/DDragonEndpoints/DDragonLanguageStringEndpoint'
import DDragonMapEndpoint from './Endpoints/DDragonEndpoints/DDragonMapEndpoint'
import DDragonProfileIconEndpoint from './Endpoints/DDragonEndpoints/DDragonProfileIconEndpoint'
import DDragonRealmEndpoint from './Endpoints/DDragonEndpoints/DDragonRealmEndpoint'
import DDragonRunesReforgedEndpoint from './Endpoints/DDragonEndpoints/DDragonRunesReforgedEndpoint'
import DDragonSummonerSpellEndpoint from './Endpoints/DDragonEndpoints/DDragonSummonerSpellEndpoint'
import DDragonVersionEndpoint from './Endpoints/DDragonEndpoints/DDragonVersionEndpoint'
import FeaturedGamesEndpoint from './Endpoints/SpectatorEndpoint/FeaturedGamesEndpoint'
import LeagueEndpoint from './Endpoints/LeagueEndpoint/LeagueEndpoint'
import LeaguePositionsEndpoint from './Endpoints/LeagueEndpoint/LeaguePositionsEndpoint'
import MasterEndpoint from './Endpoints/LeagueEndpoint/MasterEndpoint'
import MatchEndpoint from './Endpoints/MatchEndpoint/MatchEndpoint'
import MatchlistEndpoint from './Endpoints/MatchEndpoint/MatchlistEndpoint'
import StatusEndpoint from './Endpoints/StatusEndpoint'
import SummonerEndpoint from './Endpoints/SummonerEndpoint'
import ThirdPartyCodeEndpoint from './Endpoints/ThirdPartyCodeEndpoint'
import TournamentStubEndpoint from './Endpoints/TournamentStubEndpoint'
import TournamentEndpoint from './Endpoints/TournamentEndpoint'

import DEFAULT_TTLS, { makeTTLsFromGroupedTTLs } from './Enums/default-ttls'

import { DEFAULT_KAYN_CONFIG, KAYN_CONFIG_STRUCT } from './KaynConfig'

class Kayn {
    constructor(
        key = process.env.RIOT_LOL_API_KEY,
        config = DEFAULT_KAYN_CONFIG,
    ) {
        if (!ParameterHelper.isKeyValid(key)) {
            throw new Error(
                'Failed to initialize Kayn! API key is not a non-empty string.',
            )
        }

        // Make sure that the rest of the sane, nested defaults are set.
        // The source object here is the user config,
        // while the destination is the default config.
        // Extra merge is used to prevent mutation of original default config.
        // Merge is needed for deep-merging.
        this.config = KAYN_CONFIG_STRUCT(
            merge(merge({}, DEFAULT_KAYN_CONFIG), { key, ...config }),
        )

        const strategy = this.config.requestOptions.burst
            ? RRLStrategies.BURST
            : RRLStrategies.SPREAD

        this.limiter = new RiotRateLimiter({
            strategy,
        })

        if (this.config.debugOptions.isEnabled) {
            // Not pure but whatever.
            const configCopy = { ...this.config }
            if (!configCopy.debugOptions.showKey) {
                delete configCopy.key
            }
            Logger(this.config)
            this.config.debugOptions.loggers.initLogger(
                'with config:\n%O',
                configCopy,
            )
        }

        // Handle caching time-to-lives.
        if (this.config.cacheOptions.cache) {
            /*
                Start by checking if default is used. If so, set it.
                Next, merge grouped ttls and then singular ttls.
                Finally, merge final, old `ttls` prop for backwards-compatibility.
                We use this as the source of truth for cache ttls.
            */
            let finalTTLs = {}
            if (this.config.cacheOptions.timeToLives.useDefault) {
                finalTTLs = merge(finalTTLs, DEFAULT_TTLS)
            }
            finalTTLs = merge(
                finalTTLs,
                makeTTLsFromGroupedTTLs(
                    this.config.cacheOptions.timeToLives.byGroup,
                ),
                this.config.cacheOptions.timeToLives.byMethod,
                this.config.cacheOptions.ttls,
            )
            this.config.cacheOptions.ttls = finalTTLs
        }

        // Set up interfaces.
        this.Challenger = new ChallengerEndpoint(this.config, this.limiter)
        this.Champion = new ChampionEndpoint(this.config, this.limiter)
        this.ChampionMastery = new ChampionMasteryEndpoint(
            this.config,
            this.limiter,
        )
        this.ChampionRotation = new ChampionRotationEndpoint(
            this.config,
            this.limiter,
        )
        this.CurrentGame = new CurrentGameEndpoint(this.config, this.limiter)
        this.DDragon = {
            Champion: new DDragonChampionEndpoint(this.config),
            Item: new DDragonItemEndpoint(this.config),
            Language: new DDragonLanguageEndpoint(this.config),
            LanguageString: new DDragonLanguageStringEndpoint(this.config),
            Map: new DDragonMapEndpoint(this.config),
            ProfileIcon: new DDragonProfileIconEndpoint(this.config),
            Realm: new DDragonRealmEndpoint(this.config),
            RunesReforged: new DDragonRunesReforgedEndpoint(this.config),
            SummonerSpell: new DDragonSummonerSpellEndpoint(this.config),
            Version: new DDragonVersionEndpoint(this.config),
        }
        this.FeaturedGames = new FeaturedGamesEndpoint(
            this.config,
            this.limiter,
        )
        this.League = new LeagueEndpoint(this.config, this.limiter)
        this.LeaguePositions = new LeaguePositionsEndpoint(
            this.config,
            this.limiter,
        )
        this.Master = new MasterEndpoint(this.config, this.limiter)
        this.Match = new MatchEndpoint(this.config, this.limiter)
        this.Matchlist = new MatchlistEndpoint(this.config, this.limiter)
        this.Summoner = new SummonerEndpoint(this.config, this.limiter)
        this.Status = new StatusEndpoint(this.config, this.limiter)
        this.ThirdPartyCode = new ThirdPartyCodeEndpoint(
            this.config,
            this.limiter,
        )
        this.TournamentStub = new TournamentStubEndpoint(
            this.config,
            this.limiter,
        )
        this.Tournament = new TournamentEndpoint(this.config, this.limiter)

        if (this.config.debugOptions.isEnabled) {
            this.config.debugOptions.loggers.initLogger(
                'Initialized interfaces. Ready!',
            )
        }
    }

    flushCache(cb) {
        return new Promise((resolve, reject) => {
            if (!cb) {
                cb = (err, data) => (err ? reject(err) : resolve(data))
            }
            this.config.cacheOptions.cache.flushCache(cb)
        })
    }
}

import REGIONS from 'Enums/regions'
import METHOD_NAMES from 'Enums/method-names'
import BasicJSCache from 'Caches/BasicJSCache'
import LRUCache from 'Caches/LRUCache'
import RedisCache from 'Caches/RedisCache'

const init = key => config => new Kayn(key, config)

module.exports = {
    Kayn: init,
    REGIONS,
    METHOD_NAMES,
    BasicJSCache,
    LRUCache,
    RedisCache,
}
