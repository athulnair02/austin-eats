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

    os.system("echo Running Navbar Tests...")
    os.system("python3 ./gui_tests/navbarTests.py " + PATH)

    os.system("echo Running Element Tests...")
    os.system("python3 ./gui_tests/elementTests.py " + PATH)

    os.system("echo Running Search Tests...")
    os.system("python3 ./gui_tests/searchTests.py " + PATH)

    os.system("echo Running Filter Tests...")
    os.system("python3 ./gui_tests/filterTests.py " + PATH)
