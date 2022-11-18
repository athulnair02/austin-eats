# TexasVotes code helped a lot with this

import os
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
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

        cls.driver = webdriver.Chrome(service=Service(PATH), options=ops)
        cls.driver.get(URL)

    # Close browser and quit after all tests
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def testGlobalSearch(self):
        self.driver.get(URL)
        self.driver.find_element(by=By.XPATH, value="/html/body/div/nav/div/div[2]/a[2]").click()

        assert self.driver.current_url == URL + "search/"

        searchTextField = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[2]/div/div/input")
        searchTextField.send_keys("tacos");

        self.driver.find_element(by=By.XPATH, value="/html/body/div/div[2]/div/div/div").click()

        try:
            a = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div/div[4]/div[1]/div[3]/b"))
            )
        except Exception as e:
            self.assertEqual(True, False)


        cardTitleText = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[4]/div[1]/div[3]/b").text

        assert cardTitleText == "Tacos"

    def testModelSearch(self):
        self.driver.get(URL + "restaurants/")

        searchTextField = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[2]/div/div/input")
        searchTextField.send_keys("Mary");

        self.driver.find_element(by=By.XPATH, value="/html/body/div/div[2]/div/div/div").click()

        try:
            a = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div/div[5]/div/button"))
            )
        except Exception as e:
            self.assertEqual(True, False)


        self.driver.find_element(by=By.XPATH, value="/html/body/div/div[5]/div/button").click()

        assert self.driver.current_url == URL + "restaurants/13"

    def testModelDeepSearch(self):
        self.driver.get(URL + "cultures/")

        searchTextField = self.driver.find_element(by=By.XPATH, value="/html/body/div/div[2]/div/div/input")
        searchTextField.send_keys("Ame");

        self.driver.find_element(by=By.XPATH, value="/html/body/div/div[2]/div/div/div").click()

        try:
            a = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div/div[5]/div[2]/button"))
            )
        except Exception as e:
            self.assertEqual(True, False)


        self.driver.find_element(by=By.XPATH, value="/html/body/div/div[5]/div[2]/button").click()

        assert self.driver.current_url == URL + "cultures/21"


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])
