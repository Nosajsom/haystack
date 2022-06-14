#!/bin/bash

# This script creates the distribution build in `./dist`
# by concatenating the following files:
# - vendor.js (contains react, and react-dom)
# - client.min.js (UMD build of chat client)
# - bootstrap.js (code snippet that allows the chat client to easily be initialized / destroyed)
mkdir -p dist
cat ./vendor/vendor.js ./umd/client.min.js ./src/bootstrap.js > ./dist/onlea-chat.min.js
nwb -c nwb.config.379.js build-react-app demo/src/379/index.js demo/dist/379
nwb -c nwb.config.297.js build-react-app demo/src/297/index.js demo/dist/297
nwb -c nwb.config.area_demo.js build-react-app demo/src/area_demo/index.js demo/dist/area_demo
echo "bundle complete"