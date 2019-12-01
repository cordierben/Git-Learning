
'use strict'

const sqlite = require('sqlite-async')

module.exports = class Quiz {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the quiz and options
			const sql = `CREATE TABLE IF NOT EXISTS question 
						(id INTEGER PRIMARY KEY , question TEXT, lecture_id INTEGER, 
						module_id INTEGER, FOREIGN KEY(lecture_id) REFERENCES lecture (id));`
			const sql2 = `CREATE TABLE IF NOT EXISTS option 
						(option1 TEXT, option2 TEXT, answer TEXT, 
						question_id INTEGER,lecture_id INTEGER, module_id INTEGER);`
			await this.db.run(sql)
			await this.db.run(sql2)
			return this
		})()
	}

	async addquestion(id,question,lecture,moduleid) {
		try {
			if(id.toString().length === 0) throw new Error('missing question id')
			if(question.length === 0) throw new Error('missing question')
			if(lecture.toString().length === 0) throw new Error('missing lecture id')
			const data=await this.db.get(`INSERT INTO question (id,question,lecture_id, module_id)
                                                VALUES (${id},"${question}",${lecture},${moduleid});`)
			return data
		} catch(err) {
			throw err
		}
	}

	/*eslint-disable max-params*/
	async addoption(option1, option2,answer,questionId, lectureId, moduleid) {
		try {
			if(option1.length === 0) throw new Error('missing option 1')
			const data=await this.db.get(`INSERT INTO option (option1, option2,answer,question_id,lecture_id, module_id)
												VALUES ("${option1}","${option2}","${answer}",
												${questionId},${lectureId}, ${moduleid});`)
			return data
		} catch(err) {
			throw err
		}
	}


	async getquestion(id, lecture, moduleid) {
		try {
			if(lecture.toString().length === 0) throw new Error('did not specify which lecture id')
			const data = await this.db.get(`SELECT id, question,lecture_id, module_id  FROM question 
											WHERE id =${id}
											AND lecture_id= ${lecture}
											AND module_id=${moduleid};`)
			return data
		} catch(err) {
			throw err
		}
	}

	async getoption(id, lecture, moduleid) {
		try {
			const sql = `SELECT count(question_id) AS count FROM option WHERE question_id =${id};`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error('options for the question do not exist')
			const data= await this.db.get(`SELECT option1, option2, answer, question_id  FROM option 
                                WHERE question_id= ${id}
								AND lecture_id=${lecture}
								AND module_id=${moduleid};`)
			return data
		} catch(err) {
			throw err
		}
	}
	async getanswer(id, lecture, moduleid) {
		try {
			if(id.toString().length === 0) throw new Error('did not specify which question id the answer belongs to')
			const data = await this.db.get(`SELECT answer FROM option 
											WHERE question_id = ${id}
											AND lecture_id=${lecture}
											AND module_id=${moduleid};`)
			return data
		} catch(err) {
			throw err
		}
	}


}
