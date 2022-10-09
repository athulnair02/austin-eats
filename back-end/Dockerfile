FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

# TO BUILD: docker build -t flask-docker .
# TO RUN: docker run -it -v `pwd`:/usr/back-end -w /usr/back-end -p 80:80 flask-docker

RUN apt-get update -y
RUN apt-get install -y python3
RUN apt-get install -y python3-pip python3-dev build-essential vim
RUN apt-get install -y nginx

COPY . usr/src/backend
COPY requirements.txt usr/src/backend/requirements.txt

WORKDIR /usr/src/backend

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

EXPOSE 80

COPY nginx.conf /etc/nginx
RUN chmod +x ./start.sh
CMD ["./start.sh"]
