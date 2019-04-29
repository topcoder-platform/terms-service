/**
 * App bootstrap
 */

global.Promise = require('bluebird')
const Joi = require('joi')

Joi.numberId = () => Joi.number().integer().min(1).max(2147483647).required()
Joi.uuid = () => Joi.string().uuid().required()
