FROM node:lts-alpine
ENV NODE_ENV=production
ENV MONGODB_URI=${MONGODB_URI}
ENV PORT=3000
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE $PORT
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
