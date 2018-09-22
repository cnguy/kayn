import { expect, should, assert } from 'chai'

import DDragonRequest, {
    DDragonRequestTypes,
    ddragonRequestTypeToUrl,
} from '../../lib/RequestClient/DDragonRequest'

describe('DDragonRequest', function() {
    describe('ddragonRequestTypeToUrl', function() {
        it('should create correct `version` url', function() {
            const urlInformation = {
                endpoint: 'na.json',
            }
            const url = ddragonRequestTypeToUrl(
                DDragonRequestTypes.REALMS,
                urlInformation,
            )
            expect(url).to.equal(
                'https://ddragon.leagueoflegends.com/realms/na.json',
            )
        })

        it('should create correct `data` url', function() {
            const urlInformation = {
                endpoint: 'champion.json',
                version: '8.5.1',
                locale: 'en_US',
            }
            const url = ddragonRequestTypeToUrl(
                DDragonRequestTypes.CDN.DATA,
                urlInformation,
            )
            expect(url).to.equal(
                'https://ddragon.leagueoflegends.com/cdn/8.5.1/data/en_US/champion.json',
            )
        })

        it('should throw an error if `data` url does not have a version', function() {
            const urlInformation = {
                endpoint: 'champion.json',
                locale: 'en_US',
            }
            expect(() =>
                ddragonRequestTypeToUrl(
                    DDragonRequestTypes.CDN.DATA,
                    urlInformation,
                ),
            ).to.throw()
        })

        it('should create correct `img` url #1', function() {
            const urlInformation = {
                endpoint: 'profileicon/588.png',
                version: '6.24.1',
            }
            const url = ddragonRequestTypeToUrl(
                DDragonRequestTypes.CDN.IMAGE.WITH_VERSION,
                urlInformation,
            )
            expect(url).to.equal(
                'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/588.png',
            )
        })

        it('should create correct `img` url #2', function() {
            const urlInformation = {
                endpoint: 'passive/Cryophoenix_Rebirth.png',
                version: '6.24.1',
            }
            const url = ddragonRequestTypeToUrl(
                DDragonRequestTypes.CDN.IMAGE.WITH_VERSION,
                urlInformation,
            )
            expect(url).to.equal(
                'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/passive/Cryophoenix_Rebirth.png',
            )
        })

        it('should create correct `img` url #3', function() {
            const urlInformation = {
                endpoint: 'champion/splash/Aatrox_0.jpg',
            }
            const url = ddragonRequestTypeToUrl(
                DDragonRequestTypes.CDN.IMAGE.STATIC,
                urlInformation,
            )
            expect(url).to.equal(
                'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg',
            )
        })

        it('should create correct `img` url #4', function() {
            const urlInformation = {
                endpoint: 'champion/loading/Aatrox_0.jpg',
            }
            const url = ddragonRequestTypeToUrl(
                DDragonRequestTypes.CDN.IMAGE.STATIC,
                urlInformation,
            )
            expect(url).to.equal(
                'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg',
            )
        })
    })

    it('should initialize correctly #1', function() {
        //const request = new Request(
        //    defaultConfig,
        //    'summoner',
        //    'by-name/chaullenger',
        //    'abc',
        //)
        //const { config, methodName, payload } = request
        //expect(config).to.deep.equal(defaultConfig)
        //expect(methodName).to.deep.equal('abc')
        //expect(payload).to.deep.equal({
        //    method: 'GET',
        //    serviceName: 'summoner',
        //    endpoint: 'by-name/chaullenger',
        //    query: [],
        //    region: '',
        //    isTournament: false,
        //})
    })

    it('should initialize correctly #2', function() {
        //const request = new Request(
        //    defaultConfig,
        //    'summoner',
        //    'by-name/chaullenger',
        //    'abc',
        //    'POST',
        //    null,
        //    { hello: 'world' },
        //    true,
        //)
        //const { config, methodName, payload } = request
        //expect(config).to.deep.equal(defaultConfig)
        //expect(methodName).to.deep.equal('abc')
        //expect(payload).to.deep.equal({
        //    method: 'POST',
        //    serviceName: 'summoner',
        //    endpoint: 'by-name/chaullenger',
        //    query: [],
        //    region: '',
        //    body: { hello: 'world' },
        //    isTournament: true,
        //})
    })

    it('should initialize correctly #3', function() {
        //const request = new Request(
        //    defaultConfig,
        //    'summoner',
        //    'by-name/chaullenger',
        //    'abc',
        //    'PUT',
        //    null,
        //    { hello: 'world' },
        //    true,
        //)
        //const { config, methodName, payload } = request
        //expect(config).to.deep.equal(defaultConfig)
        //expect(methodName).to.deep.equal('abc')
        //expect(payload).to.deep.equal({
        //    method: 'PUT',
        //    serviceName: 'summoner',
        //    endpoint: 'by-name/chaullenger',
        //    query: [],
        //    region: '',
        //    body: { hello: 'world' },
        //    isTournament: true,
        //})
    })
})
