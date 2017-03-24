(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define("kindred-api", ["module", 'request', 'chalk'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('request'), require('chalk'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.request, global.chalk);
        global.kindredApi = mod.exports;
    }
})(this, function (module, request, chalk) {
    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var versions = {
        "champion": 1.2,
        "current-game": 1.0,
        "featured-games": 1.0,
        "game": 1.3,
        "league": 2.5,
        "static-data": 1.2,
        "status": 1.0,
        "match": 2.2,
        "match-list": 2.2,
        "runes-masteries": 1.4,
        "stats": 1.3,
        "summoner": 1.4
    };

    var regions = {
        BRAZIL: 'br',
        EUROPE: 'eune',
        EUROPE_WEST: 'euw',
        KOREA: 'kr',
        LATIN_AMERICA_NORTH: 'lan',
        LATIN_AMERICA_SOUTH: 'las',
        NORTH_AMERICA: 'na',
        OCEANIA: 'oce',
        RUSSIA: 'ru',
        TURKEY: 'tr',
        JAPAN: 'jp'
    };

    var Kindred$1 = function () {
        function Kindred$1(key) {
            var defaultRegion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : regions['NORTH_AMERICA'];

            _classCallCheck(this, Kindred$1);

            this.key = key;
            this.defaultRegion = defaultRegion;
        }

        _createClass(Kindred$1, [{
            key: "_sanitizeName",
            value: function _sanitizeName(name) {
                return name.replace(/\s/g, '').toLowerCase();
            }
        }, {
            key: "_makeUrl",
            value: function _makeUrl(url, region) {
                return "https://" + region + ".api.riotgames.com/api/lol/" + region + "/" + url + "?api_key=" + this.key;
            }
        }, {
            key: "_baseRequest",
            value: function _baseRequest(_ref, cb) {
                var url = _ref.url,
                    region = _ref.region,
                    _ref$staticReq = _ref.staticReq,
                    staticReq = _ref$staticReq === undefined ? false : _ref$staticReq,
                    _ref$options = _ref.options,
                    options = _ref$options === undefined ? {} : _ref$options;

                if (!region) region = this.defaultRegion;
                var proxy = staticReq ? 'global' : region;
                var reqUrl = this._makeUrl(url, proxy);
                if (!cb) return console.log(chalk.red("error: No callback passed in for the method call regarding `" + chalk.yellow(reqUrl) + "`"));

                request({ url: reqUrl, qs: options }, function (error, response, body) {
                    var statusMessage = void 0;
                    var statusCode = response.statusCode;

                    if (statusCode >= 200 && statusCode < 300) {
                        statusMessage = chalk.green(statusCode);
                    } else if (statusCode >= 400 && statusCode < 500) {
                        statusMessage = chalk.red(statusCode);
                    } else if (statusCode >= 500) {
                        statusMessage = chalk.bold.red(statusCode);
                    }

                    console.log('status code:', response && statusMessage);

                    if (cb) return cb(error, body);
                });
            }
        }, {
            key: "_summonerRequest",
            value: function _summonerRequest(_ref2, cb) {
                var endUrl = _ref2.endUrl,
                    region = _ref2.region;

                return this._baseRequest({
                    url: "v" + versions['summoner'] + "/summoner/" + endUrl, region: region
                }, cb);
            }
        }, {
            key: "_leagueRequest",
            value: function _leagueRequest(_ref3, cb) {
                var endUrl = _ref3.endUrl,
                    region = _ref3.region,
                    _ref3$options = _ref3.options,
                    options = _ref3$options === undefined ? {} : _ref3$options;

                return this._baseRequest({
                    url: "v" + versions['league'] + "/league/" + endUrl, region: region, options: options
                }, cb);
            }
        }, {
            key: "getChallengers",
            value: function getChallengers(_ref4, cb) {
                var region = _ref4.region,
                    _ref4$type = _ref4.type,
                    type = _ref4$type === undefined ? 'RANKED_SOLO_5x5' : _ref4$type;

                return this._leagueRequest({
                    endUrl: 'challenger', region: region, options: { type: type }
                }, cb);
            }
        }, {
            key: "getMasters",
            value: function getMasters(_ref5, cb) {
                var region = _ref5.region,
                    _ref5$type = _ref5.type,
                    type = _ref5$type === undefined ? 'RANKED_SOLO_5x5' : _ref5$type;

                return this._leagueRequest({
                    endUrl: 'master', region: region, options: { type: type }
                }, cb);
            }
        }, {
            key: "getSummoners",
            value: function getSummoners(_ref6, cb) {
                var _this = this;

                var region = _ref6.region,
                    names = _ref6.names,
                    _ref6$ids = _ref6.ids,
                    ids = _ref6$ids === undefined ? null : _ref6$ids;

                if (Array.isArray(names)) {
                    return this._summonerRequest({
                        endUrl: "by-name/" + names.map(function (name) {
                            return _this._sanitizeName(name);
                        }).join(',')
                    }, cb);
                } else if (typeof names === 'string') {
                    return this._summonerRequest({
                        endUrl: "by-name/" + names
                    }, cb);
                }
            }
        }]);

        return Kindred$1;
    }();

    module.exports = Kindred$1;
});