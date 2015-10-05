'use strict';

var $l = function(arg) {
  this._docReady = false;
  var elementList = [];
  var events = [];
  if (typeof arg === "string") {
    elementList = elementList.concat([].slice.call(document.querySelectorAll(arg)));
  } else if (arg instanceof HTMLElement) {
    console.log("HTML ELEMENT!");
    elementList.push(arg);
  } else if (arg instanceof Function) {
    if (this._docReady === true) {
      arg();
    } else {
      events.push(arg);
    }
    return;
  }

  document.addEventListener('DOMContentLoaded', function() {
    this._docReady = true;
    events.forEach(function(fn) {
      fn().bind(this);
    });
  }.bind(this));

  return new DomNodeCollection(elementList);
};

$l.isEmptyObject = function(obj) {
  function hasKeys(o) {
    for (var name in o) {
      if (o.hasOwnProperty(name))
        return true;
    }
    return false;
  }

  return !hasKeys(obj);
};

$l.extend = function() {
  var objects = [].slice.call(arguments);
  var merged = {};
  objects.forEach(function(object) {
    for (var prop in object) {
      merged[prop] = object[prop];
    }
  });

  return merged;
};

$l.ajax = function(options) {
  var defaults = {
    success: function() { alert('success'); },
    error: function() { alert('error'); },
    url: "",
    method: "GET",
    data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  };
  options = $l.extend(defaults, options);

  var params;
  if (!$l.isEmptyObject(options.data)) {
    var field, queryString = [];
    for(field in options.data) {
      queryString.push(field + "=" + options.data[field] + "&");
    }
    params = queryString.join("&");
    options.url = options.url + "?" + params;
  }

  var request = new XMLHttpRequest();

  request.onload = function() {
    if (request.readyState == XMLHttpRequest.DONE ) {
      if (request.status == 200) {
        options.success(request.response);
      } else {
        options.error(request.response);
      }
    }
  };

  request.open(options.method, options.url, true);
  request.send(params);
};

var DomNodeCollection = function(array) {
  this.collection = array || [];
};

DomNodeCollection.prototype.html = function(string) {
  if (string) {
    this.collection.forEach(function(node) {
      node.innerHTML = string;
    });
  } else {
    return this.collection[0].innerHTML;
  }
};

DomNodeCollection.prototype.empty = function() {
  this.collection.forEach(function(node) {
    node.innerHTML = "";
  });
};

DomNodeCollection.prototype.append = function(thing) {
  if (type instanceof DomNodeCollection) {
    this.collection.concat(thing.collection);
  } else if (typeof thing === "string") {
    this.collection[0].outerHTML += thing;
  } else {
    this.collection.push(thing);
  }
};

DomNodeCollection.prototype.attr = function(attrName) {
  var val;
  this.collection.forEach(function(node) {
    if (node.hasAttribute(attrName)) {
      val = node.getAttribute(attrName);
    }
  });

  return val;
};

DomNodeCollection.prototype.addClass = function(className) {
  this.collection.forEach(function(node) {
    node.className = node.className.replace(className, "");
    if (node.className === "") {
      node.className += className;
    } else {
      node.className += " " + className;
    }
  });

  return this.collection;
};

DomNodeCollection.prototype.removeClass = function(className) {
  this.collection.forEach(function(node) {
    if (something) {
      node.className = node.classNamereplace(className + " ", "");
    } else {
      node.className = node.className.replace(className, "");
    }
  });
};

DomNodeCollection.prototype.children = function() {
  var childCol = new DomNodeCollection();
  this.collection.forEach(function(node) {
    childCol.collection = childCol.collection.concat([].slice.call(node.children));
  });

  return childCol;
};

DomNodeCollection.prototype.parent = function() {
  var parentCol = new DomNodeCollection();
  var seen = {};
  this.collection.forEach(function(node) {
    if (!seen[node.parentNode.outerHTML]) {
      parentCol.collection.push(node.parentNode);
      seen[node.parentNode.outerHTML] = true;
    }
  });

  return parentCol;
};

//Get the descendants of each element in the current set of matched elements,
//filtered by a selector, jQuery object, or element.
DomNodeCollection.prototype.find = function(selector) {
  var results = [];

  if (typeof selector === "string") {
    this.collection.forEach(function(node) {
      results = results.concat([].slice.call(node.querySelectorAll(selector)));
    });
  } else {
    return;
  }

  return new DomNodeCollection(results);
};

DomNodeCollection.prototype.remove = function() {
  this.collection.forEach(function(node) {
    node.remove();
  });

  return this.collection;
};

DomNodeCollection.prototype.on = function (eventType, selector, data, handler) {
  var collection = this.collection;
  if (selector) {
    collection = this.find(selector).collection;
  }

  collection.forEach(function(node) {
    node.addEventListener(eventType, handler.bind(null, data));
  });

  return this;
};

// fix
DomNodeCollection.prototype.off = function (eventType, selector, handler) {
  var collection = this.collection;
  if (selector) {
    collection = this.find(selector).collection;
  }

  collection.forEach(function(node) {
    node.removeEventListener(eventType, handler);
  });

  return this;
};

module.exports = $l;
