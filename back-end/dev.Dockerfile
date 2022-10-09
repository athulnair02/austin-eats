FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

# TO BUILD: docker build -t flask-docker-dev -f dev.Dockerfile .
# TO RUN: docker run -it -v `pwd`:/usr/back-end -w /usr/back-end -p 5000:5000 flask-docker-dev

RUN apt-get clean && apt-get update -y
RUN apt-get install -y python3
RUN apt-get install -y python3-pip python3-dev build-essential vim

RUN apt-get install -y postgresql

COPY . usr/src/back-end
COPY requirements.txt usr/src/back-end/requirements.txt

WORKDIR /usr/src/back-end

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

EXPOSE 5000

CMD ["python3", "app.py"]
