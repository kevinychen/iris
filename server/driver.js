var ObjectID = require('mongodb').ObjectID;

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

  if (!req.body.user_id || !req.body.first_name || !req.body.last_name || !req.body.email || !req.body.dob) {
    res.send(400, "Bad Request");
  } else {

    var userIdInfo = req.body.user_id;
    var firstNameInfo = req.body.first_name;
    var lastNameInfo = req.body.last_name;
    var emailInfo = req.body.email;
    var dobInfo = req.body.dob;

    var db = this.db;

    this.db.collection('users', function(err, collection) {

      collection.find({
        $or: [{
          email: emailInfo
        },{
          userId: userIdInfo
        }]
      }).toArray(function(err, items) {

        if (err)
          res.send(500, "Internal Server Error");
        else {

          if (items.length != 0) {

            if (items[0].email == emailInfo)
              res.send(400, "Email already in use");
            else
              res.send(400, "Username already in use");

          } else {
            addUser(db, userIdInfo, firstNameInfo, lastNameInfo, emailInfo, dobInfo, req, res);
          }

        }

      });

    });

  }

};

function addUser(db, userIdInfo, firstNameInfo, lastNameInfo, emailInfo, dobInfo, req, res) {
  
  db.collection('users', function(err, collection) {

    var insert = {
      userId: userIdInfo,
      firstName: firstNameInfo,
      lastName: lastNameInfo,
      email: emailInfo,
      dob: dobInfo,
      services: [{"name": "Iris"}]
    }

    if (req.body.middle_name)
      insert.middleName = req.body.middle_name;

    if (req.body.home_phone)
      insert.homePhone = req.body.home_phone;

    if (req.body.mobile_phone)
      insert.mobilePhone = req.body.mobile_phone;

    if (req.body.work_phone)
      insert.workPhone = req.body.work_phone;
    
    if (req.body.address)
      insert.address = req.body.address;
    
    if (req.body.city)
      insert.city = req.body.city;
    
    if (req.body.state)
      insert.state = req.body.state;
    
    if (req.body.zip_code)
      insert.zipCode = req.body.zip_code;
    
    if (req.body.card_number)
      insert.cardNumber = req.body.card_number;
    
    collection.insert(insert, function(err, result) {

      if (err) {
        res.send(500, "Internal Server Error");
      } else {
        res.send(200, "OK");
      }

    });

  });

}

Driver.prototype.handlePost = function(req, res) {

  if (!req.params.id) {
    res.send(400, "Bad Request");
  } else {

    var userIdInfo = req.params.id;

    if (req.body.service) {

      var serviceInfo = req.body.service;

      this.db.collection('users', function(err, collection) {

        collection.update({
          userId: userIdInfo
        }, {
          $addToSet: {
            services: serviceInfo
          }
        }, function(err, result) {

          if (err)
            res.send(500, "Internal Server Error");
          else {
            res.send(200, "OK");
          }

        });

      });

    } else if (req.body){

      var update = {}

      if (req.body.middle_name)
        update.middleName = req.body.middle_name;

      if (req.body.home_phone)
        update.homePhone = req.body.home_phone;

      if (req.body.mobile_phone)
        update.mobilePhone = req.body.mobile_phone;

      if (req.body.work_phone)
        update.workPhone = req.body.work_phone;
      
      if (req.body.address)
        update.address = req.body.address;
      
      if (req.body.city)
        update.city = req.body.city;
      
      if (req.body.state)
        update.state = req.body.state;
      
      if (req.body.zip_code)
        update.zipCode = req.body.zip_code;
      
      if (req.body.card_number)
        update.cardNumber = req.body.card_number;

      this.db.collection('users', function(err, collection) {

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

    } else {
      res.send(400, "Bad Request");
    }

  }

};

exports.Driver = Driver;