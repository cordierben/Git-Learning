
'use strict'

const Accounts = require('../modules/user.js')


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
		expect(valid).toBe(1)
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

describe('selectUser()', () => {

	test('user selected', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('user', 'f', 'f')
		const valid = await account.selectUser('user')
		expect(valid).toBe(false)
		done()
	})

	test('missing user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('f', 'password', 'undefined')
		await expect(account.selectUser(''))
			.rejects.toEqual( Error('missing username') )
		done()
	})

})

describe('getuser()', () => {

	test('missing user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('f', 'password', 'undefined')
		await expect(account.getuser(''))
			.rejects.toEqual( Error('missing username') )
		done()
	})
})