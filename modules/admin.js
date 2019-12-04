'use strict'
const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Admin {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, 
						user TEXT, pass TEXT, email TEXT, admin TEXT, user_module INTEGER, 
						FOREIGN KEY(user_module) REFERENCES module (id));`
			await this.db.run(sql)
			return this
		})()
	}

	async login(user, pass) {
		try {
			const sql = `SELECT count(*) AS count FROM user WHERE user="${user}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${user}" not found`)
			const record = await this.db.get(`SELECT pass FROM user WHERE user = "${user}";`)
			const admin = await this.db.get(`SELECT admin FROM user WHERE user = "${user}";`)
			const valid = await bcrypt.compare(pass, record.pass)
			console.log(admin.admin)
			if(valid === false) throw new Error(`invalid password for account "${user}"`)
			const adminPass = 'yes'
			if(admin.admin !== adminPass) throw new Error(`invalid admin for account "${user}"`)
			return true
		} catch(err) {
			throw err
		}
	}
	async register(user, pass, email, admin) {
		try {
			if(user.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')
			let sql = `SELECT COUNT(id) as records FROM user WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)
			// ENCRYPTING PASSWORD AND BUILDING SQL
			pass = await bcrypt.hash(pass, saltRounds)
			//Adds username, password and email into the database
			sql = `INSERT INTO user(user, pass, email, admin) VALUES("${user}", "${pass}","${email}", "${admin}")`
			// DATABASE COMMANDS
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
	/*
	async editLecture(lectureNum, moduleid) {
		try {
			if(lectureNum.toString().length === 0) throw new Error('Lecture ID not specified')
			const sql = `SELECT id, title, text, module_id FROM lecture
			WHERE id =${lectureNum} AND module_id='${moduleid}'`
			const search = await this.db.get(sql)
			if(!search.id) throw new Error('Lecture does not exist')
			return search
		} catch (err) {
			throw err
		}
	}

	async uploadLecture(ID, title, text, ModuleID) {
		try {
			if(ID.toString().length === 0) throw new Error('Lecture ID not specified')
			if(title.length === 0) throw new Error('Title not specified')
			if(text.length === 0) throw new Error('Text not specified')
			if(ModuleID.toString().length === 0) throw new Error('Module ID not specified')
			const sql = `INSERT INTO lecture(id, title, text, module_id)
			VALUES(${ID}, "${title}", "${text}", ${ModuleID})`
			const upload = await this.db.get(sql)
			return upload
		} catch (err) {
			throw err
		}
	}
	async updateLecture(ID, title, text, ModuleID) {
		try {
			const sql = `UPDATE lecture SET module_id =${ModuleID}, title ="${title}",
			text ="${text}", id =${ID} WHERE id ="${ID}";`
			const upload = await this.db.get(sql)
			return upload
		} catch (err) {
			throw err
		}
	} */

}
