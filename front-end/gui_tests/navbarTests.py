# TexasVotes code helped a lot with this

import os
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sys

PATH = "./gui_tests/chromedriver"
URL = "https://www.austineats.me/"

class TestNavbar(unittest.TestCase):

    # Get drivers and run website before all tests
    @classmethod
    def setUpClass(cls):
        print("PWD", os.getcwd())
        # chrome_options = Options()
        # chrome_options.add_argument("--headless")
        ops = Options()
        ops.add_argument("--headless")
        ops.add_argument("--disable-gpu")
        ops.add_argument("--window-size=1280,800")
        ops.add_argument("--allow-insecure-localhost")
        ops.add_argument("--log-level=3")
        ops.add_argument("--no-sandbox")
        ops.add_argument("--disable-dev-shm-usage")

        # caps = DesiredCapabilities().CHROME
        # caps["pageLoadStrategy"] = "eager"
        # cls.driver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options, desired_capabilities=caps)
        # cls.driver = webdriver.Remote(command_executor='http://selenium__standalone-chrome:4444/wd/hub', options=chrome_options, desired_capabilities=caps)
        cls.driver = webdriver.Chrome(PATH, options=ops)
        cls.driver.get(URL)

    # Close browser and quit after all tests
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def testNavRestaurants(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[1]/a[1]").click()
        assert self.driver.current_url == URL + "restaurants/"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testNavRecipes(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[1]/a[2]").click()
        assert self.driver.current_url == URL + "recipes/"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testNavCultures(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[1]/a[3]").click()
        assert self.driver.current_url == URL + "cultures/"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testNavAbout(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[2]/a[1]").click()
        assert self.driver.current_url == URL + "about/"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testNavLogo(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/a[1]").click()
        assert self.driver.current_url == URL

    def testNavName(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/a[2]").click()
        assert self.driver.current_url == URL

    def testAboutDataSourceElement(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[2]/a[1]").click()
        assert self.driver.current_url == URL + "about/"

        headerText = self.driver.find_element(by=By.XPATH, value="/html/body/div/div/h1[4]").text

        assert headerText == "Data Sources"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testCulturesHeadingElement(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[1]/a[3]").click()
        assert self.driver.current_url == URL + "cultures/"

        headerText = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[1]").text

        assert headerText == "Cultures"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testRecipesHeadingElement(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[1]/a[2]").click()
        assert self.driver.current_url == URL + "recipes/"

        headerText = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[1]").text

        assert headerText == "Recipes"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testRestaurantsHeadingElement(self):
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[1]/a[1]").click()
        assert self.driver.current_url == URL + "restaurants/"

        headerText = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[1]").text

        assert headerText == "Restaurants"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])
