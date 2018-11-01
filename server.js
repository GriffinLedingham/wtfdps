const express   = require( 'express' )
const app       = express()
const routes    = require( './routes' )(app)
const util      = require( './util' )

global.activeWorkers  = 0
global.simQueue       = []
global.simResults     = {}

app.listen(3001, () => {console.log('Server started.')})
