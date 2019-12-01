'use strict'


const Admin = require('../modules/admin.js')
const Lecture=require('../modules/lecture.js')

describe('login()', () => {

	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Admin()
		await account.register('test', 'password', 'test@gmail.com', 'yes')
		const valid = await account.login('test', 'password')
		expect(valid).toBe(true)
		done()
	})

	test('error if username not specified', async done => {
		const admin = await new Admin()
		await expect(admin.login('', 'ff')).rejects.toEqual(Error('Username not specified'))
		done()
	})
	test('error if password not specified', async done => {
		const admin = await new Admin()
		await expect(admin.login('fff', '')).rejects.toEqual(Error('Password not specified'))
		done()
	})
	test('error if admin not specified', async done => {
		const admin = await new Admin()
		await expect(admin.login('fff', 'f')).rejects.toEqual(Error('Account not admin'))
		done()
	})

	test('error if account not found', async done => {
		const admin = await new Admin()
		await admin.register('tesst', 'fw', 'test@gmail.com')
		await expect(admin.login('test', 'fw')).rejects.toEqual(Error('username "test" not found'))
		done()
	})
	test('error if password not correct', async done => {
		const admin = await new Admin()
		await admin.register('test', 'fw', 'test@gmail.com')
		await expect(admin.login('test', 'f')).rejects.toEqual(Error('invalid password for account "test"'))
		done()
	})
	test('error if account not admin', async done => {
		const admin = await new Admin()
		await admin.register('test', 'password', 'test@gmail.com', 'no')
		await expect(admin.login('test', 'password')).rejects.toEqual(Error('invalid admin for account "test"'))
		done()
	})
})

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Admin()
		const register = await account.register('doej', 'password')
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Admin()
		await account.register('doej', 'password')
		await expect( account.register('doej', 'password') )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Admin()
		await expect( account.register('', 'password') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Admin()
		await expect( account.register('doej', '') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

})