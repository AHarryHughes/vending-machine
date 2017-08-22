var express = require('express');
var bodyParser = require('body-parser');
const application = express();
const moment = require('moment');
const data = require('./data.js').data;

application.use(bodyParser.json());

let purchases = [];

let moneyInVender = 0;

// GET /api/customer/items - get a list of items
application.get('/api/customer/items', function (request, response) {
  response.json({"data": data});
});

// POST /api/customer/items/:itemId/purchases - purchase an item
application.post('/api/customer/items/:itemId/purchases', function (request, response) {
    let customerMoney = request.body.money;
    let item = data[request.params.itemId-1];
    let amountDifference = customerMoney - item.cost;

    if(!item.quantity){
        response.json({
            "status": "fail",
            "data": {
                "item": item.description,
                "quantity": 0
                }
        });
    }
    else if(amountDifference < 0){
        response.json({
            "status": "fail",
            "data": {
                "money_given": customerMoney,
                "money_required": item.cost
                }
        });
    }
    else{
        purchases.push({"item": item.description, "date": moment().format('MMM Do YY')});

        moneyInVender += item.cost;

        data[request.params.itemId-1].quantity -= 1;

        response.json({
            "status": "success",
            "change": amountDifference,
            "data": data
        });
    }

});

// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
application.get('/api/vendor/purchases', function (request, response) {
    response.json({"purchases": purchases});
});

// GET /api/vendor/money - get a total amount of money accepted by the machine
application.get('/api/vendor/money', function (request, response) {
    response.json({"money in vender": moneyInVender});
});

// POST /api/vendor/items - add a new item not previously existing in the machine
application.post('/api/vendor/items', function (request, response) {
    let description = request.body.description;
    let cost = request.body.cost;
    let quantity = request.body.quantity;
    let id = data[data.length-1].id + 1;

    data.push({
        "id": id,
        "description": description,
        "cost": cost,
        "quantity": quantity
    });

    response.json({
        "status": "success",
        "data": data
    });
});

// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
application.put('/api/vendor/items/:itemId', function (request, response) {
    let description = request.body.description;
    let cost = request.body.cost;
    let quantity = request.body.quantity;
    let id = request.params.itemId;
    let tmpItem = data[id-1];

    data[id-1] = {
        "id": id,
        "description": description || tmpItem.description,
        "cost": cost || tmpItem.cost,
        "quantity": quantity || tmpItem.quantity
    };

    response.json({
        "status": "success",
        "data": data
    });
});

if (require.main === "module") {
    application.listen(3000, function () {
        console.log('Express running on http://localhost:3000/.')
    });
  }

module.exports = application;
