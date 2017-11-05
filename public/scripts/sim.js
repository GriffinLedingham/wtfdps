function onLoad() {
  processGear()
  processTalents()
}
function processGear() {
  var gear = document.querySelectorAll('.gearItem');
  Array.prototype.forEach.call(gear, function(e, index) {
    var encodedData = e.getAttribute('data-item')
    var slotId = e.getAttribute('data-id')
    var encodedDataArray = encodedData.split(',')
    var itemId = encodedDataArray[1].replace('id=','')
    var bonusId = ''
    if(encodedDataArray.length>2){
      bonusId = encodedDataArray[2].replace('bonus_id=','').replace(/\//g, ',')
    }

    jsonp('https://www.wowdb.com/items/'+itemId+'/tooltip?bonusIDs='+bonusId, function(data) {
      var img = data.Tooltip.match(/src=\"(.+)\.jpg/)
      if(img != null) {
        console.log(img)
        document.getElementById('thumb'+slotId).innerHTML = '<img src="'+img[1]+'.jpg" />'
      }
      document.getElementById(slotId).innerHTML = data.Tooltip
    })

  })
}

function processTalents() {
  var talents = document.querySelectorAll('.talentItem');
  Array.prototype.forEach.call(talents, function(e, index) {
    var talentId = e.getAttribute('data-spellid')
    jsonp('https://www.wowdb.com/spells/'+talentId+'/tooltip', function(data) {
      var img = data.Tooltip.match(/src=\"(.+)\.jpg/)
      if(img != null) {
        console.log(img)
        document.getElementById('thumb'+talentId).innerHTML = '<img src="'+img[1]+'.jpg" />'
      }
      document.getElementById(talentId).innerHTML = data.Tooltip
    })

  })
}

function hoverItem(id) {
  document.getElementById(id).classList.toggle("show")
}

function jsonp(url, callback) {
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  var script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  document.body.appendChild(script);
}
