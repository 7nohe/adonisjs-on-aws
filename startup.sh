#!/bin/sh

cd /app
node bin/console.js migration:run --force
node bin/server.js
