const { Builder, By, Key, until, WebDriver } = require('selenium-webdriver')
var BasePage = require('./basepage');

class HomePage extends BasePage {
    clickOneDog() {
        this.driver.wait(until.elementLocated(By.xpath(`//form[@action='/puppies/4']//input[@type='submit']`))).click();
    }
}   

module.exports = new HomePage();