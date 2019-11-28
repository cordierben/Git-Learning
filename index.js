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
const User=require('./modules/user')
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
		const db=await sqlite.open(dbName)
		const data2= await db.all(`SELECT id, name FROM module`)
		console.log(data2)
		await ctx.render('Home', {home: data2})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
router.get('/menu/:id', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		const db=await sqlite.open(dbName)
		const data2= await db.all(`SELECT id, title, module_id FROM lecture WHERE module_id=${ctx.params.id}`)
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
		if (admin.admin === 'yes') {
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
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

router.post('/editLecture', async ctx => {
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
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})
router.post('/updateLecture', async ctx => {
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
	} catch (err) {
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
		//if (ctx.request.body.user.match(letters) && ctx.request.body.pass.match(letters)) 
		if (x.match(letters) && y.match(letters)) {
			await sqlite.open(dbName)
			const register = await new User(dbName)
			const newUserChecker = await register.selectUser(body.user)
			console.log(newUserChecker)
			if (newUserChecker === true) {
				await register.register(body.user, body.pass,body.email)
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
		const db = await sqlite.open(dbName)
		const account = await new User(dbName)
		const user = await account.selectUser(body.user)
		const login = await account.login(body.user, body.pass)
		await db.close()
		ctx.session.authorised = true
		ctx.session.id=user.id
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

router.get('/lecture/:id/module/:id3', async ctx => {
	try{
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		console.log(ctx.params.id)
		const db=await sqlite.open(dbName)
		const lecture = await new Lecture(dbName)
		const data = await lecture.getlecture(ctx.params.id, ctx.params.id3)
		//console.log(data)
		const sql2=`SELECT MAX(score) as best, date FROM score WHERE user_id=${ctx.session.id}
															   AND lecture_id=${ctx.params.id}
															   AND module_id=${ctx.params.id3};`
		const data2=await db.get(sql2)
		console.log(data2)
		await ctx.render('lecture', {lecture: data, score: data2})
	} catch(err) {
		ctx.body = err.message
	}
})

/*eslint complexity: ["error", 10]*/
router.get('/lecture/:id1/quiz/:id2/module/:id3', async ctx => {
	try{
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const lecture = await new Lecture(dbName)
		const dataLecture = await lecture.getlecture(ctx.params.id1, ctx.params.id3)
		const quiz = await new Quiz(dbName)
		const dataQuiz = await quiz.getquestion(ctx.params.id2,ctx.params.id1, ctx.params.id3)
		const dataOption = await quiz.getoption(ctx.params.id2,ctx.params.id1, ctx.params.id3)
		if(dataQuiz !== undefined || dataLecture !== undefined || dataOption !== undefined ) {
			await ctx.render('quiz', {question: dataQuiz, lecture: dataLecture, option: dataOption} )
		}
	} catch(err) {
		ctx.body = err.message
	}
})

router.get('/result/:id1', async ctx => {
	try {
		const db=await sqlite.open(dbName)
		const data = await db.get(`SELECT MAX(attempt_id) as last, score, fail FROM score 
														WHERE user_id=${ctx.session.id}
														AND module_id=${ctx.params.id1};`)
		console.log(data)
		await ctx.render('result', { score: data} )
	} catch(err) {
		ctx.body = err.message
	}
})

/* Score */
/*eslint-disable eqeqeq*/
router.post('/lecture/:id1/quiz/:id2/module/:id3', async ctx => {
	try{
		const db=await sqlite.open(dbName)
		const body= ctx.request.body
		const score= await new Score(dbName)
		if(ctx.params.id2!=0) { 
			console.log('premier if')
			console.log("le compteur :")
			console.log(ctx.session.quiz)
			if(ctx.session.quiz===0) {
				console.log("second if")
				score.newscore(ctx.session.id, ctx.params.id1, ctx.params.id3)
			}
			ctx.session.quiz++
			const quiz = await new Quiz(dbName)
			const data = await quiz.getanswer(ctx.params.id2,ctx.params.id1, ctx.params.id3)
			data2=await score.getscore(ctx.session.id,ctx.params.id1, ctx.params.id3)
			if(body.option===data.answer) {
				data2.score++
				score.updatescore(ctx.session.id,ctx.params.id1, ctx.params.id3, data2.score,data2.last)
			}
		}
		const end=9
		if(ctx.session.quiz===end) { //IF END OF THE QUIZ? GOES TO RESULT PAGE AND MARKED FAILED OR PASSED IN DB
			const minimum=4
			if(data2.score<minimum) score.updatefail(ctx.session.id,ctx.params.id1, ctx.params.id3,'failed',data2.last)
			else score.updatefail(ctx.session.id,ctx.params.id1, ctx.params.id3, 'passed',data2.last)
			ctx.session.quiz=0
			await db.close()
			return ctx.redirect(`/result/${ctx.params.id3}`)
		} else {//Else go to next question randomly
				const random=Math.floor(Math.random() * 20 + 1)
				ctx.redirect(`/lecture/${ctx.params.id1}/quiz/${random}/module/${ctx.params.id3}`)
			}
	} catch(err) {
		ctx.body = err.message
	}
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
