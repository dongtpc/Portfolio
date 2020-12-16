require('chromedriver')
const { Builder, By, Key, until, WebDriver } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')
  
const chromeOptions = new Options()

chromeOptions.addArguments('--no-sandbox')
chromeOptions.addArguments('--disable-gpu')
chromeOptions.addArguments('--disable-dev-shm-usage')
chromeOptions.windowSize({ width: 1920, height: 1080 })

 class BasePage {

    constructor(){
        this.driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build() 
    }   

    openWebsite(input){
        this.driver.get(input);
    }

    closeWebsite(){
        console.log("quit")
        this.driver.quit();
    }

    waitForPageLoad(time=3000){
        this.driver.sleep(time)
        this.driver.wait(() => {
          return this.driver.executeScript('return document.readyState').then(state => {
            return state === 'complete'
          })
        }, 120000)
    }  
    
}

module.exports = BasePage;