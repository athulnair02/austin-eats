FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

# TO BUILD: docker build -t flask-docker .
# TO RUN: docker run -it -v `pwd`:/usr/back-end -w /usr/back-end -p 5000:5000 flask-docker

RUN apt-get update -y
RUN apt-get install -y python3
RUN apt-get install -y python3-pip python3-dev build-essential vim
RUN apt-get install -y nginx

RUN apt-get install -y postgresql

COPY . usr/src/back-end
COPY requirements.txt usr/src/back-end/requirements.txt

WORKDIR /usr/src/back-end

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

ENV FLASK_APP="server.py"

EXPOSE 5000

CMD ["python3", "app.py"]
