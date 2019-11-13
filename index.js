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
const User = require('./modules/user')

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


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx =>  {
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
		const x = body.user;
		const y = body.pass;
		const letters = /^[A-Za-z]+$/;
		// CHECKS IF USERNAME AND PASSWORD BOX CONTAINS ONLY LETTERS
		if (x.match(letters) && y.match(letters)) {
			// DOES THE USERNAME EXIST IN DATABASE
			const db = await sqlite.open('./website.db')
			const userChecker = await db.get(`SELECT user FROM users WHERE user="${body.user}";`)
			if (!userChecker) {
				// ENCRYPTING PASSWORD AND BUILDING SQL
				body.pass = await bcrypt.hash(body.pass, saltRounds)
				const sql = `INSERT INTO users(user, pass) VALUES("${body.user}", "${body.pass}")`
				console.log(sql)
				// DATABASE COMMANDS
				await db.run(sql)
				await db.close()
				// REDIRECTING USER TO HOME PAGE
				ctx.redirect(`/login`)
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
		const records = await db.get(`SELECT user FROM users WHERE user="${body.user}";`)
		if(!records) return ctx.redirect('/login?msg=invalid%20username')
		const record = await db.get(`SELECT pass FROM users WHERE user = "${body.user}";`)
		await db.close()
		// DOES THE PASSWORD MATCH?
		const valid = await bcrypt.compare(body.pass, record.pass)
		if(valid === false) return ctx.redirect(`/login?user=${body.user}&msg=invalid%20password`)
		// WE HAVE A VALID USERNAME AND PASSWORD
		ctx.session.authorised = true
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
		ctx.session.authorised = null;
		return ctx.redirect('/login?msg=you have logged out successfully')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
 })

 





 
/* Lecture */



router.get('/lecture/:id', async ctx =>{
	try{
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		console.log(ctx.params.id)
		const sql = `SELECT * FROM lecture WHERE id = ${ctx.params.id};`
		const db=await sqlite.open(dbName)
		const data=await db.get(sql)
		await ctx.render('lecture', {lecture: data})
	} catch(err) {
		ctx.body = err.message
	}
})

/* Quizz */




app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))


