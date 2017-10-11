// Grabs the champion mastery DTOs out of a set of champion ids from a specific player.

// Let's pretend that these IDs are the IDs of all the supports in the game.
const championIDs = [1, 2, 3, 4, 5, 6];
const printError = statusCode => console.warn(statusCode);

const main = async kayn => {
  kayn.Summoner.by
    .name('Contractz')
    .then(async ({ id }) => {
      // ChampionMastery.get takes in a summoner id
      // and returns a function that takes in a champion id.
      const getChampionFromContractz = kayn.ChampionMastery.get(id);
      const mapFn = async championID =>
        await getChampionFromContractz(championID);
      const supportCMDTOs = await Promise.all(championIDs.map(mapFn));
      console.log(supportCMDTOs);
    })
    .catch(printError);
};

module.exports = main;
