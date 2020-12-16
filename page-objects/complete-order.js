require('chromedriver')
const { Builder, By, Key, until } = require('selenium-webdriver');
//var BasePage = require('../common/basepage');
// var driver = new Builder()
// .forBrowser('chrome')
// .build()

const order_name = "//input [@id='order_name']";
const order_address = "//textarea [@id='order_address']";
const order_email = "//input[@id='order_email']";
const order_pay_type = "//select[@id='order_pay_type']";
const order_commit = "//input[@name='commit']";

class CompleteOrder {

    setName(driver, name){
        driver.wait(until.elementLocated(By.xpath(`//input [@id='order_name']`))).sendKeys(name);
    }
    submit(driver, name, address, email, payType){
        //driver.wait(until.elementLocated(By.xpath(`${order_name}`))).sendKeys(name);
        this.setName(driver, name);
        driver.sleep(5000);
        driver.wait(until.elementLocated(By.xpath(`${order_address}`))).sendKeys(address);
        driver.wait(until.elementLocated(By.xpath(`${order_email}`))).sendKeys(email);
        driver.wait(until.elementLocated(By.xpath(`${order_pay_type}`))).sendKeys(payType);
        driver.wait(until.elementLocated(By.xpath(`${order_commit}`))).click();
    }
}
module.exports = new CompleteOrder();
