import puppeteer from "puppeteer";
import path from "path"
import {websites} from './websites'

const randomIntFromInterval = (min: number, max: number) => {
	// min inclusive and max exclusive
	return Math.floor(Math.random() * (max - min) + min);
};

const sleep_for = async (page: puppeteer.Page, min: number, max: number) => {
	let sleep_duration = randomIntFromInterval(min, max);
	console.log("Waiting for ", sleep_duration / 1000, " seconds");
	await page.waitForTimeout(sleep_duration); // simulate some quasi human behaviour
};

// const authenticatePage = async (page: puppeteer.Page) => {
// 	// $x(`//input[@name="session[username_or_email]"]`)
// 	// $x(`//input[@name="session[password]"]`)
// 	try {
// 		const username_inputs = await page.$x(
// 			`//input[@name="session[username_or_email]"]`
// 		);
// 		const pass_inputs = await page.$x(`//input[@name="session[password]"]`);
// 		if (username_inputs.length > 0 && pass_inputs.length > 0) {
// 			await username_inputs[0].focus();
// 			await page.keyboard.type(username);
// 			await pass_inputs[0].focus();
// 			await page.keyboard.type(password);
// 		}
// 		const loginBtn = await page.$x(
// 			`//div[@role='button']//span[text()='Iniciar sesión']`
// 		);
// 		if (loginBtn.length > 0) {
// 			await loginBtn[0].click();
// 		}
// 	} catch (e) {
// 		console.log(e);
// 	}
// };

const navigateToPage = async (page : puppeteer.Page, URL: string) => {
    await page.goto(URL, {waitUntil: 'networkidle2'});
    await sleep_for(page, 1000,2000)
}


const main_actual = async () => {
	try {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		const URL = websites[0].url
		await page.setViewport({
			width: 1280,
			height: 800,
			deviceScaleFactor: 1,
		});
        for (const website of websites){
            const scriptPath = path.join(__dirname, "scripts", website.scriptName)
            await require(scriptPath)(page, website)
            console.log(`Finish to scrap ${website.scriptName}`)
        }
		// await page.goto(URL, { waitUntil: "networkidle2" });
		// await sleep_for(page, 1000, 2000);

	} catch (e) {
		console.log(e);
	}
};

const main = async () => {
	await main_actual();
};

main();
