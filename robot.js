const puppeteer = require('puppeteer');
const websites = require('./webSite')
const fs =  require('fs-extra')

const uploade = async (url,localeFile,urlFileUploeaded) => {
    // let launchOptions = { headless: false, args: ['--start-maximized','--incognito'] };
    let launchOptions = { headless: false, args: ['--incognito'] };
    let website = websites.find(site => site.url === url)
    try {
        const browser = await puppeteer.launch(launchOptions);
    const context = await browser.createIncognitoBrowserContext();
    // const page = await browser.newPage();
    // const page = await browser.newPage();
    const page = await context.newPage();

    // set viewport and user agent (just in case for nice viewing)
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    // open the webe page for uploade file
    await page.goto(website.url);

    // get the selector input type=file (for upload file)
    await page.waitForSelector(website.uploadeTage);
    await page.waitFor(1000);

    if(website.firstClick){ 
        await page.click(website.firstClick)
        await page.waitFor(1000);
    } 
    // get the ElementHandle of the selector above
    const inputUploadHandle = await page.$(website.uploadeTage);
    
    const result = await inputUploadHandle.uploadFile(localeFile);
    console.log(result);
    // if(infoObject.btnDownlaodTag){
    //     await page.click(infoObject.btnDownlaodTag)
    // }else{
    //     await inputUploadHandle.uploadFile(infoObject.LienFileInComputer)
    // }
    if(website.btnUploadeTage) {
        const inputUploadHandle = await page.$(website.btnUploadeTage);
        await page.waitFor(1000)
        if(inputUploadHandle){inputUploadHandle.click()}else{await page.click(website.btnUploadeTage)}
        // await page.click(website.btnUploadeTage)
        }
    // wait for selector that contains the url of the file
    // await page.waitForSelector(urlFileUploeaded)
    await page.waitFor(2*10000)

    // get the download url
    // let downloadUrl = await page.evaluate(() => {
        
    //     return document.querySelector(infoObject.tagURLFile).getAttribut("href")
    // })

    // page.evaluate(() => {
    //     url = document.querySelector(infoObject.tagURLFile)
    //     console.log(url)
    // })
    
    console.log('task complited')
    // console.log(downloadUrl)
    // await page.screenshot({path: 'example.png'});
    // console.log('task completed')
   
    // remove file 

    // await fs.unlinkSync(localeFile)
    // await page.waitFor(1000)
    // console.log('file deleted')
      
    await page.close()
    await browser.close();
    } catch (error) {
        console.log('error')
    }
    // return true
    // return downloadUrl
}

const testUrlFile = async (url) => {

    let launchOptions = { headless: false, args: ['--start-maximized'] };

    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // set viewport and user agent (just in case for nice viewing)
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    // open the webe page for uploade file
    const responce = await page.goto(url, {
        timeout: 80000,
        waitUntil: 'networkidle2'
    });
    // await page.close()
    console.log(responce.status())

    return responce.status()
}




module.exports = {
    uploade,
    testUrlFile
}
