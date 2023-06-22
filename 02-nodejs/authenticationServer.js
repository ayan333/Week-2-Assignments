/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,


  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const bodyParser = require("body-parser")
const PORT = 3000;
const app = express();
app.use(bodyParser.json())

users = [];
passwords = [];
last_unique_id = 0;
/*
1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup  */

const postSignUpData = (req, res)=>{
  const existing_username = users.find((u)=>(u.email ==req.body.email));
  if(existing_username){
    res.status(400).send("Username already exists.");
  }
  const new_user_obj = {
    unique_id : ++last_unique_id,
    email: req.body.email,
    firstName : req.body.firstName,
    lastName : req.body.lastName
  }
  users.push(new_user_obj);
  passwords.push(req.body.password);
  res.status(201).send("Signup successful");
}

const bValidUser = (username, pw)=>{
  const existing_user_idx  = users.findIndex((u)=>(u.email == username));
  if(existing_user_idx===-1){
    return -1;
  }
  else{
    if(passwords[existing_user_idx] !== pw){
      return -1;
    }
    else{
      return existing_user_idx;
    }
  }
}

/**   2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login
*/
const postLoginData = (req, res)=>{
  const idx = bValidUser(req.body.email, req.body.password);
  if( idx >= 0){
    res.status(200).json(users[idx]);
  }
  else{
    res.status(401).send("Unauthorized");
  }
}
/**  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data
 */
const getAllUserData = (req, res)=>{
  const idx = bValidUser(req.headers.email, req.headers.password);
  if( idx >= 0){
    res.status(200).json({"users":users});
  }
  else{
    res.status(401).send("Unauthorized");
  }
}

app.post('/signup', postSignUpData);
app.post('/login', postLoginData);
app.get('/data', getAllUserData);
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use((req, res, next)=>{
  res.status(404).send();
})

module.exports = app;
// app.listen(3000,()=>{
//   console.log('listening on 3000');
// })