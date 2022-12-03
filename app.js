var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var fs = require("fs");
const { response } = require("express");

app.get("/listUsers", function (req, res) {

  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {

    res.contentType("application/json");
    res.end(data);
    
  });

});

app.get("/getUserById/:id", function (req, res) {
  // First read existing users.
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    
    var users = JSON.parse(data);
    var user = users["user" + req.params.id];
    console.log(user);
    res.end(JSON.stringify(user));
  });
});

app.delete("/deleteUser/:id", function (req, res) {
  // First read existing users.
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, response) {
    let data = JSON.parse(response);
    delete data["user" + req.params.id];

    saveFile(data);
    res.end(JSON.stringify(data));
  });
});

app.get("/addUser", function (req, res) {
  res.sendFile(__dirname + "/" + "addUser.html");
});

app.post("/addUser", urlencodedParser, function (req, res) {
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    const count = Object.keys(data).length + 1;

    let response = {
      name: req.body.name,
      password: req.body.password,
      degree: req.body.degree,
      id: count,
    };

    data["user" + count] = response;
    saveFile(data);
    res.redirect('/listUsers');
  });
});

app.put("/updateUser/:id", urlencodedParser, function(req, res){
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    data = JSON.parse(data);

    let response = {
      name: req.body.name,
      password: req.body.password,
      degree: req.body.degree,   
      id: req.params.id 
    };

    data["user" + req.params.id] = response;
    saveFile(data);
    res.redirect("/listUsers");
  });
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});

function saveFile(data) {
  fs.writeFile(
    __dirname + "/" + "users.json",
    JSON.stringify(data),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );
}
