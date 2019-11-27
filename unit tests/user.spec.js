
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
	
	test('get lecture', async done => {
		try{
			const lecture= await new Lecture()
			const add =await lecture.addlecture(1,"html","html rules",0)
			const data= await lecture.getlecture(1,0)
			expect(data.lecture).toEqual(add) 
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('update lecture content', async done => {
		try{
			const lecture= await new Lecture()
			await lecture.addlecture(1,"html","html rules",0)
			await lecture.updatelecture(1,"Using html5","html5 semantic rules",0)
			const data= await lecture.getlecture(1,0)		
			expect(data.title).toEqual("Using html5")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('lecture to update does not exist ', async done => {
		const lecture= await new Lecture()
		await expect( lecture.updatelecture(1,0) )
			.rejects.toEqual( Error('lecture not found'))
		done()
	
    })
	test('add a single lecture', async done => {
		try {
			const lecture= await new Lecture()
			await lecture.addlecture(1,"html","html rules",0)
			const data= await lecture.getlecture(1,0)
			expect(data.title).toEqual("html")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank title ', async done => {
			const lecture= await new Lecture()
			await expect( lecture.addlecture(1,"","html rules",0) )
				.rejects.toEqual( Error('missing lecture title'))
			done()
		
	})
	test('error if blank lecture id ', async done => {
		const lecture= await new Lecture()
		await expect( lecture.addlecture("","html","html rules",0) )
			.rejects.toEqual( Error('missing lecture id'))
		done()
	
	})	
	test('error if blank lecture text ', async done => {
		const lecture= await new Lecture()
		await expect( lecture.addlecture(1,"html","",0) )
			.rejects.toEqual( Error('missing lecture text'))
		done()
	
	})
	test('error if blank module id when adding a new lecture ', async done => {
		const lecture= await new Lecture()
		await expect( lecture.addlecture(1,"html","html rules","") )
			.rejects.toEqual( Error('missing module id'))
		done()
	
	})
	test('error if blank module id when getting a  lecture ', async done => {
		const lecture= await new Lecture()
		await lecture.addlecture(1,"html","html rules",0)
		await expect( lecture.getlecture(1,"") )
			.rejects.toEqual( Error('did not specify which module id'))
		done()
	
	})
	test('error if blank lecture id when getting a  lecture ', async done => {
		const lecture= await new Lecture()
		await lecture.addlecture(1,"html","html rules",0)
		await expect( lecture.getlecture("",0) )
			.rejects.toEqual( Error('did not specify which lecture id'))
		done()
	
    })
	test('Delete a lecture', async done => {
		try {
			const lecture= await new Lecture()
			await lecture.addlecture(0,"Lecture 1","Text 1", 0)
			console.log("ok")
			await lecture.deletelecture(0,0)
			const data=await lecture.getlecture(0,0)
			console.log(data)
			expect(data).toEqual(undefined)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('lecture to delete does not exist ', async done => {
		const lecture= await new Lecture()
		await expect( lecture.deletelecture(1,0) )
			.rejects.toEqual( Error('lecture not found'))
		done()
	
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
	test('error if blank question ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addquestion(1,"",0) )
			.rejects.toEqual( Error('missing question'))
		done()
	
	})
	test('error if blank question id ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addquestion("","What is git",0) )
			.rejects.toEqual( Error('missing question id'))
		done()
	
	})
	test('error if blank lecture id ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addquestion(1,"What is git","") )
			.rejects.toEqual( Error('missing lecture id'))
		done()
	
	})
	
	test('add options', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addoption("1","2","2",0,0)
			const data=await quiz.getoption(0,0)
			expect(data.option1).toEqual("1")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank answer ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addoption("A","B","",1,0) )
			.rejects.toEqual( Error('missing answer'))
		done()
	
	})
	test('Get question', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addquestion(1,"Why use git?",0)
			const data=await quiz.getquestion(1,0)
			expect(data.id).toEqual(1)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank lecture id ', async done => {
		const quiz= await new Quiz()
		await quiz.addquestion(1,"Why use git?",0)
		await expect( quiz.getquestion(1,"") )
			.rejects.toEqual( Error('did not specify which lecture id'))
		done()
	
	})
	
	test('Get option', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addoption("1","2","2",0,0)
			const data=await quiz.getoption(0,0)
			expect(data.option1).toEqual("1")
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if option does not exist ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.getoption(1,0) )
			.rejects.toEqual( Error('options for the question do not exist'))
		done()
	
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
	test('error if blank question id ', async done => {
		const quiz= await new Quiz()
		await quiz.addoption("1","2","2",0,0)
		await expect( quiz.getanswer("",0) )
			.rejects.toEqual( Error('did not specify which question id the answer belongs to'))
		done()
	
	})

})
