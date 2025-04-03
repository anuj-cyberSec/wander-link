const puppeteer = require('puppeteer');

(async () => {
    const browswer = await puppeteer.launch({headless: false});
    const page = await browswer.newPage();
    const urls = ['https://academy.hackthebox.com/module/144/section/1247'];

    await  page.goto(urls, {waitUntil: 'networkidle2'});
    await page.screenshot({path:'screenshot1.png', fullPage: true});
    console.log("saved");
    await browswer.close();
})();  