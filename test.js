var ProtoPost = require("./ProtoPost.js");

var api = new ProtoPost({
  echo: (data) => data,
  ping: (data) => Date.now(),
  one: (data) => 1,
  add: (data) => data[0] + data[1],
  promise: async (data) => await new Promise((res, rej) => setTimeout(() => res(""), 1000)),
  test: new ProtoPost({
    foo: (data) => "foo",
    bar: (data) => "bar",
  }),
  errors: new ProtoPost({
    "your-fault": (data) => new Error("your fault"),
    "my-fault": (data) => {throw Error("my fault")},
  }),
}, (data) => "welcome to the api!");

api.start(3000, "/api");

//alternatively, you can use your own express instance:
// var app = express();
// app.use("/api", api.router);
// app.listen(3000, () => console.log("Listening on port 3000!"));

//testing client:
(async () => {
  var protopostClient = ProtoPost.client;
  var time = await protopostClient("http://127.0.0.1:3000/api/ping");
  console.log(`The time is now ${new Date(time).toLocaleString()}`);
  var wait = await protopostClient("http://127.0.0.1:3000/api/promise");
  console.log("Hey that took a while!");
})();

//using the "symbol" client
var root = ProtoPost.symbol("http://127.0.0.1:3000/api");
var one = root.symbol("/one");
var add = root.symbol("/add");

(async () => {
  var a = await one();
  var b = await one();
  var c = await add([a, b]);
  console.log(a, "+", b, "=", c);
})();
