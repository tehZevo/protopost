var express = require("express");
var fetch = require("node-fetch");
var cors = require("cors");

class ProtoPost
{
  constructor(routes={}, cb, get=false)
  {
    this.router = express.Router();
    //allow non-arrays/objects
    this.router.use(express.json({strict: false, limit: "5mb"}));
    this.get = get;

    if(typeof routes === "function")
    {
      cb = routes;
    }

    if(cb != null)
    {
      this.add("", cb);
    }
    console.log(cb, get)

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

    var method = this.get ? this.router.get : this.router.post;
    //I LOVE JAVASCRIPT I LOVE JAVASCRIPT
    method = method.bind(this.router)

    method("/" + name, async (req, res) =>
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
    app.use(cors());
    app.use(route, this.router);
    app.listen(port, () => console.log(`Listening on port ${port}!`));

    this.app = app;
  }

  //TODO: add stop lol
}

//this will be deprecated and replaced with symbol
async function protopostClient(url, data={}, get=false)
{
  var options = {
    method: get ? "GET" : "POST",
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }

  return fetch(url, options).then((res) =>
  {
    //catch non-ok statuses
    if(!res.ok)
    {
      throw new Error(`Status ${res.status} from ${url}`)
    }

    return res.json();
  });
}


ProtoPost.client = protopostClient;

module.exports = ProtoPost;
