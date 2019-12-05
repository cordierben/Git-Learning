
'use strict'

const sqlite = require('sqlite-async')

module.exports = class Lecture {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS lecture (id INTEGER, title TEXT, 
						text TEXT, module_id INTEGER , PRIMARY KEY (id), 
						FOREIGN KEY(module_id) REFERENCES module (id));`
			await this.db.run(sql)
			return this
		})()
	}

	async missingparameters(id, text) {
		if(id.toString().length === 0 || text.length===0) return true
		else return false
	}

	 // Insert a lecture with its ID,title, text and module ID into the databse
	async addlecture(id, title, text, moduleId) {
		try {
			if(await this.missingparameters(id, text)===true) throw new Error('A parameter is missing')
			if(title.length === 0 || moduleId.toString().length ===0) throw new Error('A parameter is missing')
			const data=await this.db.get(`INSERT INTO lecture (id, title, text,module_id)
                                                VALUES (${id},"${title}","${text}",${moduleId});`)
			return data
		} catch(err) {
			throw err
		}
	}

	// get the chosen lecture
	async eachLecture() {
		const data=await this.db.all('SELECT id, title, module_id FROM lecture;')
		return data

	}

	async allLectureModule(moduleId) {
		try {
			if(moduleId.toString().length === 0) throw new Error('did not specify which module id')
			const data=await this.db.all(`SELECT id, title, module_id FROM lecture WHERE module_id=${moduleId};`)
			return data
		} catch(err) {
			throw err
		}

	}


	async getlecture(id,moduleId) {
		try {
			if(moduleId.toString().length === 0) throw new Error('did not specify which module id')
			if(id.toString().length === 0) throw new Error('did not specify which lecture id')
			const data=await this.db.get(`SELECT id, title, text,module_id FROM lecture
												WHERE id =${id}
												AND module_id=${moduleId};`)
			return data
		} catch(err) {
			throw err
		}
	}
	// delete the chosen lecture of a specific module
	async deletelecture(id, moduleId) {
		try {
			const sql = `SELECT count(id) AS count FROM lecture WHERE id =${id};`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error('lecture not found')
			await this.db.get(`DELETE FROM lecture
										 WHERE id=${id} 
										 AND module_id=${moduleId};`)
		} catch(err) {
			throw err
		}
	}
	// update the chosen lecture of a specific module
	async updatelecture(id, title, text, moduleId) {
		try {
			const sql = `SELECT count(id) AS count FROM lecture WHERE id =${id};`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error('lecture not found')
			await this.db.get(`UPDATE lecture SET title="${title}",text="${text}"
                                                        WHERE id=${id}
                                                        AND module_id=${moduleId};`)
		} catch(err) {
			throw err
		}
	}


}
