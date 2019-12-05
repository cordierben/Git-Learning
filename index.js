#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
const sqlite = require('sqlite-async')

/* IMPORT CUSTOM MODULES */
const User=require('./modules/user')
const Score=require('./modules/score')
const Lecture=require('./modules/lecture')
const Quiz=require('./modules/quiz')
const Admin=require('./modules/admin')
const Module=require('./modules/module')

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
		await ctx.render('index')
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})
router.get('/profile', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		const scores = await new Score(dbName)
		const data4 = await scores.allscores(ctx.session.id)
		await ctx.render('profile', {score: data4 })
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
router.get('/Home', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		const module = await new Module(dbName)
		const data2 = await module.allmodule()
		const lectures = await new Lecture(dbName)
		const data3 = await lectures.eachLecture()
		await ctx.render('Home', {module: data2 ,lecture: data3 })
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/menu/:id', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		const module = await new Module(dbName)
		const data3 = await module.allmodule()
		const lectures = await new Lecture(dbName)
		const data2 = await lectures.allLectureModule(ctx.params.id)
		await ctx.render('Menu', {lecture: data2, module: data3})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
router.get('/editLecture', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
})
router.get('/admin', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
})
router.get('/uploadLecture', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
} )
router.get('/adminlogin', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('adminlogin', data)
})

router.post('/adminlogin', async ctx => {
	try {
		const db = await sqlite.open(dbName)
		await db.close()
		return ctx.render('admin')
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})
router.post('/uploadLecture', async ctx => {
	try {
		const db = await sqlite.open(dbName)
		await db.close()
		return ctx.render('admin')
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})
router.post('/editLecture', async ctx => {
	try {
		const body = ctx.request.body
		const db = await sqlite.open(dbName)
		const searchLecture = await new Lecture(dbName)
		const finder = await searchLecture.getlecture(body.showLecture, body.showModuleID)
		await db.close()
		return ctx.render('admin', {lecture: finder})
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})
router.post('/updateLecture', async ctx => {
	try {
		const db = await sqlite.open(dbName)
		await db.close()
		return ctx.render('admin')
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

router.post('/register', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		const letters = /^[A-Za-z]+$/
		const x = body.user
		const y = body.pass
		if (x.match(letters) && y.match(letters)) {
			await sqlite.open(dbName)
			const register = await new User(dbName)
			const newUserChecker = await register.selectUser(body.user)
			if (newUserChecker === true) {
				await register.register(body.user, body.pass, body.email)
				// REDIRECTING USER TO HOME PAGE
				ctx.redirect('/login')
			} else return ctx.redirect('/register?msg=The username has been taken.')
		} else return ctx.redirect('/register?msg=The username and password box has to contain a value.')
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

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const db = await sqlite.open(dbName)
		const account = await new User(dbName)
		const login = await account.login(body.user, body.pass)
		await db.close()
		console.log(login)
		ctx.session.authorised = true
		ctx.session.id=login
		console.log(ctx.session.id)
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
		const lecture = await new Lecture(dbName)
		const data = await lecture.getlecture(ctx.params.id, ctx.params.id3)
		const data4 = await lecture.allLectureModule(ctx.params.id3)
		const module = await new Module(dbName)
		const data3 = await module.allmodule()
		const score = await new Score(dbName)
		const data2 = await score.getHighestScore(ctx.session.id,ctx.params.id,ctx.params.id3)
		await ctx.render('lecture', {lecture: data, lectures: data4, score: data2, module: data3})
	} catch(err) {
		ctx.body = err.message
	}
})

/*QUIZ*/

router.get('/lecture/:id1/quiz/:id2/module/:id3', async ctx => {
	try{
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const lecture = await new Lecture(dbName)
		const dataLecture = await lecture.getlecture(ctx.params.id1, ctx.params.id3)
		const module = await new Module(dbName)
		const data3 = await module.allmodule()
		const quiz = await new Quiz(dbName)
		const dataQuiz = await quiz.getquestion(ctx.params.id2,ctx.params.id1, ctx.params.id3)
		const dataOption = await quiz.getoption(ctx.params.id2,ctx.params.id1, ctx.params.id3)
		if(dataQuiz !== undefined || dataLecture !== undefined ) {
			await ctx.render('quiz', {question: dataQuiz, lecture: dataLecture, option: dataOption, module: data3 } )
		}
	} catch(err) {
		ctx.body = err.message
	}
})

router.get('/result/:id1/:id2', async ctx => {
	try {
		const score = await new Score(dbName)
		const data = await score.getscore(ctx.session.id,ctx.params.id2, ctx.params.id1)
		await ctx.render('result', { score: data} )
	} catch(err) {
		ctx.body = err.message
	}
})

/* Score */

router.post('/lecture/:id1/quiz/:id2/module/:id3', async ctx => {
	try{
		const value={'zero': 0,'four': 4,'ten': 10, 'data2': 0}
		const params={'lecture': ctx.params.id1, 'quiz': ctx.params.id2, 'module': ctx.params.id3}
		const score= await new Score(dbName)
		if(ctx.session.quiz===0) score.newscore(ctx.session.id, params.lecture, params.module)
		if(params.quiz>0) await question(ctx.request.body, value, params, ctx.session.id)
		ctx.session.quiz++
		if(ctx.session.quiz===value.ten) {
			fail(value, params, ctx.session.id)
			ctx.session.quiz=0
			return ctx.redirect(`/result/${ctx.params.id3}/${ctx.params.id1}`)
		} else {//Else go to next question randomly
			const random= await gen()
			ctx.redirect(`/lecture/${ctx.params.id1}/quiz/${random}/module/${ctx.params.id3}`)
		}
	} catch(err) {
		ctx.body = err.message
	}
})

//Random Generator

const gen= async function() {
	try {
		const mult=20
	    const random=Math.floor(Math.random() * mult + 1)
	    return random
	} catch(err) {
		throw err
	}
}

const question= async function(body, value, params, user ) {
	try {
		console.log('quest')
		const quiz = await new Quiz(dbName)
		const score = await new Score(dbName)
		const data = await quiz.getanswer(params.quiz,params.lecture, params.module)
		value.data2 = await score.getscore(user, params.lecture, params.module)
		if(body.option===data.answer) {
			score.updatescore(user, params.lecture, params.module, value.data2.score, value.data2.last)
		}
	} catch(err) {
		throw err
	}
}

const fail= async function(value, params, user) {
	try {
		const score= await new Score(dbName)
		value.data2 = await score.getscore(user, params.lecture, params.module)
		if(value.data2.score<value.four) score.updatefail(user,params.lecture, params.module,'failed',value.data2.last)
		else score.updatefail(user,params.lecture, params.module, 'passed',value.data2.last)
	} catch(err) {
		throw err
	}
}
app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
