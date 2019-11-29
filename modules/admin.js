'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Admin {

    constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, email TEXT, admin INTEGER, user_module INTEGER, FOREIGN KEY(user_module) REFERENCES module (id));'
			await this.db.run(sql)
			return this
        })()
    }

    async login(user, pass) {
        try {
            let sql = `SELECT count(id) AS count FROM user WHERE user="${user}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${user}" not found`)
			const record = await this.db.get(`SELECT pass FROM user WHERE user = "${user}";`)
            const admin = await this.db.get(`SELECT admin FROM user WHERE user = "${user}";`)
            const valid = await bcrypt.compare(pass, record.pass)
            if(valid === false) throw new Error(`invalid password for account "${user}"`)
            if(admin.admin === false) throw new Error(`invalid admin for account "${user}"`)
			return true
        } catch(err) {
			throw err
		}
    }

    async editLecture(lectureNum){
        try {
            let sql = `SELECT id, title, text, module_id FROM lecture WHERE id ="${lectureNum}";`
            const search = await this.db.get(sql)
            if(!search.id) throw new Error('Lecture does not exist')
            return search
        } catch (err) {
            throw err
        }
    }

    async uploadLecture(ID, title, text, ModuleID){
        try {
            let sql = `INSERT INTO lecture(id, title, text, module_id) VALUES("${ID}", "${title}", "${text}", "${ModuleID}")`
            const upload = await this.db.get(sql)
            return true
        } catch (err) {
            throw err
        }
    }
    async updateLecture(ID, title, text, ModuleID){
        try {
            let sql = `UPDATE lecture SET module_id ="${ModuleID}", title ="${title}", text ="${text}", id ="${ID}" WHERE id ="${ID}";`
            const upload = await this.db.get(sql)
            return true
        } catch (err) {
            throw err
        }
    }

}
