# ProtoPost
Quickly create POST-only REST APIs using Express routers.

## Usage
```js
var ProtoPost = require("protopost");
var express = require("express");
var app = express();

var api = new ProtoPost({
  //callback take an object as input, and return a json-serializable object
  echo: (data) => data,
  ping: (data) => Date.now(),
  //ProtoPost objects can be used in place of callbacks for a nested structure
  test: new ProtoPost({
    foo: (data) => "foo"},
    bar: (data) => "bar"},
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

## Notes
* Each route callback should take an object as input, and return an object
* Exceptions thrown within a callback will result in a 500 status
* Errors returned from the callback will result in a 400 status
* ProtoPost objects can be nested

## TODO
* Allow removal of routes
