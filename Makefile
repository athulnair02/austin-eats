# sourced from Texas Votes: https://gitlab.com/forbesye/fitsbits/-/tree/c8bbdbbcee676cb57f7533beb84f47de784289de/

front-update:
	cd front-end/ && npm install

front-start:
	cd front-end/ && npm start

front-build:
	cd front-end/ && npm build

back-dev:
	cd back-end/ && python3 -m flask run

back-end-tests:
	echo "Running unittests and Postman test suite..."
	python3 back-end/unittests.py -v

front-end-tests:
	echo "Running Mocha and Selenium test suite..."
	cd front-end/ && python3 guitests.py
	cd ./front-end/gui_tests/ && chmod +x chromedriver_linux
	cd ./front-end/ && python3 guitests.py
