import puppeteer from "puppeteer";
import { website } from "../interfaces";
import fs from 'fs'
import path from 'path';

module.exports = async (page: puppeteer.Page, website: website) => {
	await page.goto(website.url);
    
    await page.waitForTimeout(3000)
    const explorarBtn = await page.$x(`//a[@title="Explorar"]`)
    if (explorarBtn.length > 0) await explorarBtn[0].click()
    await page.waitForTimeout(3000)
    await page.click('#destination-content-root')
    await page.waitForTimeout(3000)
    // titles selector document.querySelectorAll('#dismissible  ytd-video-renderer #meta')
    const trendText : string[] = await page.evaluate(()=>{
        const trendList = Array.from(document.querySelectorAll('#dismissible  ytd-video-renderer #meta'))
        const trendText = []
        for (const video of trendList){
            // @ts-ignore
            trendText.push(video.innerText)
        }
        return trendText
    })
    const trends = []
    const regExp = new RegExp('[A-z]+');
    for (const text of trendText){
        const textSplited = text.split('\n').map(txt => txt.trim()).filter(txt => regExp.test(txt))
        const newTrend = {
            name: textSplited[0],
            channel : textSplited[1],
            views: textSplited[2],
            dateAdded : textSplited[3]
        }
        trends.push(newTrend)
    }

    fs.writeFileSync(path.join(__dirname, `${website.scriptName}.json`), JSON.stringify(trends), 'utf8');

    // await page.close()
};
