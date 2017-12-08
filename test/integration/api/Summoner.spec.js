import { expect, should, assert } from 'chai';

import TestUtils from '../../TestUtils';

const { kayn } = TestUtils.kaynInstance;

describe('Summoner integration test', function() {
    it('should work', async function() {
        const s = await kayn.Summoner.by.name('Contractz');
        expect(s).to.be.deep.equal({
            name: 'Contractz',
            accountId: 47776491,
            id: 32932398,
            profileIconId: 3155,
            revisionDate: 1512621047000,
            summonerLevel: 30,
        });
    });
});
