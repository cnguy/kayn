require('babel-polyfill');
const kayn = require('./dist')();

const print = val => console.log(val);

const main = async () => {
  /*
  const res1 = await kayn.Summoner.by
    .name('Faker')
    // temporary queries, Summoner should not be able
    // to use this
    .query({ hi: 'there' })
    .query({ boo: 'yeah' })
    .region('kr');
  console.log(res1.id);

  const res2 = await kayn.Summoner.by
    .name()
    .region('kr')
    .query({ hi: 'there' });

  console.log('res2:', res2);

  kayn.Summoner.by
    .name()
    .region('na')
    .callback((err, data) => {
      if (err) {
        console.log('there is an error');
      } else {
        console.log('there is no error:', data);
      }
    });

  kayn.Summoner.by.id(1183421).callback((error, res) => console.log(error));

  try {
    const res3 = await kayn.Summoner.by.id(1183421);
  } catch (ex) {
    console.log(ex);
  }

  kayn.Summoner.by
    .id(1183421)
    .then(print)
    .catch(print);

  kayn.Summoner.by
    .id(1183421)
    .region('kr')
    .then(print)
    .catch(print);

  kayn.Summoner.by
    .id(211093172309217093132)
    .then(print)
    .catch(err => console.log('wat'));

  kayn.Summoner.by
    .name('Contractz')
    .then(summoner =>
      kayn.Matchlist.get(summoner.accountId).query({ queue: 420 }),
    )
    .then(matchlist => console.log('here is the matchlist:', matchlist))
    .catch(print);

  kayn.Match.get(2472380616).callback((err, data) => {
    if (err) {
      console.log('why is there an error?', err);
    } else {
      console.log('here are the details of match:', 2472380616);
      console.log(data);
    }
  });

  try {
    const timeline = await kayn.Match.timeline(2472380616);
    console.log(timeline);
  } catch (ex) {
    console.log('timeline exception:', ex);
  }
  */

  kayn.ChampionMastery.total(118341).callback((err, res) => {
    console.log(err, res);
  });

  kayn.Summoner.by
    .name('Contractz')
    .region('na')
    .callback(async (err, res) => {
      if (res) {
        const championIDs = [1, 2, 3, 50];
        const cmGetter = kayn.ChampionMastery.get(res.id);
        const mapper = async id => await cmGetter(id);
        const championMasteries = await Promise.all(championIDs.map(mapper));
        console.log(championMasteries);
      }
    });

  kayn.Summoner.by
    .name('Contractz')
    .then(({ id }) => kayn.ChampionMastery.list(id))
    .then(list => console.log(list.length))
    .catch(print);
};

main();
