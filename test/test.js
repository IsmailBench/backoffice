require("dotenv").config();
let mocha = require("mocha");
let chai = require("chai");
let chaiHtpp = require("chai-http");
let jwt = require("jsonwebtoken");
const chaiJWT = require("chai-jwt");
let checkToken = require("../middleware/checkToken");

chai.use(chaiHtpp);
chai.use(chaiJWT);
chai.should();

let app = require("../app.js");

const validJWT = jwt.sign(
  { identifiant: "LEBRON", password: "JAAMES" },
  "KINGLEBRON",
  {
    audience: "localhost",
    expiresIn: "1h"
  }
);
const invalidJWT =
  "eyJhbGciOiJIUzI1NiIsInkpXVCJ9.eyJpZGVudGlmaWFudCI6IkxFQlJPTiIsInBkFNRVMiLCJpYXQiOjE1MjgyMDc1MDYsImV4cCI6MTibG9jYWxob3N0In0.TIrkRV6qu9inr1DBo729yW3cMpgQQHMwd4";

describe("logs", () => {
  it("it should get a error if type is not a Number", done => {
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        type: "A",
        timeStart: new Date()
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("it should get a error if type's is not equal to 1 or 0", done => {
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        type: 111,
        timeStart: new Date()
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("it should get a error if a timeStart is not enter", done => {
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        type: 1,
        timeEnd: new Date()
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("it should get a error if only a devUi is not hexadecimal", done => {
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        devUi: "aaaaaaaaaaaaaa",
        timeStart: new Date(),
        timeEnd: new Date()
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("it should get a error if only a devUi's length is not 16", done => {
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        devUi: "32383139369",
        timeStart: new Date(),
        timeEnd: new Date()
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("it should get a error if only a type is enter", done => {
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        type: 0
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("it should get a error if limit is not a number", done => {
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        limit: "A"
      })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("it should get a error if Rx is not data or zerodata or alldata", done => {
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        rx: "A"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("it should get logs with timeStart's enter when query is correct ", done => {
    let date = new Date("2018-06-13T00:00:00.000Z");
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        timeStart: date,
        limit: 1,
        render: 1
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("logs");
        res.body.should.have.property("count").eq(1);
        let temp = res.body.logs;
        console.log("ici" + temp[0].timestamp);
        done();
      });
    /* Regarder les iterateurs*/
  });
  it("it should get logs from devUi between timeStart and timeEnd when query is correct", done => {
    let dateStart = new Date();
    let dateEnd = new Date();
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        devUi: "323831395f369016",
        timeStart: dateStart,
        timeEnd: dateEnd,
        render: 1
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        let temp = res.body.logs;
        Object.keys(temp).map(el => {
          el.should.have.a.property("meta.slave");
          el.should.have.a.property("timestamp");
          el.timestamp.should.be.gte(dateStart);
          el.timestamp.should.be.lte(dateEnd);
          el.meta.slave.should.be("323831395f369016");
        });
        done();
      });
  });
  it("it should get logs between timeStart and timeEnd and type selected when query is correct", done => {
    let dateStart = new Date();
    let dateEnd = new Date();
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        type: 1,
        timeStart: dateStart,
        timeEnd: dateEnd,
        render: 1
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        let temp = res.body.logs;
        Object.keys(temp).map(el => {
          el.should.have.a.property("type");
          el.should.have.a.property("timestamp");
          el.timestamp.should.be.gte(dateStart);
          el.timestamp.should.be.lte(dateEnd);
          el.type.should.be(1);
        });
        done();
      });
  });
  it("it should get logs between timeStart and timeEnd and rx selected when query is correct", done => {
    let dateStart = new Date();
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        rx: "alldata",
        timeStart: dateStart,
        render: 1
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        let temp = res.body.logs;
        Object.keys(temp).map(el => {
          el.should.have.a.property("rx");
          el.should.have.a.property("timestamp");
          el.timestamp.should.be.gte(dateStart);
          el.rx.should.be("alldata");
        });
        done();
      });
  });
});

describe("login", () => {
  it("it should get a error if nothing was send", done => {
    chai
      .request(app)
      .post("/api/login")
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        done();
      });
  });
  it("it should get a error if only a identifiant is send", done => {
    chai
      .request(app)
      .post("/api/login")
      .send({
        identifiant: "Kaaris"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        done();
      });
  });
  it("it should get a error if only a password is send", done => {
    chai
      .request(app)
      .post("/api/login")
      .send({
        password: "B2obaa"
      })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        done();
      });
  });
  it("it should get a error if identifiant's length is less than 6 characteres", done => {
    chai
      .request(app)
      .post("/api/login")
      .send({
        identifiant: "B2oba",
        password: "gainsbourg"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        done();
      });
  });
  it("it should get a error if password's length is less than 6 characteres", done => {
    chai
      .request(app)
      .post("/api/login")
      .send({
        identifiant: "LilUzyVert",
        password: "pass"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        done();
      });
  });
});

describe("JWT", () => {
  it("Request with invalidJWT should 401", done => {
    chai
      .request(app)
      .get("/api/v1")
      .send({
        token: invalidJWT
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it("Request with undefined auth header should 401", done => {
    chai
      .request(app)
      .get("/api/v1")
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it("Request with validJWT should 200", done => {
    let dateStart = new Date();
    chai
      .request(app)
      .get("/api/v1/logs")
      .set({
        token: validJWT
      })
      .query({
        rx: "alldata",
        timeStart: dateStart,
        render: 1
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

describe("devices", () => {
  beforeEach("Check token's validity", () => {
    checkToken;
  }),
    it("it should get a error if limit is not a integer", done => {
      chai
        .request(app)
        .get("/api/v1/devices")
        .query({
          limit: "AAA",
          render: 1
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          done();
        });
    });
  it("it should get a error if offset is not a integer", done => {
    chai
      .request(app)
      .get("/api/v1/devices")
      .query({
        offset: "AAA",
        render: 1
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        done();
      });
  });
  it("it should get a error if devEUI's length is not 16", done => {
    chai
      .request(app)
      .get("/api/v1/devices/aaaaaaaaaaa")
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        done();
      });
  });
  it("it should return a list of device if query is correct", done => {
    chai
      .request(app)
      .get("/api/v1/devices")
      .set({
        token: validJWT
      })
      .query({
        offset: 0,
        render: 1,
        limit: 1
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        let temp = res.body.devices.result;
        temp.map(el => {
          el.should.have.a.property("devEUI");
          el.should.have.a.property("name");
          el.should.have.a.property("applicationID");
          el.should.have.a.property("description");
          done();
        });
      });
  });
  it("it should return a devEUI's page if devEUI is correct",done=>{
    chai
      .request(app)
      .get("/api/v1/")
  })
});
