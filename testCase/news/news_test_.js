const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('Baidu news', () => {
    let browser;
    let page
    before(async () => {
        browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            timeout: 20000,
        });
        page = await browser.newPage();
        await page.goto('http://news.baidu.com/');
    });

    after(async () => {
        await browser.close();
    });


    it('page input class', async () => {
        const valueTest = await page.$eval('input[id="ww"]', el=>el.getAttribute('class'));
        console.log(valueTest)
        expect(valueTest).to.eql("word");
    });

});
