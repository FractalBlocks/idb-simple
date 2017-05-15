var idbSimple = require('../index')

var db = idbSimple.keyValue('example-data', 1)

db.set('a1', 'HELLO')
  .then(() => db.get('a1'))
  .then(res => console.log(res))
