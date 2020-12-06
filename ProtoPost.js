var express = require("express");
var fetch = require("node-fetch");

class ProtoPost
{
  constructor(routes={}, cb)
  {
    this.router = express.Router();
    //allow non-arrays/objects
    this.router.use(express.json({strict: false}));

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

    this.router.post("/" + name, async (req, res) =>
    {
      try
      {
        var val = await cb(req.body);

        if(val instanceof Error)
        {
          res.status(400).send(val.message);
          return;
        }

        //catch functions that have no return value, replace results with null
        if(val == null)
        {
          val = null;
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

//TODO: sanitize url function?

//this will be deprecated and replaced with symbol
async function protopostClient(url, route="", data={})
{
  var options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }

  return fetch(url + route, options).then((res) =>
  {
    //catch non-ok statuses
    if(!res.ok)
    {
      throw new Error(`Status ${res.status} from ${url+route}`)
    }

    return res.json();
  });
}

//this will eventually replace protopostClient
function protopostClientSymbol(url)
{
  var func = async (data=null, route="") => await protopostClient(url, route, data);
  func.url = url
  func.symbol = (path) => protopostClientSymbol(func.url + path);

  return func
}

ProtoPost.client = protopostClient;
ProtoPost.symbol = protopostClientSymbol;

module.exports = ProtoPost;
