const puppeteer = require('puppeteer');
const { expect } = require('chai');
describe('Baidu index', () => {
    let browser;
    let page
    before(async () => {
        browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            timeout: 20000,
        });
        page = await browser.newPage();
        await page.goto('https://baidu.com/');
    });

    after(async () => {
        await browser.close();
    });

    it('page title', async () => {
        const text = await page.title();
        console.log(text);
        expect(text).to.eql('百度一下，你就知道');
    });
});
