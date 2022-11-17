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

front-jest-tests:
	echo "Running Jest test suite..."
	cd front-end/ && npm test --silent

front-acceptance-tests:
	echo "Running Selenium test suite..."
	cd front-end/ && python3 guitests.py