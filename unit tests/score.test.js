'use strict'

const Score = require('../modules/score.js')

describe('score()', () => {
	test('get last score', async done => {
		try{
			const score= await new Score()
			await score.newscore(0,0,0)
			const result= await score.getscore(0,0,0)//Test record
			expect(result.score).toEqual(0)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('No previous score to get', async done => {
		expect.assertions(1)
		const score = await new Score()
		await score.newscore(1,2,3)
		await expect( score.getscore(0,2,3) )
			.rejects.toEqual( Error('user ID "0" does not have a previous score') )
		done()
	})
	test('create a new score', async done => {
		expect.assertions(1)
		try {
			const score= await new Score()
			await score.newscore(0,0,0)
			const result= await score.getscore(0,0,0)
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
			await score.newscore(0,0,0)
			score.updatescore(0,0,0,1,1)
			const result= await score.getscore(0,0,0)
			expect(result.score).toEqual(2)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('update failed/passed', async done => {
		try {
			const score= await new Score()
			await score.newscore(0,0,0)
			score.updatescore(0,0,0,1,1)
			await score.updatefail(0,0,0,'failed',1)
			const data= await score.getscore(0,0,0)
			expect(data.fail).toEqual('failed')
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank user id ', async done => {
		const score= await new Score()
		await expect( score.newscore('',0,0) )
			.rejects.toEqual( Error('missing user id'))
		done()

	})
	test('error if blank lecture id ', async done => {
		const score= await new Score()
		await expect( score.getscore(1,'',0) )
			.rejects.toEqual( Error('missing lecture id'))
		done()

	})
	test('error if blank attempt id to update score ', async done => {
		const score= await new Score()
		await expect( score.updatescore(1,2,3,4,'') )
			.rejects.toEqual( Error('missing attempt id'))
		done()

	})
	test('error if blank pass/fail value ', async done => {
		const score= await new Score()
		await expect( score.updatefail(1,2,3,'',4) )
			.rejects.toEqual( Error('there was no pass/fail given value to update'))
		done()

	})
})


