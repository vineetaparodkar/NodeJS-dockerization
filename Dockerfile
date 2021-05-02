# FROM node --> defacto image.Use this image if you are unsure about what your needs are 
# FROM node:12-alpine -->Use this image for smaller image size
# FROM node:12-slim -->Use this image if there are space constraints & require only node minimal packages
FROM node:12-slim

# set node environment, either development or production
# defaults to production, overrides this to development on build using build-arg
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# set port as environment variable override using build-arg
ARG PORT=3001
ENV SERVER_PORT $PORT
EXPOSE $PORT 3001

# use latest npm regardless of node version for speed and fixes
RUN npm i npm@latest -g

# install dependencies for node app in a different location so it would be easier to bind volume for local development
# create the dir with root and change permissions
RUN mkdir /opt/app && chown node:node /opt/app
WORKDIR /opt/app

# Activate unpreviledged user node & then install dependencies 
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node
COPY --chown=node:node package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/app/node_modules/.bin:$PATH

# copy source code
WORKDIR /opt/app/sample_node_app
COPY --chown=node:node . .

# start the node js app
CMD [ "npm", "start" ]