import os
from sys import platform

if __name__ == "__main__":
    if platform == "win32":
        PATH = "./gui_tests/chromedriver.exe"
    elif platform == "linux":
        PATH = "./gui_tests/chromedriver_linux"
    elif platform == "darwin":
        PATH = "./gui_tests/chromedriver"
    else:
        print("platform", platform)
        print("Unsupported OS")
        exit(-1)

    # os.system("python3 ./gui_tests/splashTests.py " + PATH)
    os.system("python3 ./gui_tests/navbarTests.py " + PATH)
    # os.system("python3 ./gui_tests/politiciansTests.py " + PATH)
    # os.system("python3 ./gui_tests/districtsTests.py " + PATH)
    # os.system("python3 ./gui_tests/electionsTests.py " + PATH)