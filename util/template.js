const Promise     = require( 'bluebird' )
const readFile    = Promise.promisify(require("fs").readFile);
const Handlebars  = require( 'handlebars' )

const enableCaching = false

module.exports = (()=>{
  global.templates = {}
  global.handlebars = (filename, data) => {
    if(enableCaching && templates[filename]) {
      return getPromise(templates[filename](data))
    } else {
      return readFile(`${__dirname}/../views/${filename}.html`, 'utf-8')
      .then((source) => {
        let template = Handlebars.compile(source)
        templates[filename] = template

        return template(data)
      })
    }
  }
})()
