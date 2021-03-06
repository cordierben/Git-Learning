'use strict'


const Lecture = require('../modules/lecture.js')


describe('get lecture()', () => {

	test('get lecture', async done => {
		try{
			const lecture= await new Lecture()
			await lecture.addlecture(1,'html','html rules',0)
			const data= await lecture.getlecture(1,0)
			expect(data.id).toEqual(1)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})

	test('error if blank module id when getting a  lecture ', async done => {
		const lecture= await new Lecture()
		await lecture.addlecture(1,'html','html rules',0)
		await expect( lecture.getlecture(1,'') )
			.rejects.toEqual( Error('did not specify which module id'))
		done()

	})
	test('error if blank lecture id when getting a  lecture ', async done => {
		const lecture= await new Lecture()
		await lecture.addlecture(1,'html','html rules',0)
		await expect( lecture.getlecture('',0) )
			.rejects.toEqual( Error('did not specify which lecture id'))
		done()

	})
	test('get each lecture', async done => {
		try{
			const lecture= await new Lecture()
			await lecture.addlecture(1,'html','html rules',0)
			const data= await lecture.eachLecture()
			expect(data[0].id).toEqual(1)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank lecture id when getting a  lecture ', async done => {
		const lecture= await new Lecture()
		await lecture.addlecture(1,'html','html rules',0)
		await expect( lecture.allLectureModule('') )
			.rejects.toEqual( Error('did not specify which module id'))
		done()

	})
	test('get all lectures in a module', async done => {
		try{
			const lecture= await new Lecture()
			await lecture.addlecture(1,'html','html rules',0)
			const data= await lecture.allLectureModule(0)
			expect(data[0].id).toEqual(1)
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})

})

describe('update lecture()', () => {
	test('update lecture content', async done => {
		try{
			const lecture= await new Lecture()
			await lecture.addlecture(1,'html','html rules',0)
			await lecture.updatelecture(1,'Using html5','html5 semantic rules',0)
			const data= await lecture.getlecture(1,0)
			expect(data.title).toEqual('Using html5')
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
})

describe('add lecture()', () => {
	test('add a single lecture', async done => {
		try {
			const lecture= await new Lecture()
			await lecture.addlecture(1,'html','html rules',0)
			const data= await lecture.getlecture(1,0)
			expect(data.title).toEqual('html')
		} catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
	})
	test('error if blank title ', async done => {
		const lecture= await new Lecture()
		await expect(lecture.addlecture(1,'','html rules',0))
			.rejects.toEqual( Error('A parameter is missing'))
		done()

	})
	test('error if blank lecture id ', async done => {
		const lecture= await new Lecture()
		await expect( lecture.addlecture('','html','html rules',0) )
			.rejects.toEqual( Error('A parameter is missing'))
		done()

	})
	test('error if blank lecture text ', async done => {
		const lecture= await new Lecture()
		await expect( lecture.addlecture(1,'html','',0) )
			.rejects.toEqual( Error('A parameter is missing'))
		done()

	})
	test('error if blank module id when adding a new lecture ', async done => {
		const lecture= await new Lecture()
		await expect( lecture.addlecture(1,'html','html rules','') )
			.rejects.toEqual( Error('A parameter is missing'))
		done()

	})
})
describe('delete lecture()', () => {
	test('Delete a lecture', async done => {
		try {
			const lecture= await new Lecture()
			await lecture.addlecture(0,'Lecture 1','Text 1', 0)
			await lecture.deletelecture(0,0)
			const data=await lecture.getlecture(0,0)
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
