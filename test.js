var ProtoPost = require("./ProtoPost.js");

var api = new ProtoPost({
  //callbacks take an object as input, and return a json-serializable object
  echo: (data) => data,
  ping: (data) => Date.now(),
  one: (data) => 1,
  add: (data) => data[0] + data[1],
  //supports async routes
  promise: async (data) => await new Promise((res, rej) => setTimeout(() => res(""), 1000)),
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
  get: new ProtoPost(
    () => "hello get"
  , get=true),
//the final argument to ProtoPost is an optional callback for "/"
}, (data) => "welcome to the api!");

//start the server using express on port 3000 at /api
api.start(3000, "/api");

//testing client:
var protopost = ProtoPost.client;
var HOST = "http://127.0.0.1:3000";

(async () => {
  var hello = await protopost(`${HOST}/api`);
  console.log(hello);
  var time = await protopost(`${HOST}/api/ping`);
  console.log(`The time is now ${new Date(time).toLocaleString()}`);
  var wait = await protopost(`${HOST}/api/promise`);
  console.log("Hey that took a while!");
  var get = await protopost(`${HOST}/api/get`, get=true);
  console.log(get);
})();
