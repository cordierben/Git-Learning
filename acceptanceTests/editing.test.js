'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')
const shell = require('shelljs')
const sqlite = require('sqlite-async')


const width = 1920
const height = 1080
const delayMS = 5

let browser
let page
let har

// threshold is the difference in pixels before the snapshots dont match
const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2 },
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll( async() => {
	browser = await puppeteer.launch({ headless: true, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
	page = await browser.newPage()
	har = new PuppeteerHar(page)
	await page.setViewport({ width, height })
})

describe('Edit Lectures', () => {

	test('Editing Lecture', async done => {
		//start generating a trace file.
		await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		await har.start({path: 'trace/registering_user_trace.har'})
		//ARRANGE
		await page.goto('http://localhost:8080/adminlogin', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=user]', 'test')
		await page.type('input[name=pass]', 'test')
		await page.click('input[type=submit]')
		await page.type('input[name=showLecture]', '1')
		await page.type('input[name=showModuleID]', '1')
		const imagenum = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(imagenum).toMatchImageSnapshot()
		await page.click('input[type=submit]')
		const image8 = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image8).toMatchImageSnapshot()
		//ASSERT
		//check that the user is taken to the homepage after attempting to login as the new user:
		await page.waitForSelector('input')
		expect( await page.evaluate( () => document.querySelector('input').innerText ) )
			.toBe('')

		// grab a screenshot
		const image6 = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image6).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})
