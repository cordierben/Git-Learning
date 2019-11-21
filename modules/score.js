
'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Score {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS score (user_id INTEGER, lecture_id INTEGER, attempt_id INTEGER PRIMARY KEY AUTOINCREMENT, score INTEGER, date TEXT, fail TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async newscore(user,lecture) {
		try {
			const today=new Date()
	        const dd = String(today.getDate()).padStart(2, '0')
	        const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0
	        const yyyy = today.getFullYear()
			const date = `${mm}/${dd}/${yyyy}`
			await this.db.get(`INSERT INTO score(user_id, lecture_id, score, fail, date) VALUES (${user},${lecture},0,'',"${date}");`)
		} catch(err) {
			throw err
		}
	}

	async getscore(user, lecture) {
		try {
			const data=await this.db.get(`SELECT MAX(attempt_id) as last, score FROM score WHERE user_id=${user} 
			                                                                               AND lecture_id=${lecture};`)
			return data
		} catch(err) {
			throw err
		}
	}

	async updatescore(user, lecture, score, attempt) {
		try {
			await this.db.get(`UPDATE score SET score=${score} WHERE user_id=${user}
														  AND lecture_id=${lecture}
													      AND attempt_id=${attempt};`)
		} catch(err) {
			throw err
		}
	}

	async updatefail(user, lecture, fail, attempt) {
		try {
			await this.db.get(`UPDATE score SET fail="${fail}" WHERE user_id=${user}
														AND lecture_id=${lecture}
														AND attempt_id=${attempt};`)
		} catch(err) {
			throw err
		}
	}
}