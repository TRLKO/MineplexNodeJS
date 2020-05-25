# Mineplex Node.js
Replacement for the unfinished php files. (this is still unfinished but at least there isn't errors)

## Archive notice
I am unable to work on this project anymore since I don't have the time. If you wish to continue development you can do so with forks.
<br />
Also, this code is very messy and uses a framework that isn't the fastest. If you want to rewrite it, use something like [fastify](github.com/fastify/fastify).

## Depends
* [Node.js](https://nodejs.org)
* MySQL database

### Things this doesn't handle
* Custom class builds
* Dominate (skills, items, classes)
* Pets
* If you want to count things for the 2014 source code, fishing and minekarts

## Running
* Edit the [config.yml](config.json) to match your database settings (Note: don't include your db's port on the host)
* Make sure your database is running
* Open up cmd prompt/terminal in the folder of the clone of this project
* Run ```npm install```
* After that is done installing the libraries run ```npm run production``` or ```node app.js```
* Change your webServer value in all config.yml files to be ```http://127.0.0.1:8080/``` or ```http://localhost:8080/``` **Add the "/" at the end or you will get an error!**
* You're all set!

## Chat filter
* Change ```chat_filter``` in [config.json](config.json) to be ```true```
* Add the words you want to be filtered in [chatfilter.json](chatfilter.json)
* Go into `mineplex.core.chat.Chat` and replace line ```58```(```_filterUrl```) to be `http://127.0.0.1:8080/content/item/moderate`
* Change line ```448``` to be ```HttpURLConnection connection = null;```
* Change line ```457``` to be ```connection = (HttpURLConnection) obj.openConnection();```

## Structure
### [/](/)
Main files such as the [license](LICENSE.md) and the actual [app][app.js] file.

### [/routes](/routes)
The [routers](https://expressjs.com/en/api.html#router) of all web requests Each file is a path (ex/ [PlayerAccount.js](/routes/PlayerAccount.js) refers to the /PlayerAccount/ path)

### [/functions](/functions)
The functions that are called in the routers. These are basically a bunch of functions w/ callbacks to make the code more readable & to allow expanding if anyone wants to make something like a front end for this.

## Authors
* OnlyJoking/randomdevlol - Main Contributor & Project Manager

## Contributing
Make a fork of this repository and contribe through there

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
