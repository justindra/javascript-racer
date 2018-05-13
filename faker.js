Car = {};
Car.delay = 200;
Car.show = false;

Car._sendKey = function(key, mode) {
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     

    if (oEvent.initKeyboardEvent) {
        oEvent.initKeyboardEvent("key" + mode, true, true, document.defaultView, key, key, "", "", false, "");
    } else {
        oEvent.initKeyEvent("key" + mode, true, true, document.defaultView, false, false, false, false, key, 0);
    }

    oEvent.keyCodeVal = key;

    if (oEvent.keyCode !== key) {
        alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
    }

    document.body.dispatchEvent(oEvent);
}

Car.forward = function() {
  this._sendKey(KEY.UP, 'down');
}

Car.forwardStop = function() {
  this._sendKey(KEY.UP, 'up');
}

Car.left = function() {
  this._sendKey(KEY.LEFT, 'down');
}

Car.right = function() {
  this._sendKey(KEY.RIGHT, 'down');
}

Car.leftStop = function() {
  this._sendKey(KEY.LEFT, 'up');
}

Car.rightStop = function() {
  this._sendKey(KEY.RIGHT, 'up');
}

Car._sendEventToParent = function() {
  var parent = window.parent.document;
  var evt = new CustomEvent('car', {
    bubbles: true,
    detail: {
      playerX: playerX,
      speed: speed
    }
  });
  parent.dispatchEvent(evt);
}

Car.loop = function() {
  if (playerX <= -0.25) {
    this.leftStop();
    this.right();
  } else if (playerX >= 0.25) {
    this.rightStop();
    this.left();
  } else {
    this.leftStop();
    this.rightStop();
  }

  if (speed <= 10000) {
    this.forward();
  } else {
    this.forwardStop();
  }
  Car._sendEventToParent();
}

setInterval(Car.loop.bind(Car), 200);
