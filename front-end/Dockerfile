# dockerfile built from [UniverCity](https://gitlab.com/coleweinman/swe-college-project/-/blob/main/frontend/Dockerfile)

FROM node:16.17

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

USER root

RUN apt-get update 



RUN npm install

EXPOSE 3000

COPY . ./

CMD ["npm", "start"]
