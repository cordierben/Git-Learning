
'use strict'

const sqlite = require('sqlite-async')

module.exports = class Score {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS score (user_id INTEGER, lecture_id INTEGER, module_id INTEGER,
				        attempt_id INTEGER PRIMARY KEY AUTOINCREMENT, score INTEGER, date TEXT, fail TEXT);`
			await this.db.run(sql)
			return this
		})()
	}

	async newscore(user,lecture,moduleid) {
		try {
			if(user.toString().length === 0) throw new Error('missing user id')
			const today=new Date()
			const start=2
	        const dd = String(today.getDate()).padStart(start, '0')
	        const mm = String(today.getMonth() + 1).padStart(start, '0') //January is 0
	        const yyyy = today.getFullYear()
			const date = `${mm}/${dd}/${yyyy}`
			await this.db.get(`INSERT INTO score(user_id, lecture_id, module_id, score, fail, date) 
			                             VALUES (${user},${lecture},${moduleid},0,"","${date}");`)
		} catch(err) {
			throw err
		}
	}

	async getscore(user, lecture, moduleid) {
		try {
			if(lecture.toString().length === 0) throw new Error('missing lecture id')
			const sql = `SELECT COUNT(*) as count FROM score WHERE user_id=${user};`
			let data = await this.db.get(sql)
			if(!data.count) throw new Error(`user ID "${user}" does not have a previous score`)
			data=await this.db.get(`SELECT MAX(attempt_id) as last, score, fail FROM score WHERE user_id=${user} 
																						   AND lecture_id=${lecture}
																						   AND module_id=${moduleid};`)
			
			return data
		} catch(err) {
			throw err
		}
	}

	async updatescore(user, lecture, moduleid, score, attempt) {
		try {
			if(attempt.toString().length === 0) throw new Error('missing attempt id')
			score++
			await this.db.get(`UPDATE score SET score=${score} WHERE user_id=${user}
														  AND lecture_id=${lecture}
														  AND attempt_id=${attempt}
														  AND module_id=${moduleid};`)
		} catch(err) {
			throw err
		}
	}

	async updatefail(user, lecture, moduleid, fail, attempt) {
		try {
			if(fail.length === 0) throw new Error('there was no pass/fail given value to update')
			await this.db.get(`UPDATE score SET fail="${fail}" WHERE user_id=${user}
														AND lecture_id=${lecture}
														AND attempt_id=${attempt}
														AND module_id=${moduleid};`)
		} catch(err) {
			throw err
		}
	}
}
