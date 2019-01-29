const main = async kayn => {
    const match = await kayn.Match.get(2877485196)
    const bans = match.teams.map(m => m.bans).reduce((t, c) => t.concat(c), [])
    const ids = bans.map(b => b.championId)
    const ddragonChampions = await kayn.DDragon.Champion.listDataByIdWithParentAsId()
    const champions = ids.map(id => ddragonChampions.data[id])
    console.log(champions)
}

module.exports = main
