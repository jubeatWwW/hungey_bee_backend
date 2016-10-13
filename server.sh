#!/bin/bash
while true;
do
    id=`ps aux | grep httpsServer.js | grep -v grep | awk '{print $2}'`
    sleep 30
    if [ -z $id ]; then 
        node /home/l6104400/hungry_bee_backend/httpsServer.js &
        currentTime=`date -u`
        echo "Server Restart On $currentTime" >> server.log
    fi
done
