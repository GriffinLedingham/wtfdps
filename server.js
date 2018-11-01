const util        = require( './util' )
const simManager  = require( './classes/sim/SimManager' )

global.activeWorkers  = 0
global.simQueue       = []
global.simResults     = {}

setInterval(()=>{
  simManager.checkQueue()
},1000)

var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork()
  }
// Code to run if we're in a worker process
} else {
  const express     = require( 'express' )
  const app         = express()
  const routes      = require( './routes' )(app, cluster)
  app.listen(3001, () => {console.log('Worker started.')})
}
