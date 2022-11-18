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

    print("Running Navbar Tests...")
    os.system("python3 ./gui_tests/navbarTests.py " + PATH)

    print("Running Element Tests...")
    os.system("python3 ./gui_tests/elementTests.py " + PATH)

    print("Running Search Tests...")
    os.system("python3 ./gui_tests/searchTests.py " + PATH)

    print("Running Filter Tests...")
    os.system("python3 ./gui_tests/filterTests.py " + PATH)
