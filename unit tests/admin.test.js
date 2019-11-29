'use strict'


const Admin = require('../modules/admin.js')

describe('editLecture()', () => {

    test('get lecture', async done => {
        try{
            const admin = await new Admin()
            const lecture = await new Lecture()
            const finder = await admin.editLecture(1)
           
        } catch(err) {
			done.fail('test failed')
		} finally {
			done()
		}
    })
})