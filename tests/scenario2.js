// chromedriver reference: https://www.npmjs.com/package/chromedriver#running-with-selenium-webdriver
require('chromedriver')
const { Builder, By, Key, until } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')
const CompleteOrder = require('../page-objects/complete-order');
  
const chromeOptions = new Options()

chromeOptions.addArguments('--no-sandbox')
chromeOptions.addArguments('--disable-gpu')
chromeOptions.addArguments('--disable-dev-shm-usage')
chromeOptions.windowSize({ width: 1920, height: 1080 })

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions)
  .build()

  let waitForPageLoad = async (time=3000) => {
    driver.sleep(time)
    driver.wait(() => {
      return driver.executeScript('return document.readyState').then(state => {
        return state === 'complete'
      })
    }, 120000)
}  

    let main = async() => {
    try {      
      
      //Adopt Brooke, add a Chewy Toy and a Travel Carrier, pay with Check
      
      await driver.get(`http://puppies.herokuapp.com/`);
      await waitForPageLoad(5000);

      await (await driver.wait(until.elementLocated(By.xpath(`//form[@action='/puppies/4']//input[@type='submit']`)))).click();
      await waitForPageLoad();
      await (await driver.wait(until.elementLocated(By.xpath(`//input [@type='submit']`)))).click();
      await waitForPageLoad();
      await (await driver.wait(until.elementLocated(By.xpath(`//input [@id='carrier']`)))).click();
      await (await driver.wait(until.elementLocated(By.xpath(`//input [@id='toy']`)))).click();
      await (await driver.wait(until.elementLocated(By.xpath(`//input [@type='submit'][@value='Complete the Adoption']`)))).click();
      await waitForPageLoad();
      
      await CompleteOrder.submit(driver, name='Terence', address='Philippines', email='test@test.com', payType='Check');
      
      await waitForPageLoad();
      await (await driver.wait(until.elementLocated(By.xpath(`//div[@id='content']//p[@id='notice']`))));
      let noticeMessage = (await (await driver).findElement(By.xpath(`//div[@id='content']//p[@id='notice']`))).getText();
      console.log("message is " + (await noticeMessage).toString());
      
    } finally {
      await driver.quit()
    }
  }
main();

