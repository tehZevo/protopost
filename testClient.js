var protopost = require("./ProtoPost.js").client;

(async () =>
{
  var url = "http://localhost:3000/api";
  var result = await protopost(url, "/echo", {"Hello": "world!"});
  console.log(result)
})();
