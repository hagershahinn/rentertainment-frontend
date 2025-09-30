# Rentertainment Frontend

React app for renting movies

## How to run

1. Clone this repo
2. npm install
3. npm start

Opens at localhost:3000

## What it does

- Browse movies
- Search movies
- See movie details
- Rent movies
- Shows top 5 movies
- Dark theme

## Backend

You need the backend running on localhost:3001 first

## Running both

Terminal 1:
cd rentertainment-backend
npm start

Terminal 2:
cd rentertainment-frontend
npm start

## Problems

Port 3000 busy: lsof -ti:3000 | xargs kill -9
Module errors: npm install
Movies not loading: backend not running
