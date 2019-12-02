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
var express = require("express");
var app = express();

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
var protopost = require("protopost.js").client;

(async () =>
{
  var url = "http://localhost:3000/api";
  var result = await protopost(url, "/echo", {"Hello": "world!"});
  console.log(result) // { Hello: 'world!' }
})();
```

## TODO
* Allow removal of routes
