const cmd       = require( 'node-cmd' )
const Promise   = require( 'bluebird' )
const path      = require( 'path' )
const getAsync  = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })
const unlink    = Promise.promisify(require("fs").unlink)
const spells    = require( '../../data/spells.json')

module.exports = (() => {
  this.queueSim = (props, options = {}) => {
    let guid = newGUID()
    simQueue.push({id: guid, props: props, options: options})
    return guid
  }

  this.checkQueue = () => {
    if(activeWorkers < 3 && simQueue.length > 0) {
      let job = simQueue.shift()
      activeWorkers += 1
      this.simCharacter(job.props, job.id, job.options)
      .then(data => {
        simResults[job.id] = data
        activeWorkers -= 1
      })
    }
  }

  this.checkSimResults = (id) => {
    let result = false 
    if(simResults[id] != undefined) {
      result = simResults[id]
    }
    return result
  }

  this.simCharacter = (props, id, options = {}) => {
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
      dpsClean:   kFormatter(Math.round(data.sim.statistics.raid_dps.mean)),
      gear:       this.formatGear(data.sim.players[0].gear),
      talents:    this.formatTalents(data.sim.players[0].talents),
      opener:     this.formatOpener(data.sim.players[0].collected_data.action_sequence)
    }

    return returnData
  }

  this.formatOpener = (data) => {
    let returnActions = []
    let actions = data.slice(0,10)
    for (let [key, value] of entries(actions)) {
      let openerItem = {spell: value.name.replace(/_/g, ' '), index: key}
      let spell_id = spells[openerItem.spell]
      if(spell_id) openerItem.spell_num = spell_id
      if(key == actions.length-1) {
        openerItem.last = true
      }
      returnActions.push(openerItem)
    }
    return returnActions
  }

  this.formatTalents = (data) => {
    let talentArray = []
    for (let [key, value] of entries(data)) {
      talentArray.push({spell_id:value.spell_id, id: key})
    }
    return talentArray
  }

  this.formatGear = (data) => {
    let gearArray = []
    for (let [key, value] of entries(data)) {
      gearArray.push({data:value.encoded_item, id: key})
    }
    return gearArray
  }

  return this
})()
