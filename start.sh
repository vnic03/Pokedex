#!/bin/bash

cd backend || exit

node -r dotenv/config server.js &

sleep 3

cd - || exit

SERVER_PID=$!

cd frontend || exit

npm start &

FRONTEND_PID=$!

terminate() {
    echo "Terminating processes..."
    kill $SERVER_PID
    kill $FRONTEND_PID
    wait $SERVER_PID
    wait $FRONTEND_PID
}

trap terminate SIGINT SIGTERM

wait $SERVER_PID
wait $FRONTEND_PID
