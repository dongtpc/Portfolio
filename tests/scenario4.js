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

  
function Dog(name, detail) {
  this.name = name;
  this.detail = detail;
}
var allDogs = [];

let waitForPageLoad = async (time=3000) => {
  await driver.sleep(time)
  await driver.wait(() => {
    return driver.executeScript('return document.readyState').then(state => {
      return state === 'complete'
    })
  }, 120000)
}  

let addCurrentPageDogs = async () => {
  names = (await (await driver).findElements(By.xpath(`//div[@class='name']`)));
  details = (await (await driver).findElements(By.xpath(`//div[@class='details']`)));
  for (let i = 0; i<names.length; i++){
    var name = names[i].getText();
    var detail = details[i].getText();
    //await console.log ("dog name " + (await name).toString() + " dog detail " + (await detail).toString())
    await allDogs.push(new Dog((await name).toString(), (await detail).toString()));
  }
  
}

let getAllDogs = async () => {
  var nextPageExist = true;
  while(nextPageExist == true){
    try{
      await addCurrentPageDogs();
      await (await (await driver).findElement(By.xpath(`//div [@class="pagination"]//a [@class="next_page"]`))).click();
    } catch(e){
      nextPageExist = false;
      break;}
  }
}

let dogFound = async (number) => {
  try {
    var existed = false;
    existed = await driver.findElement(By.xpath(`//form[@action='/puppies/${number}']//input[@type='submit']`)).then(function() {
     return true;//it existed
    })
  }catch(e){
    existed = false;
  }
return existed;

}

let adoptRandomDog = async (number) => {
  var complete = false;
        while (!complete)
        {
          var dogCheck = await dogFound(number);
          console.log("dogCheck: " + dogCheck);
          if (dogCheck === true)
          {
              await (await driver.wait(until.elementLocated(By.xpath(`//form[@action='/puppies/${number}']//input[@type='submit']`)))).click()
              await (await driver.wait(until.elementLocated(By.xpath(`//input [@type='submit']`)))).click();
              await waitForPageLoad();         
              complete = true;
            }
            else {
              await (await driver.wait(until.elementLocated(By.xpath(`//div [@class="pagination"]//a [@class="next_page"]`)))).click();  
              complete = false;
            }
          
        }
}
    
    let main = async() => {
    try {      
      
      //Adopt 2 Random puppies add a Collar & Leash to each, pay with Credit Card
      
      await driver.get(`http://puppies.herokuapp.com/`);
      await waitForPageLoad();

      await getAllDogs();
      var randomitem = allDogs[Math.floor(Math.random()*allDogs.length)];
      //await console.log ("RANDOM DOG NAME " + randomitem.name + " DOG DETAIL " + randomitem.detail)

      await (await driver.wait(until.elementLocated(By.xpath(`//ul [@id='navlist']//a [@href='/']`)))).click();
      await waitForPageLoad();

      var randomNumber = Math.floor(Math.random()*allDogs.length)+1;
      var randomNumber = await Math.floor(Math.random()*8)+1;
      await console.log ("random number is " + randomNumber);
      await adoptRandomDog(randomNumber);
      await (await driver.wait(until.elementLocated(By.xpath(`//input [@type='submit'][@value='Adopt Another Puppy']`)))).click();

      var randomNumber = await Math.floor(Math.random()*8)+1;
      await console.log ("random number is " + randomNumber);
      await adoptRandomDog(randomNumber);
      await (await driver.wait(until.elementLocated(By.xpath(`//tr[3]/td[2]//input`)))).click();
      await (await driver.wait(until.elementLocated(By.xpath(`//tr[9]/td[2]//input`)))).click();
      await (await driver).sleep(5000)
      await (await driver.wait(until.elementLocated(By.xpath(`//input [@type='submit'][@value='Complete the Adoption']`)))).click();
      await waitForPageLoad();
      
      await CompleteOrder.submit(driver, name='Terence', address='Philippines', email='test@test.com', payType='Check');
      await waitForPageLoad();
      
    } finally {
      
      await driver.quit()
      
    }
  }
main();
