# Project Name

> PwC Case Study

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## General Information

An app that allows users to display and filter with geospatial queries Orlen, Shell and BP gas/petrol stations in Poland.
Includes frontend, backend and scraper scripts.
App uses voivodeships and counties boundaries provided by [GIS Support](https://gis-support.pl/baza-wiedzy-2/dane-do-pobrania/granice-administracyjne/)

## Technologies Used

Frontend:

- React 18.2.0 (with creact-react-app)
- TypeScript
- ArcGIS Maps SDK for JavaScript 4.27.6
- Tailwind CSS 3.3.3
- Axios 1.4.0
- Reat-Hook-Form 7.45.2
- React-Loader-Spinner 5.3.4


Backend:

- Node.js
- TypeScript
- Express 4.18.2
- TypeORM 0.3.17
- Node-postgres 8.11.1
- TS-node 10.9.1
- Cors 2.8.5

Database:

- PostgreSQL 15.3.3
- PostGIS 3.3

Scraper:

- Axios 1.4.0

## Setup

Install [Node.js](https://nodejs.org/en/) (version at least 18.13.0)\
Install [Node Package Manager](https://www.npmjs.com/) (version at least 9.6.2)\
Install TypeScript globally - `npm install -g typescript`\
Install TS-node globally - `npm install -g ts-node`\
Install TypeORM globally = `npm install -g typeorm`\
Install [PostgreSQL](https://www.postgresql.org/download/) (version at least 15.3.3)
 - Create database with followning properties:
    * type: "postgres",
    * host: "localhost",
    * port: 5432,
    * username: "postgres",
    * password: "admin",
    * database: "poland_gas_stations",
    * schema: "public",
 - In Application Stack Builder install PostGIS extension (version at least 3.3)
 - Add PostGIS extensions to your database
 Open PostGIS Shapefile Import/Export Manager Application
 - Connect to your database
 - Download [voivodeships shapefile](https://www.gis-support.pl/downloads/2022/wojewodztwa.zip)
 - Download [counties shapefile](https://www.gis-support.pl/downloads/2022/powiaty.zip)
 - Add both files and click "Import"
Go to main folder (pwc-case-study):
- Install dependencies - `npm run install-all`


## Usage

Main application

In main folder (pwc-case-study):
- Start backend app - `npm run backend`
- In new terminal start frontend app - `npm run frontend`

Scraper

In main folder (pwc-case-study):
- Scrape Orlen stations - `npm run scrape-orlen`
- Scrape BP stations - `npm run scrape-bp`
- Scrape Shell stations - `npm run scrape-shell`

Note, that already scraped files exist for backend usage in backend/static










Nice to have:
-better validation on backend
-use typeorm query builder
-backend more and better types
-auth
-front better types
-front icons for stations
-labels for clusters
-front info about filter attributes (i.e bp is limited)
-front better UI/UX styling
-front loading spinner, loading functionality
-front block buttons when view is on move (like loading?)
