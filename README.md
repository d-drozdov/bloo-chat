[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7690474&assignment_repo_type=AssignmentRepo)

----This project was created as part of the class Full Stack Java Script at Johns Hopkins----

Bloo Chat!

A simple realtime messaging application build with Node, Express, and Socket.io.

After cloning the application, run `npm install` to install the dependencies. 

To run the application, use the command `npm run dev`.

Detailed instructions are at this [url](https://cs280spring.github.io/hw/hw5/index.html).

My application is deployed on [Heroku](https://bloo-chat-ddrozdo1.herokuapp.com/).


High-Level Explantion:

This app has has a client and server side, the idea being that the client can pass commands to server and vice-versa. 

index.js serves as the control center or "main" as this where page routing can occur, the database connects, imports happen, and where I inidicate which routes to use. There are two scripts within the assets folder, one for the login screen and another for the chatroom. The login screen does not make any connections to the socket however, it does handle registration and verificaiton of user using the `/register` and `/authenticate` endpoints from `auth.js` within the routes folder. The chatroom script on the other hand does handle connections to the socket using the `.on` and `.emit `functions. Additionally, upon loading it uses the `/verify `endpoint from the `auth.js` to make sure the client has a valid token, if not they get redirected to the homepage. 

In terms of templating, I have `parent.njk` file which contains the html for the header and has two blocks, one for the body and another for the scipt. `index.njk` and `chatroom.njk` both extend parent and add in the required html into the template blockes.

Additionally, for code modularity and to improved readability all server-side socket functions/controls have been moved into the module: `socket.js` within the services folder.

Please note there are 2 users in the database: Emily and Daniel are the usernames, the password are pass.
