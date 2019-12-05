'use strict'

const Module = require('../modules/module.js')

describe('module()', () => {
	test('empty module table', async done => {
		const module = await new Module()
		await expect( module.allmodule(1) )
			.rejects.toEqual( Error('no modules stored') )
		done()
	})

	test('missing module id ', async done => {
		const module = await new Module()
		await expect( module.addmodule('','javascript') )
			.rejects.toEqual( Error('missing module id') )
		done()
	})
	test('missing module name ', async done => {
		const module = await new Module()
		await expect( module.addmodule(1,'') )
			.rejects.toEqual( Error('missing module name') )
		done()
	})

	test('get all modules', async done => {
		try{
			const module= await new Module()
			await module.addmodule(0,'javascript')
			const result= await module.allmodule()
			expect(result[0].id).toEqual(0)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
})
