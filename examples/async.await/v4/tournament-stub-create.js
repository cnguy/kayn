const main = async kayn => {
    const providerID = await kayn.TournamentStub.registerProviderData(
        'na',
        'https://localhost/cb',
    )
    const tournamentID = await kayn.TournamentStub.register(providerID, 'kappa')
    const codes = await kayn.TournamentStub.create(tournamentID, {
        mapType: 'SUMMONERS_RIFT',
        metadata: 'Kappa',
        pickType: 'TOURNAMENT_DRAFT',
        spectatorType: 'NONE',
        teamSize: 5,
    }).query({ count: 5 })

    console.log(codes)
}

module.exports = main
