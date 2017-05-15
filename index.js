var idb = require('idb')

function createKeyValueStore (dbName, version, upgradeCb) {
  const db = idb.open(dbName, 1, upgradeCb || (upgradeDB => {
    upgradeDB.createObjectStore('keyval')
  }))

  return {
    db: db,
    get (key) {
      return db.then(db => {
        return db.transaction('keyval')
          .objectStore('keyval').get(key)
      })
    },
    set (key, val) {
      return db.then(db => {
        const tx = db.transaction('keyval', 'readwrite')
        tx.objectStore('keyval').put(val, key)
        return tx.complete
      })
    },
    delete (key) {
      return db.then(db => {
        const tx = db.transaction('keyval', 'readwrite')
        tx.objectStore('keyval').delete(key)
        return tx.complete
      })
    },
    clear () {
      return db.then(db => {
        const tx = db.transaction('keyval', 'readwrite')
        tx.objectStore('keyval').clear()
        return tx.complete
      })
    },
    keys () {
      return db.then(db => {
        const tx = db.transaction('keyval')
        const keys = []
        const store = tx.objectStore('keyval')

        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // openKeyCursor isn't supported by Safari, so we fall back
        (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
          if (!cursor) return
          keys.push(cursor.key)
          cursor.continue()
        })

        return tx.complete.then(() => keys)
      })
    },
  }
}

function createObjectStore (dbName, keyPath, version, upgradeCb) {
  const db = idb.open(dbName, 1, upgradeCb || (upgradeDB => {
    upgradeDB.createObjectStore('object', { keyPath: keyPath })
  }))

  return {
    db: db,
    get (key) {
      return db.then(db => {
        return db.transaction('object')
          .objectStore('object').get(key)
      })
    },
    set (obj) {
      return db.then(db => {
        const tx = db.transaction('object', 'readwrite')
        tx.objectStore('object').put(obj)
        return tx.complete
      })
    },
    delete (key) {
      return db.then(db => {
        const tx = db.transaction('object', 'readwrite')
        tx.objectStore('object').delete(key)
        return tx.complete
      })
    },
    clear () {
      return db.then(db => {
        const tx = db.transaction('object', 'readwrite')
        tx.objectStore('object').clear()
        return tx.complete
      })
    },
    keys () {
      return db.then(db => {
        const tx = db.transaction('object')
        const keys = []
        const store = tx.objectStore('object')

        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // openKeyCursor isn't supported by Safari, so we fall back
        (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
          if (!cursor) return
          keys.push(cursor.key)
          cursor.continue()
        })

        return tx.complete.then(() => keys)
      })
    },
  }
}

module.exports = {
  keyValue: createKeyValueStore,
  object: createObjectStore,
}
