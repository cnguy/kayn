import { expect, should, assert } from 'chai';

import TestUtils from '../../TestUtils';

const { kayn } = TestUtils.kaynInstance;

import summoner from '../../fixtures/rest/summoner/summoner.json';

describe('Summoner (integration)', function() {
    it('should work', async function() {
        const s = await kayn.Summoner.by.name('Contractz');
        expect(s).to.be.deep.equal(summoner);
    });
});
