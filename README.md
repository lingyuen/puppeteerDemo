# 第一步：安装Node.js
1. 下载Node.js 安装包及源码下载地址为：https://nodejs.org/en/download/
2. Windows 上安装 Node.js   Windows 安装包(.msi)
3. 检测PATH环境变量是否配置了Node.js，点击开始=》运行=》输入"cmd" => 输入命令"path"，输出如下结果
```
PATH=C:\oraclexe\app\oracle\product\10.2.0\server\bin;C:\Windows\system32;
C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;
c:\python32\python;C:\MinGW\bin;C:\Program Files\GTK2-Runtime\lib;
C:\Program Files\MySQL\MySQL Server 5.5\bin;C:\Program Files\nodejs\;
C:\Users\rg\AppData\Roaming\npm
```
4. 版本测试：进入cmd命令行 输入“node --version” 如下所示：

```
C:\Users\user>node --version
v14.16.0
```
# 第二步：安装puppeteer
- cmd 命令行输入

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
# 第三部：puppeteer实现自动化
> 实现以下功能
1. 将打开百度首页
2. 搜索Puppeteer，确定有搜索内容
3. 清空输入，返回百度首页

> 编写baidu.js脚本

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
> 运行脚本
-  进入cmd命令 进入脚本目录 执行 node baidu.js
    
```
C:\Users\user\Desktop>node baidu.js
百度一下，你就知道
7
```
# 第四部：Mocha+Chai实现测试

- 安装mocha
    
```
C:\Users\user>npm install -g mocha  //本地项目安装: npm install mocha
D:\nodejs\npm_global\mocha -> D:\nodejs\npm_global\node_modules\mocha\bin\mocha
D:\nodejs\npm_global\_mocha -> D:\nodejs\npm_global\node_modules\mocha\bin\_mocha
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.1 (node_modules\mocha\node_modules\chokidar\node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

+ mocha@8.3.2
added 91 packages from 48 contributors in 25.341s

```
- 安装chai

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
- 将上面的代码，加入 Mocha+Chai，进行测试

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
        expect(await page.title()).to.eql('百度一下，你就知道');
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
        expect(await page.title()).to.eql('百度一下，你就知道');
    });

});


```
- Cmd 命令行执行
```
mocha baidu.js -t 30000

//执行结果：

  Baidu search
百度一下，你就知道
    √ page title
waitFor is deprecated and will be removed in a future release. See https://github.com/puppeteer/puppeteer/issues/6214 for details and how to migrate your code.
7
    √ get the list number of results (2162ms)
waitFor is deprecated and will be removed in a future release. See https://github.com/puppeteer/puppeteer/issues/6214 for details and how to migrate your code.
waitFor is deprecated and will be removed in a future release. See https://github.com/puppeteer/puppeteer/issues/6214 for details and how to migrate your code.
百度一下，你就知道
    √ back to BaiDu page  (4073ms)


  3 passing (8s)
```
- 使用mochawesome好看的html文件，全局安装

```
npm install -g --save-dev mochawesome
```
- 重新执行脚本，以mochawesome方式生产测试报告

```
mocha --reporter mochawesome baidu.js
```

# 第五步：WebStorm 配置 Mocka运行测试脚本
- 打开 File - Settings - Languages&Frameworks - JavaScript - Libraries - Download
- 选择下载 mocha 和 chai  （加载需要一些时间）
- Run/Debug Configurations
    选择File patterns -> Test file patterns 输入 “_test_” ,需要测试的脚本命名包含  “_test_”  ，例如 “index_test_.js”


