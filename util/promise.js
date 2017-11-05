var Promise = require( 'bluebird' )

module.exports = (()=>{
  global.getPromise = (data) => {
    return new Promise((resolve) => {
      resolve(data)
    })
  }
})()
