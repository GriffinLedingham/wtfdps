function onLoad() {
  processGear()
  processTalents()
  processOpener()
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
        document.getElementById('thumb'+talentId).innerHTML = '<img src="'+img[1]+'.jpg" />'
      }
      document.getElementById(talentId).innerHTML = data.Tooltip
    })

  })
}

function processOpener() {
  var spells = document.querySelectorAll('.spellItem');
  Array.prototype.forEach.call(spells, function(e, index) {
    var spellId = e.getAttribute('data-spellid')
    var spellIndex = e.getAttribute('data-index')
    jsonp('https://www.wowdb.com/spells/'+spellId+'/tooltip', function(data) {
      var img = data.Tooltip.match(/src=\"(.+)\.jpg/)
      if(img != null) {
        document.getElementById('thumb'+spellId+spellIndex).innerHTML = '<img src="'+img[1]+'.jpg" />'
      }
      document.getElementById(spellId+spellIndex).innerHTML = data.Tooltip
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
