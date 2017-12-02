require('dotenv').config();

import RiotRateLimiter from 'riot-ratelimiter';
const RRLStrategies = require('riot-ratelimiter/dist/RateLimiter').STRATEGY;

import { struct } from 'superstruct';
import merge from 'lodash.merge';

import ParameterHelper from './Utils/ParameterHelper';
import Errors from './Errors';

import ChallengerEndpoint from './Endpoints/LeagueEndpoint/ChallengerEndpoint';
import ChampionEndpoint from './Endpoints/ChampionEndpoint';
import ChampionMasteryEndpoint from './Endpoints/ChampionMasteryEndpoint';
import CurrentGameEndpoint from './Endpoints/SpectatorEndpoint/CurrentGameEndpoint';
import FeaturedGamesEndpoint from './Endpoints/SpectatorEndpoint/FeaturedGamesEndpoint';
import LeagueEndpoint from './Endpoints/LeagueEndpoint/LeagueEndpoint';
import LeaguePositionsEndpoint from './Endpoints/LeagueEndpoint/LeaguePositionsEndpoint';
import LeaguesEndpoint from './Endpoints/LeagueEndpoint/LeaguesEndpoint';
import MasterEndpoint from './Endpoints/LeagueEndpoint/MasterEndpoint';
import MatchEndpoint from './Endpoints/MatchEndpoint/MatchEndpoint';
import MatchlistEndpoint from './Endpoints/MatchEndpoint/MatchlistEndpoint';
import StaticChampionEndpoint from './Endpoints/StaticEndpoints/StaticChampionEndpoint';
import StaticItemEndpoint from './Endpoints/StaticEndpoints/StaticItemEndpoint';
import StaticLanguageStringsEndpoint from './Endpoints/StaticEndpoints/StaticLanguageStringsEndpoint';
import StaticLanguageEndpoint from './Endpoints/StaticEndpoints/StaticLanguageEndpoint';
import StaticMapEndpoint from './Endpoints/StaticEndpoints/StaticMapEndpoint';
import StaticMasteryEndpoint from './Endpoints/StaticEndpoints/StaticMasteryEndpoint';
import StaticProfileIconEndpoint from './Endpoints/StaticEndpoints/StaticProfileIconEndpoint';
import StaticRealmEndpoint from './Endpoints/StaticEndpoints/StaticRealmEndpoint';
import StaticRuneEndpoint from './Endpoints/StaticEndpoints/StaticRuneEndpoint';
import StaticSummonerSpellEndpoint from './Endpoints/StaticEndpoints/StaticSummonerSpellEndpoint.js';
import StaticVersionEndpoint from './Endpoints/StaticEndpoints/StaticVersionEndpoint';
import StatusEndpoint from './Endpoints/StatusEndpoint';
import SummonerEndpoint from './Endpoints/SummonerEndpoint';
import ThirdPartyCodeEndpoint from './Endpoints/ThirdPartyCodeEndpoint';

const defaultConfig = {
    region: 'na',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
        burst: false,
    },
    cacheOptions: {
        cache: null,
        ttls: {},
    },
};

const ttlsValidator = {};
Object.keys(METHOD_NAMES).forEach(s => {
    Object.keys(METHOD_NAMES[s]).forEach(
        t => (ttlsValidator[METHOD_NAMES[s][t]] = 'number?'),
    );
});

const KaynConfig = struct({
    region: 'string',
    debugOptions: {
        isEnabled: 'boolean',
        showKey: 'boolean',
    },
    requestOptions: {
        shouldRetry: 'boolean',
        numberOfRetriesBeforeAbort: 'number',
        delayBeforeRetry: 'number',
        burst: 'boolean',
    },
    cacheOptions: {
        cache: 'any',
        ttls: ttlsValidator,
    },
    key: 'string',
});

class Kayn {
    constructor(key = process.env.RIOT_LOL_API_KEY, config = defaultConfig) {
        if (!ParameterHelper.isKeyValid(key)) {
            throw new Error('Failed to initialize Kayn');
        }

        this.config = KaynConfig(merge(defaultConfig, { key, ...config }));

        const strategy = this.config.requestOptions.burst
            ? RRLStrategies.BURST
            : RRLStrategies.SPREAD;

        this.limiter = new RiotRateLimiter({
            strategy,
        });

        // Set up interfaces
        this.Challenger = new ChallengerEndpoint(this.config, this.limiter);
        this.Champion = new ChampionEndpoint(this.config, this.limiter);
        this.ChampionMastery = new ChampionMasteryEndpoint(
            this.config,
            this.limiter,
        );
        this.CurrentGame = new CurrentGameEndpoint(this.config, this.limiter);
        this.FeaturedGames = new FeaturedGamesEndpoint(
            this.config,
            this.limiter,
        );
        this.League = new LeagueEndpoint(this.config, this.limiter);
        this.LeaguePositions = new LeaguePositionsEndpoint(
            this.config,
            this.limiter,
        );
        this.Leagues = new LeaguesEndpoint(this.config, this.limiter);
        this.Master = new MasterEndpoint(this.config, this.limiter);
        this.Match = new MatchEndpoint(this.config, this.limiter);
        this.Matchlist = new MatchlistEndpoint(this.config, this.limiter);
        this.Static = {
            Champion: new StaticChampionEndpoint(this.config, this.limiter),
            Item: new StaticItemEndpoint(this.config, this.limiter),
            LanguageString: new StaticLanguageStringsEndpoint(
                this.config,
                this.limiter,
            ),
            Language: new StaticLanguageEndpoint(this.config, this.limiter),
            Map: new StaticMapEndpoint(this.config, this.limiter),
            Mastery: new StaticMasteryEndpoint(this.config, this.limiter),
            ProfileIcon: new StaticProfileIconEndpoint(
                this.config,
                this.limiter,
            ),
            Realm: new StaticRealmEndpoint(this.config, this.limiter),
            Rune: new StaticRuneEndpoint(this.config, this.limiter),
            SummonerSpell: new StaticSummonerSpellEndpoint(
                this.config,
                this.limiter,
            ),
            Version: new StaticVersionEndpoint(this.config, this.limiter),
        };
        this.Summoner = new SummonerEndpoint(this.config, this.limiter);
        this.Status = new StatusEndpoint(this.config, this.limiter);
        this.ThirdPartyCode = new ThirdPartyCodeEndpoint(
            this.config,
            this.limiter,
        );
    }

    flushCache(cb) {
        return new Promise((resolve, reject) => {
            if (!cb) {
                cb = (err, data) => (err ? reject(err) : resolve(data));
            }
            this.config.cacheOptions.cache.flushCache(cb);
        });
    }
}

import REGIONS from 'Enums/regions';
import METHOD_NAMES from 'Enums/method-names';
import BasicJSCache from 'Caches/BasicJSCache';
import RedisCache from 'Caches/RedisCache';

const init = key => config => {
    return new Kayn(key, config);
};

module.exports = {
    Kayn: init,
    REGIONS,
    METHOD_NAMES,
    BasicJSCache,
    RedisCache,
};
