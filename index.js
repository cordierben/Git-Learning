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
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/html', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('Menuhtml')
	} catch(err) {
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
		const body = ctx.request.body
		console.log(body)
		// PROCESSING FILE
		const {path, type} = ctx.request.files.avatar
		const fileExtension = mime.extension(type)
		console.log(`path: ${path}`)
		console.log(`type: ${type}`)
		console.log(`fileExtension: ${fileExtension}`)
		await fs.copy(path, 'public/avatars/avatar11.png')
		// USERNAME AND PASSWORD BLANK CHECKER
		const x = body.user
		const y = body.pass
		const letters = /^[A-Za-z]+$/
		// CHECKS IF USERNAME AND PASSWORD BOX CONTAINS ONLY LETTERS
		if (x.match(letters) && y.match(letters)) {
			// DOES THE USERNAME EXIST IN DATABASE
			const db = await sqlite.open('./website.db')
			const userChecker = await db.get(`SELECT user FROM user WHERE user="${body.user}";`)
			if (!userChecker) {
				// ENCRYPTING PASSWORD AND BUILDING SQL
				body.pass = await bcrypt.hash(body.pass, saltRounds)
				/*Adds username, password and email into the database */
				const sql = `INSERT INTO user(user, pass, email) VALUES("${body.user}", "${body.pass}","${body.mail}")`
				console.log(sql)
				// DATABASE COMMANDS
				await db.run(sql)
				await db.close()
				// REDIRECTING USER TO HOME PAGE
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
		const body = ctx.request.body
		const db = await sqlite.open('./website.db')
		// DOES THE USERNAME EXIST?
		const records = await db.get(`SELECT user FROM user WHERE user="${body.user}";`)
		if(!records) return ctx.redirect('/login?msg=invalid%20username')
		const record = await db.get(`SELECT pass FROM user WHERE user = "${body.user}";`)
		const user = await db.get(`SELECT id FROM user WHERE user = "${body.user}";`)
		await db.close()
		// DOES THE PASSWORD MATCH?
		const valid = await bcrypt.compare(body.pass, record.pass)
		if(valid === false) return ctx.redirect(`/login?user=${body.user}&msg=invalid%20password`)
		// WE HAVE A VALID USERNAME AND PASSWORD
		ctx.session.authorised = true
		ctx.session.id=user.id
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
		let data2
		const score= await new Score(dbName)
		if(ctx.params.id2!==0) {
			if(ctx.session.quiz===0) score.newscore(ctx.session.id, ctx.params.id1)
			ctx.session.quiz++
			const quiz = await new Quiz(dbName)
			const data = await quiz.getanswer(ctx.params.id2,ctx.params.id1)
			data2=await score.getscore(ctx.session.id,ctx.params.id1)
			if(body.option===data.answer) {
				data2.score++
				score.updatescore(ctx.session.id,ctx.params.id1,data2.score,data2.last)
			}
		}
		const end=9
		console.log(ctx.session.quiz)
		if(ctx.session.quiz===end) { //IF END OF THE QUIZ? GOES TO RESULT PAGE AND MARKED FAILED OR PASSED IN DB
			console.log('end')
			console.log(data2.last)
		    console.log(data2.score)
			const minimum=4
			if(data2.score<minimum) score.updatefail(ctx.session.id,ctx.params.id1,'failed',data2.last)
			else score.updatefail(ctx.session.id,ctx.params.id1,'passed',data2.last)
			ctx.session.quiz=0
			await db.close()
			return ctx.redirect('/result')
		} else {//Else go to next question randomly
			let x=0
			const max =10
			while(x<=max) {
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
