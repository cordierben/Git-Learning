'use strict'
const Score = require('../modules/score.js')

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


