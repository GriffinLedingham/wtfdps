const express     = require( 'express' )
const simManager  = require( '../classes/sim/SimManager' )

module.exports = (app) => {
  let routes = express.Router()

  routes.get('/', (req,res,next)=>{
    handlebars('home', {})
    .then(html => {
      res.send(html)
      res.end()
    })
  })

  return routes
}
