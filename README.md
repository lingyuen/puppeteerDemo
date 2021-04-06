# ��һ������װNode.js
1. ����Node.js ��װ����Դ�����ص�ַΪ��https://nodejs.org/en/download/
2. Windows �ϰ�װ Node.js   Windows ��װ��(.msi)
3. ���PATH���������Ƿ�������Node.js�������ʼ=������=������"cmd" => ��������"path"��������½��
```
PATH=C:\oraclexe\app\oracle\product\10.2.0\server\bin;C:\Windows\system32;
C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;
c:\python32\python;C:\MinGW\bin;C:\Program Files\GTK2-Runtime\lib;
C:\Program Files\MySQL\MySQL Server 5.5\bin;C:\Program Files\nodejs\;
C:\Users\rg\AppData\Roaming\npm
```
4. �汾���ԣ�����cmd������ ���롰node --version�� ������ʾ��

```
C:\Users\user>node --version
v14.16.0
```
# �ڶ�������װpuppeteer
- cmd ����������

```
C:\Users\user>npm install puppeteer

> puppeteer@8.0.0 install C:\Users\user\node_modules\puppeteer
> node install.js

Downloading Chromium r856583 - 164.6 Mb [====================] 100% 0.0s
Chromium (856583) downloaded to C:\Users\user\node_modules\puppeteer\.local-chromium\win64-856583
npm WARN saveError ENOENT: no such file or directory, open 'C:\Users\user\package.json'
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN enoent ENOENT: no such file or directory, open 'C:\Users\user\package.json'
npm WARN user No description
npm WARN user No repository field.
npm WARN user No README data
npm WARN user No license field.

+ puppeteer@8.0.0
added 54 packages from 73 contributors and audited 54 packages in 32.509s

8 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
# ��������puppeteerʵ���Զ���
> ʵ�����¹���
1. ���򿪰ٶ���ҳ
2. ����Puppeteer��ȷ������������
3. ������룬���ذٶ���ҳ

> ��дbaidu.js�ű�

```
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: false,
        timeout: 20000,
    });

    const page = await browser.newPage();
    await page.goto('https://baidu.com/');
    const title = await page.title()
    console.log(title);
    await page.type('input[id="kw"]', 'puppeteer');
    await page.click('input[id="su"]');
    await page.waitForSelector('div[class="result c-container new-pmd"]');
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div[class="result c-container new-pmd"]'));
    });
    console.log(links.length);

    await page.$eval('input[id="kw"]', input => input.value = '');
    await page.click('input[id="su"]');


})();

```
> ���нű�
-  ����cmd���� ����ű�Ŀ¼ ִ�� node baidu.js
    
```
C:\Users\user\Desktop>node baidu.js
�ٶ�һ�£����֪��
7
```
# ���Ĳ���Mocha+Chaiʵ�ֲ���
## ��װMocha+Chai

- ��װmocha
    
```
C:\Users\user>npm install -g mocha  //������Ŀ��װ: npm install mocha
D:\nodejs\npm_global\mocha -> D:\nodejs\npm_global\node_modules\mocha\bin\mocha
D:\nodejs\npm_global\_mocha -> D:\nodejs\npm_global\node_modules\mocha\bin\_mocha
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.1 (node_modules\mocha\node_modules\chokidar\node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

+ mocha@8.3.2
added 91 packages from 48 contributors in 25.341s

```
- ��װchai

```
C:\Users\user>npm install chai --save-dev
npm notice save chai is being moved from dependencies to devDependencies
npm WARN user@1.0.0 No description
npm WARN user@1.0.0 No repository field.

+ chai@4.3.4
updated 1 package and audited 61 packages in 4.059s

8 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
- ������Ĵ��룬���� Mocha+Chai�����в���

```
const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('Baidu search', () => {
    let browser;
    let page
    before(async () => {
        browser = await puppeteer.launch({
        headless: true,
        devtools: false,
        timeout: 20000,
    });
        page = await browser.newPage();
        await page.goto('https://baidu.com/');
    });

    after(async () => {
        //await browser.close();
    });


    it('page title', async () => {
		console.log(await page.title());
        expect(await page.title()).to.eql('�ٶ�һ�£����֪��');
    });

    it('get the list number of results', async () => {
        await page.type('input[id="kw"]', 'puppeteer');
        await page.click('input[id="su"]');
        await page.waitFor(2000);
        await page.waitForSelector('div[class="result c-container new-pmd"]');
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div[class="result c-container new-pmd"]'));
        });
		
		console.log(links.length);
        expect(links.length).to.be.greaterThan(0);
    });

    it('back to BaiDu page ', async () => {
        await page.waitFor(2000);
        await page.$eval('input[id="kw"]', input => input.value = '');
        await page.click('input[id="su"]');
        await page.waitFor(2000);
		console.log(await page.title());
        expect(await page.title()).to.eql('�ٶ�һ�£����֪��');
    });

});


```
- Cmd ������ִ��
```
mocha baidu.js -t 30000

//ִ�н����

  Baidu search
�ٶ�һ�£����֪��
    �� page title
waitFor is deprecated and will be removed in a future release. See https://github.com/puppeteer/puppeteer/issues/6214 for details and how to migrate your code.
7
    �� get the list number of results (2162ms)
waitFor is deprecated and will be removed in a future release. See https://github.com/puppeteer/puppeteer/issues/6214 for details and how to migrate your code.
waitFor is deprecated and will be removed in a future release. See https://github.com/puppeteer/puppeteer/issues/6214 for details and how to migrate your code.
�ٶ�һ�£����֪��
    �� back to BaiDu page  (4073ms)


  3 passing (8s)
```
- ʹ��mochawesome�ÿ���html�ļ���ȫ�ְ�װ

```
npm install -g --save-dev mochawesome
```
- ����ִ�нű�����mochawesome��ʽ�������Ա���

```
mocha --reporter mochawesome baidu.js
```

���岽��WebStorm ���� Mocka���в��Խű�
- �� File - Settings - Languages&Frameworks - JavaScript - Libraries - Download
- ѡ������ mocha �� chai  ��������ҪһЩʱ�䣩
- Run/Debug Configurations
    ѡ��File patterns -> Test file patterns ���� ��_test_�� ,��Ҫ���ԵĽű���������  ��_test_��  ������ ��index_test_.js��


