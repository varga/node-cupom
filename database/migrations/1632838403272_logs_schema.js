'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
const Joi = require('joi');

var Logs = vogels.define('LogCupom', {
  hashKey : 'createdAt',

  // add the timestamp attributes (updatedAt, createdAt)
  timestamps : true,

    schema : {
      cupom : Joi.string(),
      proposta_cadastro : Joi.string(),
      status : Joi.string(),
    }
});

class LogsSchema extends Schema {
  up () {

    vogels.createTables(function(err) {
      if (err) {
        console.log('Error creating tables: ', err);
      } else {
        console.log('Tables has been created');
      }
    });
    
  }

  down () {

    Logs.deleteTable(function(err) {
      if (err) {
        console.log('Error deleting table: ', err);
      } else {
        console.log('Table has been deleted');
      }
    });

  }
}

module.exports = LogsSchema
