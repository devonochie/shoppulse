
const expressRedisCache = require('express-redis-cache')
const redis = require('./config/redis')

const cache = expressRedisCache({
  client: redis,
  expire: 60,
});

module.exports = cache