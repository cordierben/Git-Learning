
'use strict'

const sqlite = require('sqlite-async')

module.exports = class Lecture {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS lecture (id INTEGER, title TEXT, 
				        text TEXT, module_id INTEGER , PRIMARY KEY (id), FOREIGN KEY(module_id) REFERENCES module (id));`
			await this.db.run(sql)
			return this
		})()
	}

	async addlecture(id, title, text, moduleId) {
		try {
			const data=await this.db.get(`INSERT INTO lecture (id, title, text,module_id)
                                                VALUES (${id},${title},${text},${moduleId});`)
			return data
		} catch(err) {
			throw err
		}
	}
	async getlecture(id) {
		try {
			const data=await this.db.get(`SELECT id, title, text,module_id FROM lecture
                                                WHERE id =${id};`)
			return data
		} catch(err) {
			throw err
		}
	}

	async deletelecture(id) {
		try {
			await this.db.get(`DELETE FROM lecture
                                             WHERE  lecture =${id};`)
		} catch(err) {
			throw err
		}
	}
	async updatelecture(id, title, text, moduleId) {
		try {
			await this.db.get(`UPDATE lecture SET title=${title},text=${text} 
                                                        WHERE id=${id}
                                                        AND module_id=${moduleId};`)
		} catch(err) {
			throw err
		}
	}


}
