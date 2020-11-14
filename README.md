# ProtoPost
Quickly create POST-only REST APIs using Express routers.

## Installation
```shell
npm install https://github.com/tehzevo/protopost
```

## Usage
### Server
```js
var ProtoPost = require("protopost");

var api = new ProtoPost({
  //callbacks take an object as input, and return a json-serializable object
  echo: (data) => data,
  ping: (data) => Date.now(),
  //ProtoPost objects can be used in place of callbacks for a nested structure
  test: new ProtoPost({
    foo: (data) => "foo",
    bar: (data) => "bar",
  }),
  errors: new ProtoPost({
    //errors returned result in http status 400
    "your-fault": (data) => new Error("your fault"),
    //errors thrown result in http status 500
    "my-fault": (data) => {throw Error("my fault")},
  }),
//the final argument to ProtoPost is an optional callback for "/"
}, (data) => "welcome to the api!");

//start the server using express on port 3000 at /api
api.start(3000, "/api");

//or, if you want to use your own express instance instead of .start()
var express = require("express");
var app = express();
app.use("/api", api.router);
app.listen(3000, () => console.log("Listening on port 3000!"))
```

This will create an api with the following POST routes:
```shell
/api                    # "welcome to the api!"
/api/echo               # echos back the json sent
/api/ping               # gives the current time
/api/test/foo           # "foo"
/api/test/bar           # "bar"
/api/errors/your-fault  # returns an error 400
/api/errors/my-fault    # returns an error 500
```

### Client
```js
var protopost = require("protopost").client;

(async () => {
  var protopost = ProtoPost.client;
  var hello = await protopost("http://127.0.0.1:3000", "/api");
  console.log(hello);
  var time = await protopost("http://127.0.0.1:3000", "/api/ping");
  console.log(`The time is now ${new Date(time).toLocaleString()}`);
})();
```

## TODO
* Allow removal of routes
