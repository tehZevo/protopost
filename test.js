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

app.listen(3000, () => console.log("Listening on port 3000!"));
