'use strict'

/*
|--------------------------------------------------------------------------
| Redis Configuaration
|--------------------------------------------------------------------------
|
| Here we define the configuration for redis server. A single application
| can make use of multiple redis connections using the redis provider.
|
*/

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | connection
  |--------------------------------------------------------------------------
  |
  | Redis connection to be used by default.
  |
  */
  connection: Env.get('REDIS_CONNECTION', 'local'),

  /*
  |--------------------------------------------------------------------------
  | local connection config
  |--------------------------------------------------------------------------
  |
  | Configuration for a named connection.
  |
  */
  local: {
    host: Env.get('REDIS_HOST'),
    port: Env.get('REDIS_PORT'),
    password: Env.get('REDIS_PASSWORD', null),
    db: 0,
    keyPrefix: '',
  },

  /*
  |--------------------------------------------------------------------------
  | cluster config
  |--------------------------------------------------------------------------
  |
  | Below is the configuration for the redis cluster.
  |
  */
  cluster: {
    clusters: [{
      host: 'cupom-redis-001.l6urni.0001.use1.cache.amazonaws.com',
      port: 6379,
      password: null,
      db: 0,
    },
    {
      host: 'cupom-redis-002.l6urni.0001.use1.cache.amazonaws.com:6379',
      port: 6379,
      password: null,
      db: 0,
    }]
  }
}
