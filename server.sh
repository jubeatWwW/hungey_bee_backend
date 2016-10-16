#!/bin/bash
while true;
do
    id=`ps aux | grep httpsServer.js | grep -v grep | head -n 1 | awk '{print $2}'`
    if [ -z $id ]; then 
        node /home/l6104400/hungry_bee_backend/httpsServer.js &
        currentTime=`date`
        echo "Server Restart On $currentTime" >> server.log
    fi
    sleep 30
done
