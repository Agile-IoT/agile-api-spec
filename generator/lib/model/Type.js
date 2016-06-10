var _ = require('lodash');
var util = require('../util');

var d = require('debug')("agile:gen:model:Type");

var Type = function (name, obj, parent) {

  this.name = null;
  this.data = {
    description: null,
    extends: null,
    example: null,
    type: null,
    fields: {},
    reference: null
  };

  this.initialize(name, obj, parent);
};
require('util').inherits(Type, require('./BaseObject'));

Type.prototype.initialize = function(name, obj, parent) {

  var me = this;

  if(parent) this.setParent(parent);
  if(name) this.name = name;
  if(obj) this.load(obj);

  util.exportProperties(this);

  d("Added type %s", this.name || "");
};

Type.prototype.load = function(obj) {

  var me = this;

  _.each(this.data, function (val, key) {
    if(key === 'fields' && obj[key]) {

      // normalize type shortcut eg: `fields: String`
      if(typeof obj[key] === 'string') {
        if(obj.type && obj.type.toLowerCase() === 'array') {
          var _type = obj[key];
          obj[key] = {};
          obj[key].__arrayType = {
            type: _type
          };
        }
      }

      _.each(obj[key], function (field, fieldName) {
        me.addField(fieldName, field);
      });

      return;
    }

    if(obj[key] !== undefined) {
      me.data[key] = obj[key];
    }

  });

  this.addGroup();
  this.addTags();

};

Type.prototype.addField = function(name, field) {

  if(typeof field === "string") {
    field = {
      type: field
    };
  }

  d("Add field %s", name);
  var type = new Type(name, field, this);
  this.data.fields[name] = type;
};

Type.prototype.toJSON = function() {
  return util.toJSON(this.data);
};

module.exports = Type;
