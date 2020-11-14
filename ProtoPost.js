var express = require("express");
var fetch = require("node-fetch");

class ProtoPost
{
  constructor(routes={}, cb)
  {
    this.router = express.Router();
    this.router.use(express.json());

    if(cb != null)
    {
      this.add("", cb);
    }

    this.addAll(routes);
  }

  addAll(routes)
  {
    for(var [name, cb] of Object.entries(routes))
    {
      this.add(name, cb);
    }
  }

  add(name, cb)
  {
    if(cb instanceof this.constructor)
    {
      this.router.use("/" + name, cb.router);
      return;
    }

    this.router.post("/" + name, (req, res) =>
    {
      try
      {
        var val = cb(req.body);
        if(val instanceof Error)
        {
          res.status(400).send(val.message);
          return;
        }

        res.json(val);
      }
      catch(err)
      {
        console.error(err);
        res.sendStatus(500);
      }
    });
  }

  remove(name)
  {
    //TODO
  }

  //just starts express on port 80 by default and routes from /
  start(port=80, route="/")
  {
    var app = express();
    app.use(route, this.router);
    app.listen(port, () => console.log(`Listening on port ${port}!`));

    this.app = app;
  }

  //TODO: add stop lol
}

async function protopostClient(url, route, data)
{
  var options = {
    method: "POST",
    //uri: url + route,
    body: data,
    //json: true,
    headers: { 'Content-Type': 'application/json' },
  }

  return fetch(url + route, options).then((res) => res.json());
}

ProtoPost.client = protopostClient;

module.exports = ProtoPost;
