#!/bin/bash
id=`ps aux | grep httpsServer.js | grep -v grep | awk '{print $2}'`
if [ -z $id ]; then 
    /usr/bin/nodejs /home/l6104400/hungry_bee_backend/httpsServer.js &
    currentTime=`date`
    echo "Server Restart On $currentTime" >> /home/l6104400/hungry_bee_backend/server.log
fi
