
'use strict'

const Accounts = require('../modules/user.js')
const Score = require('../modules/score.js')

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

describe('uploadPicture()', () => {
	// this would have to be done by mocking the file system
	// perhaps using mock-fs?
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

describe('quiz()', () => {
	test('increment score', async done => {
		expect.assertions(1)
		try{
			let score=0
		    score++
		    expect(score).toEqual(1)
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
})
