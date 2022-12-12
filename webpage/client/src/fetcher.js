import config from './config.json'

// const getAllPlayers = async (page, pagesize, league) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/matches/${league}?page=${page}&pagesize=${pagesize}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

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
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/teams?Area=${home}`, {
        method: 'GET',
    })
    return res.json()
}

const getGameSearch = async (home, visitor, season) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/game_details?Home=${home}&Visitor=${visitor}&Season=${season}`, {
        method: 'GET',
    })
    return res.json()
}







//-------

const getAllMatches = async (page, pagesize, league) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/matches/${league}?page=${page}&pagesize=${pagesize}`, {
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

const getMatch = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/match?id=${id}`, {
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

const getMatchSearch = async (home, away, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/matches?Home=${home}&Away=${away}&page=${page}&pagesize=${pagesize}`, {
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













export {
    getAllMatches,
    getAllPlayers,
    getMatch,
    getPlayer,
    getMatchSearch,
    getPlayerSearch,
    getAllGames,
    getAllTeams,
    getGameSearch,
    getTeamSearch,
    getGame,
    getTeam

}