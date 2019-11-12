var ProtoPost = require("./ProtoPost.js");
var express = require("express");
var app = express();

var api = new ProtoPost({
  echo: (data) => data,
  ping: (data) => Date.now(),
  test: new ProtoPost({
    foo: (data) => "foo",
    bar: (data) => "bar",
  }),
  errors: new ProtoPost({
    "your-fault": (data) => new Error("your fault"),
    "my-fault": (data) => {throw Error("my fault")},
  }),
}, (data) => "welcome to the api!");

app.use("/api", api.router);

app.listen(3000, () => console.log("Listening on port 3000!"));
