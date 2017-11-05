module.exports = (()=>{
  global.entries = function* (obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]];
    }
  }

  global.kFormatter = (num) => {
    return num > 999 ? (num/1000).toFixed(0) + 'k' : num
  }
})()
