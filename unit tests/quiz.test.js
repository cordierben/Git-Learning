'use strict'

const Quiz = require('../modules/quiz.js')


describe('question()', () => {
	test('add a question', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addquestion(0,'What is it?',0,0)
			const data=await quiz.getquestion(0,0,0)
			expect(data.question).toEqual('What is it?')
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank question ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addquestion(1,'',0,0) )
			.rejects.toEqual( Error('missing question'))
		done()

	})
	test('error if blank question id ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addquestion('','What is git',0,2) )
			.rejects.toEqual( Error('missing question id'))
		done()
	})
	test('error if blank lecture id ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addquestion(1,'What is git','',2))
			.rejects.toEqual( Error('missing lecture id'))
		done()
	})
	test('error if blank module id ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addquestion(1,'What is git',1,''))
			.rejects.toEqual( Error('missing module id'))
		done()
	})
	test('Get question', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addquestion(1,'Why use git?',0,0)
			const data=await quiz.getquestion(1,0,0)
			expect(data.id).toEqual(1)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank lecture id ', async done => {
		const quiz= await new Quiz()
		await quiz.addquestion(1,'Why use git?',0,0)
		await expect( quiz.getquestion(1,'',0) )
			.rejects.toEqual( Error('did not specify which lecture id'))
		done()

	})
})

describe('option()', () => {
	test('add options', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addoption('1','2','2',0,0,0)
			const data=await quiz.getoption(0,0,0)
			expect(data.option1).toEqual('1')
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank option ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.addoption('','B','B',1,0,0) )
			.rejects.toEqual( Error('missing option 1'))
		done()

	})
	test('Get option', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addoption('1','2','2',0,0,0)
			const data=await quiz.getoption(0,0,0)
			expect(data.option1).toEqual('1')
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if option does not exist ', async done => {
		const quiz= await new Quiz()
		await expect( quiz.getoption(1,0,0) )
			.rejects.toEqual( Error('options for the question do not exist'))
		done()

	})
})

describe('answer()', () => {
	test('Get answer', async done => {
		try {
			const quiz= await new Quiz()
			await quiz.addoption('1','2','2',0,0,0)
			const data=await quiz.getanswer(0,0,0)
			expect(data.answer).toEqual('2')
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank question id ', async done => {
		const quiz= await new Quiz()
		await quiz.addoption('1','2','2',0,0,0)
		await expect( quiz.getanswer('',0,0))
			.rejects.toEqual( Error('did not specify which question id the answer belongs to'))
		done()

	})
})
