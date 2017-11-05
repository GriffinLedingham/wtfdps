const cmd       = require( 'node-cmd' )
const Promise   = require( 'bluebird' )
const path      = require( 'path' )
const getAsync  = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })
const unlink    = Promise.promisify(require("fs").unlink);


module.exports = (() => {
  this.simCharacter = (props, options = {}) => {
    const { region, realmName, characterName } = props
    let timestamp       = Math.floor( Date.now() / 1000 )

    let simCall  = '../simc/engine/simc '
    simCall     += `armory=${region},`
    simCall     += `${realmName},`
    simCall     += `${characterName} `
    simCall     += `json2=./output/${region}${characterName}${realmName}${timestamp}.json `

    for (let [key, value] of entries(options)) {
      simCall   += `${key}=${value} `
    }

    return getAsync(simCall)
    .then(data => {
      let jsonData = require(`../../output/${region}${characterName}${realmName}${timestamp}.json`)
      return jsonData
    })
    .then(data => {
      return unlink(path.join(__dirname, `../../output/${region}${characterName}${realmName}${timestamp}.json`))
      .then(()=> {
        return data
      })
    })
  }

  this.formatSimData = (data) => {
    let returnData = {
      dps:        Math.round(data.sim.statistics.raid_dps.mean),
      dpsClean:   kFormatter(Math.round(data.sim.statistics.raid_dps.mean))
    }

    return returnData
  }

  return this
})()
