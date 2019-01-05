const main = async kayn => {
    const providerID = await kayn.TournamentStubV4.registerProviderData(
        'na',
        'https://localhost/cb',
    )
    const tournamentID = await kayn.TournamentStubV4.register(
        providerID,
        'kappa',
    )
    const codes = await kayn.TournamentStubV4.create(tournamentID, {
        mapType: 'SUMMONERS_RIFT',
        metadata: 'Kappa',
        pickType: 'TOURNAMENT_DRAFT',
        spectatorType: 'NONE',
        teamSize: 5,
    }).query({ count: 5 })

    console.log(codes)
}

module.exports = main
