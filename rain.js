const {uploade} = require('./robot')
const data = require('./data')
const puppeteer = require('puppeteer');
// var fs = require('fs');
const fs = require('fs-extra')
const axios = require('axios')
const uploadeScripte = require('./uploadeScripte')
const secondPage = require('./secondPage')
const tirdpage = require('./tirdpage')
const firstPage = require('./firstPage')
const lastpage = require('./lastpage')
const pageFour = require('./pageFour')
const trash = require('./trash');
const pagesix = require('./6page')
const pagesetp = require('./7page') 
const mesLiens = require('./mesLiens')
const eightpage = require('./8page')



//*************for upload a file *********************//
// uploade function 
// uplode (url,localeFile,urlFileUploeaded)
// return url 
//**********************************//


/******* for test status code for a url  ********* */  
// testUrlFile function
// testUrlFile(url)
// return number (status code)
/**************************************************** */

  










// const browser = await puppeteer.launch();
// const context = await browser.createIncognitoBrowserContext();
// const page = await context.newPage();
  
//lance incognito page
// const browser = await puppeteer.launch({
//     args: [
//       '--incognito',
//     ],
//   });

let browser = null;
// let context = null;

let lanchBrowser = async () => {
    let launchOptions = { headless: false, args: ['--start-maximized','--incognito'] };
    // let launchOptions = {headless: false, args: ['--incognito'] };
    // let launchOptions = {};
     browser =  await puppeteer.launch(launchOptions);
    //  context = await browser.createIncognitoBrowserContext();
    // return context
    // return await browser.createIncognitoBrowserContext();
    return browser
}

// browser = lanchBrowser();
//  context = lanchBrowser()
// lanchBrowser()


const renaimFile = async (newPath,oldPath,url,callback) => {

    //check if file existe in file folder
    // await fs.access(newPath, fs.F_OK, async (err) => {
    //     return await callback(url,newPath)
    //   })


    // destination.txt will be created or overwritten by default.
    // await fs.copyFile(oldPath, newPath, async (err) => {
    //     if (err) throw err;
    //     return await callback(url,newPath)
    // });
    // fs.rename(oldPath,newPath, function (err) {
    //     if (err) throw err;
    //     console.log('File Renamed.');
    //     return callback(url,newPath)
    //   });

  try {
      await fs.copyFile(oldPath,newPath)
      console.log('lance uploade')
      await uploade(url, newPath)
      console.log('end uploade')
  } catch (error) {
      console.log(error)
  }
    
}


const testUrlFile = async (urlToWatch,browser) => {
    // const page = await context.newPage();
    try {
        let context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();
        // set viewport and user agent (just in case for nice viewing)
        await page.setViewport({width: 1366, height: 768});
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

        // open the webe page for uploade file
        const responce = await page.goto(urlToWatch, {
            timeout: 80000,
            waitUntil: 'networkidle2'
        });
        const responceCode = responce.status()
        await page.close()
        await context.close()
        return responceCode

    } catch ( error) {
        return 000
    }
    
     
}


const sendRequist = async (url) => {
    try {
        let response = await axios.get(url,{
            timeout: 60000
        })
        let responsestatus = response.status ? response.status : 000
        return responsestatus
       
    } catch (error) { 
        let errorResponse = error.response.status ? error.response.status : 001
        return errorResponse
    }
}









const testAndUploade = async (arrayLinks) => {         
    // let browser = await lanchBrowser(); 
    let i = arrayLinks.length
    while (i>0) {
        const {url,fileNewName,localeFile,name,urlToWatch} = arrayLinks[i - 1];
        try {
            let response = await sendRequist(urlToWatch);
        // let response = await testUrlFile(urlToWatch,browser);
            console.log(name,response)
            // if(response === 404) { await renaimFile(fileNewName,localeFile,url)}
            if(response === 404) { 
                await uploade(url, localeFile)
                await updateFileText('liens.txt', urlToWatch)
            }
            
            console.log(i)
            i = i - 1
        } catch (error) {
            i = i - 1
        }
    }

    if(i===0) testAndUploade(arrayLinks)
}



const updateFileText = async (path,text) => {
    try {
        await  fs.appendFile(path, `\n${text}`)

    } catch (error) {
        console.log('error in writhing file')
    }
}



 

  testAndUploade(firstPage)
 testAndUploade(secondPage)
testAndUploade(tirdpage)
 testAndUploade(pageFour)
testAndUploade(lastpage)
testAndUploade(pagesix)
testAndUploade(pagesetp)    
// testAndUploade(eightpage)

    
 //testAndUploade(trash)
 //  testAndUploade(mesLiens) 

  
const risterat =  () => { 
    setInterval((function() {
     console.log('I\'m Batman!');
    return testAndUploade(firstPage) 
    }),  1000);
}



process.on('bef', () => {
    return risterat();
})


