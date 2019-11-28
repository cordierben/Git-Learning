'use strict'
const sqlite = require('sqlite-async')

module.exports = class Login{

    constructor(dbName = ':memory')
    {
        return (async() => {
            db = await sqlite.open(dbName)
        })
    }

   async userChecker(name, pass)
    {
        try {
            console.log(name)
            console.log(pass)
            const records = await db.get(`SELECT user FROM user WHERE user="${name}";`)
            if(!records){
                return ctx.redirect('/login?msg=invalid%20username')
            }
            const record = await db.get(`SELECT pass FROM user WHERE user = "${name}";`)
            const valid = await bcrypt.compare(pass, record.pass)
            if(valid === false) return ctx.redirect(`/login?user=${body.user}&msg=invalid%20password`)
            ctx.session.authorised = true
		    ctx.session.id=user.id
		    //VAR FOR THE QUIZ, TO KNOW HOW MANY QUESTIONS THE USER HAS DONE
		    ctx.session.quiz=0
		    return ctx.redirect('/')
        } catch(err)
        {
            throw err
        }
    }
}
