// Calls the featured games endpoint and then
// calls the current game endpoint on the first game's, first participant's id.

const main = async kayn => {
  const { gameList } = await kayn.FeaturedGames.list();
  if (gameList.length > 0) {
    const { id } = await kayn.Summoner.by.name(
      gameList[0].participants[0].name,
    );
    const currentGameInfo = await kayn.CurrentGame.by.id(id);
    console.log(currentGameInfo);
  }
};

module.exports = main;
