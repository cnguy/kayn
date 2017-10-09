require('babel-polyfill');
const kayn = require('./dist')();

const print = val => console.log(val);

const main = async () => {
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
      kayn.Matchlist.by.accountID(summoner.accountId).query({ queue: 420 }),
    )
    .then(matchlist => console.log('here is the matchlist:', matchlist))
    .catch(print);
};

main();
