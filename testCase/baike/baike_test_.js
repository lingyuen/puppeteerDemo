const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('Baidu baike', () => {
    let browser;
    let page
    before(async () => {
        browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            timeout: 20000,
        });
        page = await browser.newPage();
        await page.goto('https://baike.baidu.com/');
    });

    after(async () => {
        await browser.close();
    });


    it('page input name attr', async () => {
        const valueTest = await page.$eval('input[id="query"]', el=>el.getAttribute('name'));
        console.log(valueTest)
        expect(valueTest).to.eql("word");
    });

});
