# ProtoPost
Quickly create POST-only REST APIs using Express routers.

## Usage
```js
var ProtoPost = require("protopost");
var express = require("express");
var app = express();

var api = new ProtoPost({
  echo: (data) => data,
  ping: (data) => Date.now(),
  test: new ProtoPost({
    foo: (data) => {return {foo:"foo"}},
    bar: (data) => {return {bar:"bar"}},
  }),
  errors: new ProtoPost({
    "your-fault": (data) => new Error("your fault"),
    "my-fault": (data) => {throw Error("my fault")},
  }),
});

app.use("/api", api.router);

app.listen(3000, () => console.log("Listening on port 3000!"))
```

## Notes
* Each route callback should take an object as input, and return an object
* Exceptions thrown within a callback will result in a 500 status
* Errors returned from the callback will result in a 400 status
* ProtoPost objects can be nested

## TODO
* Allow ProtoPost root routes to have callbacks as well
