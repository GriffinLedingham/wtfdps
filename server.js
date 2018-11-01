const express     = require( 'express' )
const app         = express()
const routes      = require( './routes' )(app)
const util        = require( './util' )
const simManager  = require( './classes/sim/SimManager' )

global.activeWorkers  = 0
global.simQueue       = []
global.simResults     = {}

setInterval(()=>{
  simManager.checkQueue()
},1000)

app.listen(3001, () => {console.log('Worker started.')})
