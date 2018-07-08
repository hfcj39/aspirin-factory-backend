const assert = require('assert')
const _ = require('lodash')
const v = require('validator')

function BaseError(message) {
  this.name = 'BaseError'
  this.message = message || 'Default Message'
  this.stack = (new Error()).stack
}

BaseError.prototype = Object.create(BaseError.prototype)
BaseError.prototype.constructor = BaseError

class ValidateError extends BaseError {
  constructor(message) {
    super(message)
    this.name = 'ValidateError'
  }
}

const TYPES = [
  'number',
  'date',
  'string',
  'url',
  'bool',
  'mongoId',
  'object',
  'array',
]

class Validator {

  constructor(args, options = {}) {
    if (_.isString(args.type)) {
      this.validdateCtorArgs(args)
    } else {
      _.each(args, (elem) => {
        this.validdateCtorArgs(elem)
      })
    }
    this.args = args
    this.options = options
  }

  validdateCtorArgs(args) {

    if (TYPES.indexOf(args.type) < 0) {
      throw new ValidateError(`unsupported type: ${args.type}`)
    }

    if (!_.isUndefined(args.validate) &&
      !_.isFunction(args.validate) &&
      !_.isFunction(args.validate.validate) &&
      !_.isObject(args.validate) &&
      !_.isString(args.validate)) {
      throw new ValidateError(`unsupported validate: ${JSON.stringify(args.validate)}`)
    }
  }

  preHandle(config, data) {

    switch (config.type) {
      case 'number':
        if (_.isString(data) && /%/.test(data)) {
          return Number(data.replace('%', ''))
        }
        return Number(data)
      case 'date':
        if (_.isString(data) && /^\d*$/.test(data)) {
          return new Date(parseInt(data, 10))
        }
        return new Date(data)
      case 'bool':
        if (_.isBoolean(data))
          return data
        if (_.isString(data) && (data === 'true' || data === 'false'))
          return data === 'true'
        if (_.isString(data) && (data === 'on' || data === 'off'))
          return data === 'on'
        if (_.isNumber(data))
          return !!data
        return data
      case 'mongoId':
        return data.toString()
      case 'object':
      case 'array':
        if (_.isString(data)) {
          try {
            return JSON.parse(data)
          } catch (err) {
          }
        }
        return data
      default:
        return data
    }
  }

  validateType(config, data) {

    switch (config.type) {
      case 'number':
        return _.isNumber(data) && !isNaN(data)
      case 'string':
        return _.isString(data)
      case 'url':
        return _.isString(data) && v.isURL(data)
      case 'date':
        return _.isDate(data) && !isNaN(data.valueOf())
      case 'mongoId':
        return _.isString(data) && v.isMongoId(data) ||
          _.isObject(data) && v.isMongoId(data.toString())
      case 'bool':
        return _.isBoolean(data)
      case 'array':
        return _.isArray(data)
      case 'object':
        return _.isObject(data)
      default:
        return false
    }
  }

  validateValue(config, data) {
    const values = config.values || []
    if (
      config.min && this.preHandle(config, config.min) > data ||
      config.max && this.preHandle(config, config.max) < data ||
      config.oneOf && config.oneOf.map(elem => this.preHandle(config, elem).valueOf()).indexOf(data.valueOf()) < 0
    ) {
      return false
    }
    return true
  }

  validateCustom(config, data) {

    if (!config.validate) {
      return data
    }
    if (_.isFunction(config.validate)) {
      return config.validate(data)
    }
    if (_.isFunction(config.validate.validate)) {
      return config.validate.validate(data)
    }
    if (_.isObject(config.validate)) {
      return new Validator(config.validate).validate(data)
    }
    if (_.isString(config.validate)) {

    }
    return data
  }

  validateRaw(config, data, key) {

    const originType = typeof data
    const originData = data

    if (_.isUndefined(data)) {
      if (config.required) {
        throw new ValidateError(`validate failed: argument[${key}] is required`)
      }
      if (!_.isUndefined(config.default)) {

        if (_.isFunction(config.default)) {
          data = config.default()
        } else {
          data = _.cloneDeep(config.default)
        }
      }
      return data
    }

    if (!config.strict) {
      data = this.preHandle(config, data)
    }

    if (!this.validateType(config, data)) {
      throw new ValidateError(`validate faild: invalid type: argument[${key}] expected[${config.type}] but got[${originType}/${originData}]`)
    }

    if (!this.validateValue(config, data)) {
      let expected = ''
      if (!_.isUndefined(config.min)) {
        expected += `min:${config.min},`
      }
      if (!_.isUndefined(config.max)) {
        expected += `max:${config.max},`
      }
      if (!_.isUndefined(config.oneOf)) {
        expected += `oneOf:${JSON.stringify(config.oneOf)},`
      }
      throw new ValidateError(`validate faild: invalid value: argument[${key}] expected[${expected}] but got[${originType}/${originData}]`)
    }

    if (config.type === 'array') {
      // data.forEach((elem) => this.validateCustom(config, elem))

      if (!_.isUndefined(config.lengthMax)) {
        config.lengthMax = parseInt(config.lengthMax, 10)
        if (data.length > config.lengthMax) {
          throw new ValidateError(`validate faild: array length over limit: argument[${key}] expected length max:[${config.lengthMax}] but got length:[${data.length}]`)
        }
      }

      if (!_.isUndefined(config.lengthMin)) {
        config.lengthMin = parseInt(config.lengthMin, 10)
        if (data.length < config.lengthMin) {
          throw new ValidateError(`validate faild: array length under limit: argument[${key}] expected length min[${config.lengthMin}] but got length:[${data.length}]`)
        }
      }

      for (let i = 0; i < data.length; i++) {
        data[i] = this.validateCustom(config, data[i])
      }
    } else {
      data = this.validateCustom(config, data)
    }
    return data
  }

  validate(ctx) {

    if (_.isString(this.args.type)) {
      return this.validateRaw(this.args, ctx)
    }

    const result = {}
    _.toPairs(this.args).forEach(([key, config]) => {

      let datas, data
      const contexts = config.ctx instanceof Array ? config.ctx : [config.ctx]

      for (let i = 0; i < contexts.length; i++) {
        const context = contexts[i]

        switch (context) {
          case 'params':
          case 'headers':
            datas = ctx[context]
            break
          case 'query':
          case 'body':
          case 'fields':
          case 'header':
            datas = ctx.request[context]
            break
          default:
            datas = ctx
            break
        }
        data = datas && datas[key]
        if (data !== undefined) {
          break
        }
      }

      result[key] = this.validateRaw(config, data, key)
      if (config.alias && !_.isUndefined(result[key])) {
        result[config.alias] = result[key]
      }
    })

    if (_.isFunction(this.options.validate)) {
      this.options.validate(result)
    }

    return result
  }
}

module.exports = Validator
module.exports.ValidateError = ValidateError
