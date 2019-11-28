#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const bcrypt = require('bcrypt-promise')
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
const sqlite = require('sqlite-async')
const fs = require('fs-extra')
const mime = require('mime-types')
//const jimp = require('jimp')


/* IMPORT CUSTOM MODULES */
require('./modules/user')
const Score=require('./modules/score')
const Lecture=require('./modules/lecture')
const Quiz=require('./modules/quiz')
const Login=require('./modules/login')

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'
const saltRounds = 10

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('Menu')
		const db=await sqlite.open(dbName)
		const data2= await db.all(`SELECT id, title FROM lecture WHERE module_id=${ctx.params.id}`)
		console.log(data2)
		await ctx.render('Menu', {lecture: data2})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
router.get('/editLecture', async ctx=> {
    const data = {}
    if(ctx.query.msg) data.msg = ctx.query.msg
})
router.get('/admin', async ctx => {
		const db = await sqlite.open('./website.db')
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=Only Admin')
		const admin = await db.get(`SELECT admin FROM user WHERE id ="${ctx.session.id}";`)
		if (admin.admin === 'yes')
		{
			const data = {}
			if(ctx.query.msg) data.msg = ctx.query.msg
			await ctx.render('admin')
		} else {
			return ctx.redirect('/login?msg=only for admins')
		}

})
router.get('/uploadLecture', async ctx =>{
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
} )
router.post('/uploadLecture', async ctx=> {
	try {
		const db = await sqlite.open('./website.db')
		const upload = `INSERT INTO lecture(title, text) VALUES("${ctx.request.body.titleLecture}", "${ctx.request.body.textLecture}")`
		await db.run(upload)
		await db.close()
		ctx.redirect('/admin?msg=Uploaded')
	} catch (err){
		await ctx.render('error', {message: err.message})
	}
})

router.post('/editLecture', async ctx=> {
	try {
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		const body = ctx.request.body
		console.log(body)
		const db = await sqlite.open('./website.db')
		const searchLecture = await db.get(`SELECT id, title, text, module_id FROM lecture WHERE id ="${body.showLecture}";`)
		await db.close()
		console.log(searchLecture)
		return ctx.render('admin', {lecture: searchLecture})
	} catch (err){
		await ctx.render('error', {message: err.message})
	}
})
router.post('/updateLecture', async ctx=> {
	try {
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		const body = ctx.request.body
		console.log(body)
		const db = await sqlite.open('./website.db')
		const updateLecture = await db.get(`UPDATE lecture SET module_id ="${body.updateLectureID}", title ="${body.updateLectureTitle}", text ="${body.updateLectureText}" WHERE id ="${body.updateLectureID}";`)
		await db.close()
		console.log(updateLecture)
		return ctx.redirect('/admin?msg=uploaded')        
	} catch (err){
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	await ctx.render('register', data)
})


/**
* The script to process new user registrations.
*
* @name Register Script
* @route {POST} /register
*/
/*eslint max-lines-per-function: ["error", 200]*/


router.post('/register', koaBody, async ctx => {
	try {
		const letters = /^[A-Za-z]+$/
		// CHECKS IF USERNAME AND PASSWORD BOX CONTAINS ONLY LETTERS
		if (ctx.request.body.user.match(letters) && ctx.request.body.pass.match(letters)) {
			// DOES THE USERNAME EXIST IN DATABASE
			const db = await sqlite.open('./website.db')
			const userChecker = await db.get(`SELECT user FROM user WHERE user="${ctx.request.body.user}";`)
			if (!userChecker) {
				// ENCRYPTING PASSWORD AND BUILDING SQL
				ctx.request.body.pass = await bcrypt.hash(ctx.request.body.pass, saltRounds)
				const sql = `INSERT INTO user(user, pass, email) VALUES("${ctx.request.body.user}", "${ctx.request.body.pass}","${ctx.request.body.mail}")`
				await db.run(sql)
				await db.close()
				ctx.redirect('/login')
			} else {
				return ctx.redirect('/register?msg=The username has been taken.')
			}
		} else {
			return ctx.redirect('/register?msg=The username and password box has to contain a value.')
		}
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

/*eslint max-statements: [2, 100]*/

router.post('/login', async ctx => {
	try {
		const db = await sqlite.open('./website.db')
		// DOES THE USERNAME EXIST?
		const records = await db.get(`SELECT user, id, pass FROM user WHERE user="${ctx.request.body.user}";`)
		if(!records) return ctx.redirect('/login?msg=invalid%20username')
		await db.close()
		// DOES THE PASSWORD MATCH?
		const valid = await bcrypt.compare(ctx.request.body.pass, records.pass)
		if(valid === false) return ctx.redirect(`/login?user=${ctx.request.body.user}&msg=invalid%20password`)
		// WE HAVE A VALID USERNAME AND PASSWORD
		ctx.session.authorised = true
		ctx.session.id=records.id
		console.log(ctx.session.id)
		//VAR FOR THE QUIZ, TO KNOW HOW MANY QUESTIONS THE USER HAS DONE
		ctx.session.quiz=0
		return ctx.redirect('/')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
}) 


router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you have logged out successfully')
})

router.post('/logout', async ctx => {
	try {
		ctx.session.authorised = null
		return ctx.redirect('/login?msg=you have logged out successfully')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/* Lecture */

router.get('/lecture/:id', async ctx => {
	try{
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		console.log(ctx.params.id)
		const db=await sqlite.open(dbName)
		const lecture = await new Lecture(dbName)
		const data = await lecture.getlecture(ctx.params.id)
		//console.log(data)
		const sql2=`SELECT MAX(score) as best, date FROM score WHERE user_id=${ctx.session.id}
											AND lecture_id=${ctx.params.id};`
		const data2=await db.get(sql2)
		console.log(data2)
		await ctx.render('lecture', {lecture: data, score: data2})
	} catch(err) {
		ctx.body = err.message
	}
})

/*eslint complexity: ["error", 10]*/
router.get('/lecture/:id1/quiz/:id2', async ctx => {
	try{
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const lecture = await new Lecture(dbName)
		const dataLecture = await lecture.getlecture(ctx.params.id1)
		const quiz = await new Quiz(dbName)
		const dataQuiz = await quiz.getquestion(ctx.params.id2,ctx.params.id1)
		const dataOption = await quiz.getoption(ctx.params.id2,ctx.params.id1)
		if(dataQuiz !== undefined || dataLecture !== undefined || dataOption !== undefined ) {
			await ctx.render('quiz', {question: dataQuiz, lecture: dataLecture, option: dataOption} )
		}
	} catch(err) {
		ctx.body = err.message
	}
})

router.get('/result', async ctx => {
	try {
		const db=await sqlite.open(dbName)
		const data = await db.get(`SELECT MAX(attempt_id) as last, score, fail FROM score 
		                                                WHERE user_id=${ctx.session.id};`)
		console.log(data)
		await ctx.render('result', { score: data} )
	} catch(err) {
		ctx.body = err.message
	}
})

/* Score */

router.post('/lecture/:id1/quiz/:id2', async ctx => {
	try{
		const db=await sqlite.open(dbName)
		const body= ctx.request.body
		const score= await new Score(dbName)
		if(ctx.session.quiz===0) score.newscore(ctx.session.id, ctx.params.id2)
		const quiz = await new Quiz(dbName)
		const data = await quiz.getanswer(ctx.params.id2,ctx.params.id1)
		/*const data=await db.get(`SELECT answer FROM option WHERE question_id = ${ctx.params.id2}
		                                                    AND lecture_id=${ctx.params.id1};`)*/
		const data2=score.getscore(ctx.session.id,ctx.params.id1)
		if(ctx.params.id2!==0) {
			if(body.option===data.answer) {
				data2.score++
				score.updatescore(ctx.session.id,ctx.params.id1,data2.score,data2.last)
			}
		}
		const end=9
		console.log(ctx.session.quiz)
		//console.log(ctx.session.id)
		//console.count();
		if(ctx.session.quiz===end) { //IF END OF THE QUIZ? GOES TO RESULT PAGE AND MARKED FAILED OR PASSED IN DB
			const minimum=4
			if(data2.score<minimum) score.updatefail(ctx.session.id,ctx.params.id1,'failed',data2.last)
			else score.updatefail(ctx.session.id,ctx.params.id1,'passed',data2.last)
			ctx.session.quiz=0
			await db.close()
			return ctx.redirect('/result')
		} else {//Else go to next question randomly
			ctx.session.quiz++
			//ctx.session.id ++
			//return ctx.redirect(`/lecture/${ctx.params.id1}/quiz/${ctx.params.id2}+1`)
			let x=0
			while(x<=10){
				const random=Math.floor(Math.random() * 20 + 1)
				ctx.redirect(`/lecture/${ctx.params.id1}/quiz/${random}`)
				x++
			}
            
		}
	} catch(err) {
		ctx.body = err.message
	}
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
