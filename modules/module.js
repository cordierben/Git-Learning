
'use strict'

const sqlite = require('sqlite-async')

module.exports = class Module {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS module (id	INTEGER, name	TEXT, PRIMARY KEY(id) );`    
			await this.db.run(sql)
			return this
		})()
	}
	async addmodule(id, name) {
		try {
			if(id.toString().length === 0) throw new Error('missing module id')
			if(name.length === 0) throw new Error('missing module name')
			const data=await this.db.get(`INSERT INTO module (id, name)
                                                VALUES (${id},"${name}");`)
			return data
		} catch(err) {
			throw err
		}
	}
	async allmodule() {
		try {
			const sql = `SELECT count(*) as count FROM module;`
			const data = await this.db.get(sql)
			if(!data.count) throw new Error(`no modules stored`)
			const data1=await this.db.all('SELECT id, name FROM module;')
			return data1
		} catch(err) {
			throw err
		}
    }
}