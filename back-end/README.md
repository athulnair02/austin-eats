To build the docker image, cd into the back-end directory (where this README is) and run this command:

Linux:

    sudo docker build --tag flask-docker .

Windows:

    docker build --tag flask-docker .

Note that the name "flask-docker" can be anything and was chosen arbitrarilly.

To run the created docker image after building, run this command:
Linux:

    docker run -it -v `pwd`:/usr/backend -w /usr/backend flask-docker

Windows:

    docker run -it -v ${pwd}:/usr/backend -w /usr/backend flask-docker

Note that "flask-docker" must be the same as whatever was put after the "--tag" in the build command above.

Note, also, that this does not run docker in a form that allows you to access the flask api locally (in your browser) and it is not set up for AWS.

This should put you in the directory "/usr/backend". All the files present in the back-end directory of the repo (/fitsbits/back-end) should exist in "/usr/backend" in docker.

If you want to change the name of the directory that Docker puts you into, change both "/usr/backend" names in the run command. Changing just one or the other does not properly change the directory name in Docker.

In order to run the docker image in such a way that you can access the api locally in your browser (without AWS), run the command:

    docker run -it -v `pwd`:/usr/backend -w /usr/backend -p 5000:5000 flask-docker

Note that 5000 is the port the api is being run on in docker and the second 5000 is the port the app will be available on for your local browser (which is not in docker).

In order to access the api locally from outside of docker, you will also need to make sure it is running on "0.0.0.0". This can be done by running:

    python3 app.py

The api is coded to run on 0.0.0.0 when you run main. If you run it through flask, you will need to specify "--host=0.0.0.0" when calling "flask run".

