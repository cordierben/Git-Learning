
'use strict'

const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, 
						user TEXT, pass TEXT, email TEXT, admin INTEGER, user_module INTEGER, 
						FOREIGN KEY(user_module) REFERENCES module (id));`
			const sql2 = `CREATE TABLE IF NOT EXISTS score (user_id INTEGER, 
						lecture_id INTERGER, module_id INTERGER, attempt_id INTEGER PRIMARY KEY AUTOINCREMENT, score INTEGER, date TEXT, 
						fail TEXT);`

			await this.db.run(sql)
			await this.db.run(sql2)
			return this
		})()
	}

	async register(user, pass, email) {
		try {
			if(user.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')
			let sql = `SELECT COUNT(id) as records FROM user WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)
			// ENCRYPTING PASSWORD AND BUILDING SQL
			pass = await bcrypt.hash(pass, saltRounds)
			//Adds username, password and email into the database
			sql = `INSERT INTO user(user, pass, email) VALUES("${user}", "${pass}","${email}")`
			await this.db.run(sql)
			let sql2 = `SELECT id FROM user WHERE user="${user}";`
			console.log(sql2)
			const data2 = await this.db.get(sql2)
			console.log(data2)
			sql2 = `INSERT INTO score(user_id) VALUES("${data2.id}")`
			// DATABASE COMMANDS
			await this.db.run(sql2)
			return true
		} catch(err) {
			throw err
		}
	}

	async selectUser(user) {
		try {
			if(user.length === 0) throw new Error('missing username')
			let sql = `SELECT COUNT(id) as records FROM user WHERE user="${user}";`
			const data = await this.db.get(sql)
			if (data.records!==0) return false
			else{
				sql = `SELECT user FROM user WHERE user="${user}";`
				// DATABASE COMMANDS
				await this.db.run(sql)
				return true
			}
		} catch(err)  {
			throw err
		}
	}

	/*async uploadPicture(path, mimeType) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		//await fs.copy(path, `public/avatars/${username}.${fileExtension}`)
	}*/

	async login(user, pass) {
		try {
			let sql = `SELECT count(id) AS count FROM user WHERE user="${user}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${user}" not found`)
			sql = `SELECT pass, id FROM user WHERE user = "${user}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(pass, record.pass)
			console.log(record.id)
			if(valid === false) throw new Error(`invalid password for account "${user}"`)
			return record.id
		} catch(err) {
			throw err
		}
	}

	async getuser(user) {
		try {
			if(user.length === 0) throw new Error('missing username')
			const record=await this.db.get(`SELECT id FROM user WHERE user = "${user}";`)
			return record.id
		} catch(err) {
			throw err
		}
	}

}
