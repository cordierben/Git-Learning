
'use strict'

const Accounts = require('../modules/user.js')
const Score = require('../modules/score.js')
const Lecture = require('../modules/lecture.js')
const Quiz = require('../modules/quiz.js')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'password')
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.register('doej', 'password') )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', 'password') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', '') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		const valid = await account.login('doej', 'password')
		expect(valid).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('score()', () => {
	test('get last score', async done => {
		expect.assertions(1)
		try{
			const score= await new Score()
			await score.newscore(0,0)
			const result= await score.getscore(0,0)//Test record
			expect(result.score).toEqual(0)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('create a new score', async done => {
		expect.assertions(1)
		try {
			const score= await new Score()
			await score.newscore(0,0)
			const result= await score.getscore(0,0)
			expect(result.score).toEqual(0)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('update a score', async done => {
		expect.assertions(1)
		try {
			const score= await new Score()
			await score.newscore(0,0)
			score.updatescore(0,0,1,1)
			const result= await score.getscore(0,0)
			expect(result.score).toEqual(1)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('update failed/passed', async done => {
		try {
			const score= await new Score()
			await score.newscore(0,0)
			score.updatescore(0,0,1,1)
			await score.updatefail(0,0,'failed',1)
			const data= await score.getscore(0,0)
			expect(data.fail).toEqual('failed')
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
})

describe('lecture()', () => {
	test('Add a lecture', async done => {
		try {
			const lecture= await new Lecture()
			await lecture.addlecture(0,"This is a test","This is the text of the test", 0)
			const data= await lecture.getlecture(0)
			expect(data.title).toEqual("This is a test")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('Update a lecture', async done => {
		try {
			const lecture= await new Lecture()
			await lecture.addlecture(0,"This is a test","This is the text of the test", 0)
			await lecture.updatelecture(0,"This is a test but updated","this is the text but updated", 0)
			const data= await lecture.getlecture(0)
			expect(data.title).toEqual("This is a test but updated")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('Delete a lecture', async done => {
		try {
			const lecture= await new Lecture()
			await lecture.addlecture(0,"Lecture 1","Text 1", 0)
			console.log("ok")
			await lecture.deletelecture(0,0)
			const data=await lecture.getlecture(0)
			console.log(data)
			expect(data).toEqual(undefined)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
})

describe('quiz()', () => {
	test('add a question', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addquestion(0,"What is it?",0)
			const data=await quiz.getquestion(0,0)
			expect(data.question).toEqual("What is it?")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('add options', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addoption("1","2","2",0,0)
			const data=await quiz.getoption(0,0)
			expect(data.answer).toEqual("2")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('Get answer', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addoption("1","2","2",0,0)
			const data=await quiz.getanswer(0,0)
			expect(data.answer).toEqual("2")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
})
