const express     = require( 'express' )
const simManager  = require( '../classes/sim/SimManager' )

module.exports = (app) => {
  let routes = express.Router()

  routes.get('/:region?/:realmName?/:characterName?', (req,res,next) => {
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

      simManager.queueSim(props, options)
      .then(id => {
        // Poll to wait for results to arrive
        let promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            let simResult = simManager.checkSimResults(id)
            if(simResult !== false) {
              resolve(simResult)
            }
          }, 2000)
        });
        return await promise
      })
      .then(data => {
        let templateData = {simData: simManager.formatSimData(data)}

        templateData.simData.characterName = props.characterName.toUpperCase()
        templateData.simData.realmName = props.realmName.replace(/-/g, ' ').toUpperCase()

        if(props.region == 'us') {
          templateData.simData.isUS = true
        } else if(props.region == 'eu') {
          templateData.simData.isEU = true
        }

        return templateData
      })
      .then(templateData => {
        return handlebars('sim', templateData)
      })
      .then(html => {
        res.send(html)
        res.end()
      })
      .catch(e => {
        handlebars('home', {error:{msg: 'WTF. Something went wrong. Check information and try again.'}})
        .then(html => {
          res.send(html)
          res.end()
        })
      })
    } else {
      handlebars('home', {error:{msg: 'WTF. Something went wrong. Check information and try again.'}})
      .then(html => {
        res.send(html)
        res.end()
      })
    }
  })

  return routes
}
