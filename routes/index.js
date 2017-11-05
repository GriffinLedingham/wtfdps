const api     = require( './api' )
const sim     = require( './sim' )
const root    = require( './root' )
const path    = require( 'path' )
const express = require( 'express' )

module.exports = (app) => {
  app.use('/api', api())
  app.use('/sim', sim())
  app.use('/scripts',express.static(__dirname + '/../public/scripts'))
  app.use('/css',express.static(__dirname + '/../public/css'))
  app.use('/',    root())
}
