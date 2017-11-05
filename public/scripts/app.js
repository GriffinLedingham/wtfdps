function onLoad() {
  document.characterFocused = false

  var elem = document.getElementById('realmInput')
  elem.addEventListener('input', function(e) {
    realmInput()
  })

  var submitButton = document.getElementById('submitButton')
  submitButton.addEventListener('click', function(e) {
    var charIn = document.getElementById('characterInput')
    var realmIn = document.getElementById('realmInput')
    window.location.href = '/sim/'+document.region+'/'+realmIn.value.toLowerCase().replace(/ /g, '-')+'/'+charIn.value.toLowerCase();
  })

  document.body.onclick = function(e){
    e=window.event? event.srcElement: e.target;
    if(e.className && e.className.indexOf('realmItem')!=-1) {
      elem.value = e.innerText
      realmInputBlur()
    } else if(e.className && e.className.indexOf('mainInputWrapper') == -1 && e.className.indexOf('mainInput') == -1) {
      realmInputBlur()
    }
  }

  document.region = 'us'
}

function realmInput() {
  var elem = document.getElementById('realmInput')
  var filtered = realms['us'].filter(function (str) { return str.indexOf(elem.value.toLowerCase()) !== -1 || str.indexOf(elem.value.toLowerCase().replace(/ /g, '-')) !== -1; })
  var ddText = ''
  for(var i in filtered) {
    ddText += '<div class="realmItem" data-id="'+filtered[i]+'">'+filtered[i].replace(/-/g, ' ')+'</div>'
  }
  document.getElementById("realmInputDropDown").innerHTML = ddText
}

function realmInputFocus(e) {
  if(!document.characterFocused) {
    showDD()
    realmInput()
    document.characterFocused = true
  }
}

function realmInputBlur() {
  if(document.characterFocused) {
    hideDD()
    document.characterFocused = false
  }
}

function showDD() {
  document.getElementById("realmInputDropDown").classList.toggle("show")
}

function hideDD() {
  document.getElementById("realmInputDropDown").classList.toggle("show")
}

function clickUs() {
  document.region = 'us'
  document.getElementById('us').classList.toggle('selected')
  document.getElementById('eu').classList.toggle('selected')
}

function clickEu() {
  document.region = 'eu'
  document.getElementById('us').classList.toggle('selected')
  document.getElementById('eu').classList.toggle('selected')
}
