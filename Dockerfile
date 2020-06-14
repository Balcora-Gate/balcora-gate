FROM node:13

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .eslintrc.js ./
COPY vue.config.js ./
COPY postcss.config.js ./
COPY api/package*.json ./api/
COPY api/.eslintrc.json ./api/
COPY api/tsconfig.json ./api/
COPY api/gulpfile.js ./api/
COPY api/server.cert ./api/
COPY api/server.key ./api/

RUN chown -R node:node /app
RUN chmod 755 /app
USER node

RUN npm install
RUN npm --prefix ./api install

COPY --chown=node:node . .

RUN npm run build

CMD [ "npm", "run", "serve" ]