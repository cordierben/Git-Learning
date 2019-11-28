
'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, email TEXT, admin INTEGER, user_module INTEGER, FOREIGN KEY(user_module) REFERENCES module (id));'
			await this.db.run(sql)
			return this
		})()
	}

	async register(user, pass,email) {
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
            // DATABASE COMMANDS
			await this.db.run(sql)
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
		} catch(err) {
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
			sql = `SELECT pass FROM user WHERE user = "${user}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(pass, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${user}"`)
			return true
		} catch(err) {
			throw err
		}
	}

}
