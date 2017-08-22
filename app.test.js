const request = require('supertest');
const assert = require("assert");
const app = ('./index');
const data = require('./data.js').data;

describe("GET /api/customer/items", function () {
    it("should return data successfully", function () {
      request(app)
        .get("/api/customer/items")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(function (res) {
          expect(res.body['data']).toBe(data);
        });
    })
})

describe("POST /api/customer/items/:itemId/purchases", function () {
    it("should return data successfully", function () {
        request(app)
            .post("/api/customer/items/1/purchases")
            .send({"money": 2.50})
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (res) {
                expect(res.body['status']).toBe("success");
            });
    })

    it("should fail to purchase because not enough money", function () {
        request(app)
            .post("/api/customer/items/1/purchases")
            .send({"money": 2.40})
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (res) {
                expect(res.body['status']).toBe("fail");
            });
    })

    it("should fail to purchase because quantitiy is zero", function () {
        request(app)
            .post("/api/customer/items/5/purchases")
            .send({"money": 2.50})
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (res) {
                expect(res.body['status']).toBe("fail");
            });
    })

})

describe("GET /api/vendor/purchases", function () {
    it("should return purchases successfully", function () {
      request(app)
        .get("/api/vendor/purchases")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
    })
})

describe("GET /api/vendor/money", function () {
    it("should return money successfully", function () {
      request(app)
        .get("/api/vendor/money")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
    })
})

describe("POST /api/vendor/items", function () {
    it("should add item", function () {
      request(app)
        .post("api/vendor/items")
        .send({
            "description": "description",
            "cost": 4,
            "quantity": 0
        })
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(function (res) {
            expect(res.body['status']).toBe("success");
        });
    })
})

describe("PUT /api/vendor/items/:itemId", function () {
    it("should update item", function () {
      request(app)
        .get("/api/vendor/items/1")
        .send({
            "description": "description"
        })
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(function (res) {
            expect(res.body['status']).toBe("success");
        });
    })
})