#!/bin/sh
ps aux | grep httpsServer.js | grep -v grep | awk '{print $2}' | xargs kill -9
node /home/l6104400/hungry_bee_backend/httpsServer.js &
