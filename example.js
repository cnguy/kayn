require('babel-polyfill');
const kayn = require('./dist')();

const print = val => console.log(val);

const main = async () => {
  const res1 = await kayn.Summoner.by
    .name('Faker')
    .query({ hi: 'there' })
    .region('kr');
  console.log(res1.id);

  const res2 = await kayn.Summoner.by
    .name()
    .region('kr')
    .query({ hi: 'there' });

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
};

main();
