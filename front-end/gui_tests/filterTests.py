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

class TestElements(unittest.TestCase):

    # Get drivers and run website before all tests
    @classmethod
    def setUpClass(cls):
        ops = Options()
        ops.add_argument("--headless")
        ops.add_argument("--disable-gpu")
        ops.add_argument("--window-size=1280,800")
        ops.add_argument("--allow-insecure-localhost")
        ops.add_argument("--log-level=3")
        ops.add_argument("--no-sandbox")
        ops.add_argument("--disable-dev-shm-usage")

        cls.driver = webdriver.Chrome(PATH, options=ops)
        cls.driver.get(URL)

    # Close browser and quit after all tests
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def testRecipeDropdownFilter(self):
        self.driver.get(URL + "recipes/")
        self.driver.find_element(by=By.XPATH, value="/html/body/div/div[3]/div[1]/div/div").click()

        self.driver.find_element(by=By.XPATH, value="/html/body/div[2]/div[3]/ul/li[1]").click()

        try:
            a = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div/div[5]/div[1]/div[3]"))
            )
        except Exception as e:
            self.assertEqual(True, False)


        cardTitleText = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[5]/div[1]/div[3]").text

        assert cardTitleText == "Matcha Smoothie"

    def testCultureFilter(self):
        self.driver.get(URL + "cultures/")

        searchTextField = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[3]/div[2]/div/input")
        searchTextField.send_keys("47351568");

        self.driver.find_element(by=By.XPATH, value="/html/body/div/div[1]").click()

        try:
            a = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div/div[5]/div[2]/button"))
            )
        except Exception as e:
            self.assertEqual(True, False)


        self.driver.find_element(by=By.XPATH, value="/html/body/div/div[5]/div[2]/button").click()

        assert self.driver.current_url == URL + "cultures/5"


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])
