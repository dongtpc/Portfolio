// chromedriver reference: https://www.npmjs.com/package/chromedriver#running-with-selenium-webdriver
require('chromedriver')
const { Builder, By, Key, until } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')

  
const chromeOptions = new Options()

chromeOptions.addArguments('--no-sandbox')
chromeOptions.addArguments('--disable-gpu')
chromeOptions.addArguments('--disable-dev-shm-usage')
chromeOptions.windowSize({ width: 1024, height: 768 })
chromeOptions.windowSize({ width: 1920, height: 1080 })

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions)
  .build()
  
let waitForPageLoad = async (time=3000) => {
  await driver.sleep(time)
  await driver.wait(() => {
    return driver.executeScript('return document.readyState').then(state => {
      return state === 'complete'
    })
  }, 120000)
}

function Dog(name, detail) {
  this.name = name;
  this.detail = detail;
}
var allDogs = [];

let addCurrentPageDogs = async () => {
  names = (await (await driver).findElements(By.xpath(`//div[@class='name']`)));
  details = (await (await driver).findElements(By.xpath(`//div[@class='details']`)));
  for (let i = 0; i<names.length; i++){
    var name = names[i].getText();
    var detail = details[i].getText();
    await allDogs.push(new Dog((await name).toString(), (await detail).toString()));
  }
}

  
let main = async() => {
  try {      
    
    //Return a list of names of each puppy and their breed
    
    await driver.get(`http://puppies.herokuapp.com/`);
    await waitForPageLoad();

    await addCurrentPageDogs();

    await (await driver.wait(until.elementLocated(By.xpath(`//div [@class="pagination"]//a [@class="next_page"]`)))).click();
    await waitForPageLoad();

    await addCurrentPageDogs();

    await (await driver.wait(until.elementLocated(By.xpath(`//div [@class="pagination"]//a [@class="next_page"]`)))).click();
    await waitForPageLoad();

    await addCurrentPageDogs();

    for (let here of allDogs){
      await console.log ("DOG NAME " + here.name + " DOG DETAIL " + here.detail)
    }
      

  } finally {
    await driver.quit()
  }
}

main();
