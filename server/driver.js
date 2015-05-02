var ObjectID = require('mongodb').ObjectID;
var BigNumber = require('bignumber.js');

Driver = function(db) {
  this.db = db;
};

Driver.prototype.handleGet = function(req, res) {

  if (!req.params.id) {
    res.send(400, "Bad Request");
  } else {

    var userIdInfo = req.params.id;

    this.db.collection('users', function(err, collection) {

      collection.findOne({
        userId: userIdInfo
      }, {
        "_id": 0
      }, function(err, item) {

        if (err)
          res.send(500, "Internal Server Error");
        else {

          if (item) {
            res.send(item);
          } else {
            res.send(400, "Bad Request");
          }
        }
      });
    });
  }
};

Driver.prototype.handlePut = function(req, res) {

  if (!req.body.user_id || !req.body.auth || !req.body.encryption_params || !req.body.data) {
    res.send(400, "Bad Request");
  } else {

    if (!req.body.auth.e || !req.body.auth.n) {
      res.send(400, "Bad Request");
    } else {

      var userIdInfo = req.body.user_id;
      var authInfo = req.body.auth;
      var encryptionParamsInfo = req.body.encryption_params;
      var dataInfo = req.body.data;

      var db = this.db;

      this.db.collection('users', function(err, collection) {

        collection.find({
          userId: userIdInfo
        }).toArray(function(err, items) {

          if (err)
            res.send(500, "Internal Server Error");
          else {

            if (items.length != 0) {
              res.send(400, "Username already in use");

            } else {
              addUser(db, userIdInfo, authInfo, encryptionParamsInfo, dataInfo, res);
            }
          }
        });
      });
    }
  }
};

function addUser(db, userIdInfo, authInfo, encryptionParamsInfo, dataInfo, res) {
  
  db.collection('users', function(err, collection) {

    collection.insert({
      userId: userIdInfo,
      auth: authInfo,
      encryptionParams: encryptionParamsInfo,
      data: dataInfo
    }, function(err, result) {

      if (err) {
        res.send(500, "Internal Server Error");
      } else {
        res.send(200, "OK");
      }
    });
  });
}

Driver.prototype.handlePost = function(req, res) {

  if (!req.params.id || !req.body.old_auth || !req.body.new_auth) {
    res.send(400, "Bad Request");
  } else {

    if (!req.body.old_auth.p || !req.body.old_auth.q || !req.body.new_auth.e || !req.body.new_auth.n) {
      res.send(400, "Bad Request");
    } else {

      var userIdInfo = req.params.id;
      var oldAuthInfo = req.body.old_auth;
      var newAuthInfo = req.body.new_auth;

      var db = this.db;

      this.db.collection('users', function(err, collection) {

        collection.findOne({
          userId: userIdInfo
        }, function(err, item) {

          if (err)
            res.send(500, "Internal Server Error");
          else {            

            var pVal = new BigNumber(oldAuthInfo.p);
            var qVal = new BigNumber(oldAuthInfo.q);
            var nVal = new BigNumber(item.auth.n);

            if ((pVal.times(qVal)).equals(nVal)) {
              editUser(db, userIdInfo, newAuthInfo, req, res);
            } else {
              res.send(400, "Bad Request");
            }
          }
        });
      });
    }
  }
};

function editUser(db, userIdInfo, newAuthInfo, req, res) {
  
  var update = {
    auth: newAuthInfo
  };

  if (req.body.data)
    update.data = req.body.data;

  if (req.body.encryption_params)
    update.encryptionParams = req.body.encryption_params;

  db.collection('users', function(err, collection) {

    collection.update({
      userId: userIdInfo
    }, {
      $set: update
    }, function(err, result) {

      if (err)
        res.send(500, "Internal Server Error");
      else {
        res.send(200, "OK");
      }

    });

  });
}

exports.Driver = Driver;