# Mineplex Node.js
Replacement for the unfinished php files.

## Depends
* [Node.js](https://nodejs.org)
* MySQL database

## Running
* Edit the [config.yml](config.json) to match your database settings (Note: don't include your db's port on the host)
* Make sure your database is running
* Open up cmd prompt/terminal in the folder of the clone of this project
* Run ```npm install```
* After that is done installing the libraries run ```npm run production``` or ```node app.js```
* Change your webServer value in all config.yml files to be ```http://127.0.0.1:8080/``` or ```http://localhost:8080/``` **Add the "/" at the end or you will get an error!**
* You're all set!

## Structure
### [/](/)
Main files such as the [license](LICENSE.md) and the actual [app][app.js] file.

### [/routes](/routes)
The [routers](https://expressjs.com/en/api.html#router) of all web requests
Each file is a path (ex/ [PlayerAccount.js](/routes/PlayerAccount.js) refers to the /PlayerAccount/ path)

### [/functions](/functions)
The functions that are called in the routers.
These are basically a bunch of functions w/ callbacks to make the code more readable & to allow expanding if anyone wants to make something like a front end for this.

### Todo
* Test Dominate Routes & Functions
* Pets Routes & Functions
* SaveCustomBuild

## Authors
* OnlyJoking/randomdevlol - Main Contributor & Project Manager

## Contributing
Contributions are greatly appriciated as I don't have the best free time to work on this project. If you would like to contribute code modifications, please open a pull request and I'll get back to it as fast as I can!

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details