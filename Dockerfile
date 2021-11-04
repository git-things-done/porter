FROM node:16-alpine
COPY dist dist
RUN apk add git
ENTRYPOINT [ "node", "--enable-source-maps", "/dist/index.js" ]
