const express   = require( 'express' )
const app       = express()
const routes    = require( './routes' )(app)
const util      = require( './util' )

app.listen(3000, () => {console.log('Server started.')})
