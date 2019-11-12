var express = require("express");

module.exports = class ProtoPost
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
        res.status(500).send(err.message);
      }
    });
  }

  remove(name)
  {
    //TODO
  }
}
