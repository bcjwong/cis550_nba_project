import config from './config.json'

const getAllTeams = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/teams?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllGames = async (page, pagesize, season) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/games/${season}?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getTeam = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/team?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getGame = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/game?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getTeamSearch = async (home) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/teams?area=${home}`, {
        method: 'GET',
    })
    return res.json()
}

const getGameSearch = async (home, visitor, season) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/game_details?home=${home}&visitor=${visitor}&season=${season}`, {
        method: 'GET',
    })
    return res.json()
}

const getTeamPlayers = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/team_players?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getConferenceTeams = async (conference, season) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/teams_conference?conference=${conference}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllPlayers = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayer = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/player?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayerSearch = async (name, team, season) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Team=${team}&Season=${season}`, {
        method: 'GET',
    })
    return res.json()
}

const getTopTeams = async (season) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/top_teams?season=${season}`, {
        method: 'GET',
    })
    return res.json()
}




export {
    getAllPlayers,
    getPlayer,
    getPlayerSearch,
    getAllGames,
    getAllTeams,
    getGameSearch,
    getTeamSearch,
    getGame,
    getTeam,
    getTeamPlayers,
    getConferenceTeams,
    getTopTeams,
}