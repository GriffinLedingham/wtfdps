const express     = require( 'express' )
const simManager  = require( '../classes/sim/SimManager' )

module.exports = (app) => {
  let routes = express.Router()

  routes.get('/sim/:region/:realmName/:characterName', (req,res,next) => {
    if(req.params.region && req.params.characterName && req.params.realmName) {
      let props = {
        region:         req.params.region,
        characterName:  req.params.characterName,
        realmName:      req.params.realmName
      }

      let options = {
        calculate_scale_factors: 0,
        iterations: 100
      }

      simManager.simCharacter(props, options)
      .then(data => {
        res.json(simManager.formatSimData(data))
        res.end()
      })
    } else {
      res.end()
    }
  })

  return routes
}
