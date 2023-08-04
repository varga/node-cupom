'use strict'

var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
const Joi = require('joi');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cupom extends Model {

    Cupom = vogels.define('Cupom', {
        hashKey : 'cupom',
        timestamps : true,
        schema : {
          cupom : Joi.string(),
          de_para : Joi.boolean(),
          proposta_cadastro : Joi.string(),
          tabela : Joi.string(),
          dia_final : Joi.date(),
        }
      });

}

module.exports = Cupom
