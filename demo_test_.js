const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('Baidu search', () => {
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
        console.log(await page.title());
        expect(await page.title()).to.eql('百度一下，你就知道');
    });

    it('get the list number of results', async () => {
        await page.type('input[id="kw"]', 'puppeteer');
        await page.click('input[id="su"]');
        await page.waitForSelector('div[class="result c-container new-pmd"]');
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div[class="result c-container new-pmd"]'));
        });

        console.log(links.length);
        expect(links.length).to.be.greaterThan(0);
    });

    it('back to BaiDu page ', async () => {

        await page.$eval('input[id="kw"]', input => input.value = '');
        await page.click('input[id="su"]');
        console.log(await page.title());
        expect(await page.title()).to.eql('百度一下，你就知道');
    });

});
