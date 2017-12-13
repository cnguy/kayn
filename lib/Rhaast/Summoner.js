class Summoner {
    constructor(kayn, { name, id, accountID }, region) {
        this.kayn = kayn;
        this.name = name;
        this.id = id;
        this.accountId = accountID;
        this.full = false;
        this.region = region || kayn.config.region;
    }

    async get() {
        if (!this.full) {
            const { kayn, name, id, accountId, region } = this;
            console.log(name);
            let s;
            if (name) {
                s = await kayn.Summoner.by.name(name).region(region);
            } else if (id) {
                s = await kayn.Summoner.by.id(id).region(region);
            } else if (accountId) {
                s = await kayn.Summoner.by.accountID(accountId).region(region);
            } else {
                console.log('oh no!');
            }
            if (s) {
                Object.keys(s).forEach(k => (this[k] = s[k]));
                this.full = true;
            }
        }
        const keys = Object.keys(this).filter(
            el => el !== 'kayn' && el !== 'full',
        );
        const res = keys.reduce((prev, curr) => {
            prev[curr] = this[curr];
            return prev;
        }, {});
        return res;
    }

    async matchlist(config = {}) {
        const { kayn } = this;
        if (!this.accountId) {
            await this.get();
        }
        return await kayn.Matchlist.by
            .accountID(this.accountId)
            .query(config)
            .region(this.region);
    }
}

export default kayn => args => new Summoner(kayn, args);
