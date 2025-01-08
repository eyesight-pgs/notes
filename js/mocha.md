# mocha

Usual combination:
- mocha: test runner
- chai: for assertion
- sinon: for mocking
- proxyquire: prevent importing file before stubing

## Mocking simple function (which is deeply nested in import hiararchy)
index.js ---> middle.js ---> math.js (mock add fucntion here)

The following way of stubbing works even if the middle.js is a CLASS consuming add funtion from math.js
```js
// index.js
const {sum} = require("./middle");

function generateNumber(a, b) {
  const total = sum(a, b);
  const result = total + 1;
  return result;
}


module.exports = {
  generateNumber
}
```
```js
// middle.js
const { add } = require("./math");

function sum(a,b) {
  const total = add(a,b);
  return total;
}

module.exports = {sum}
```
```js
// math.js
function add(a, b) {
  // assume this is extremely complex and resource intensive function
  // mock this function during test case running
  console.log("actual function called");
  throw "dont call it from test";
  return a + b;
}

module.exports  = {
  add
}
```
```js
// test.js
// test.js
const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require('proxyquire').noCallThru();

describe("testing generateNumber function", () => {
    it("generateNumber should call stubbed add", () => {
        // Stub the add function to return a fixed value
        const addStub = sinon.stub().returns(3);

        // Use proxyquire to substitute the original math module with our stub
        const mid = proxyquire("./middle.js", {
            "./math": {
                add: addStub
            }
        });

        // Use proxyquire to substitute the original middle module with the one containing our stubbed math module
        const { generateNumber } = proxyquire("./index.js", {
            "./middle": mid
        });

        // Call generateNumber function with test values
        const result = generateNumber(1, 2);

        // Assert that the result is as expected
        expect(result).to.equal(4);

        // Assert that addStub was called once
        expect(addStub.calledOnce).to.be.true;

        // Assert that addStub was called with the correct arguments
        expect(addStub.calledWith(1, 2)).to.be.true;
    });
});
```

## Debugging if stub is being called
```js
// execute main test function
// ...
// Log to confirm if the stub was called and with what arguments
console.log('Stub called:', addStub.called);
console.log('Stub call count:', addStub.callCount);
console.log('Stub call args:', addStub.getCall(0) && addStub.getCall(0).args);
```

## Mocking a class method
Mocking a class method is extremely simple compared to a simple function
```js
// my-class.js
class MyClass {
    ten() { return 10; }
    async twenty() { return 20; }
}
```
```js
// my-test.spec.js
// sync
funcStub = sinon.stub().returns(11);
MyClass.prototype.ten = funcStub;
expect(funcStub.calledOnce).to.be.true;

// async
asyncFuncStub = sinon.stub().resolves(21); // resolves() for aync function
MyClass.prototype.twenty = asyncFuncStub;
expect(asyncFuncStub.calledOnce).to.be.true;
```

## Check for arguments to stubs
```js
// check for first argument is as expected
const firstArg = myStub.getCall(0)?.args?.[0];
expect(firstArg).to.equal({"foo": "bar"});
```

## Check for not undefined
```js
expect(myVal).to.not.undefined;
```

## Premitive comparison vs object comparison
```js
// premitive comparison
expect(10).to.equal(10);
expect("foo").to.equal("foo");
expect(true).to.equal(true);

// object comparison
expect({"ten": 10}).to.deep.equal({"ten": 10});
```
## sinon mocking - returnming mocked value
```js
const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const mock = sandbox.stub();

// async
mock.resolves({ten: 10});
```
Different return value on 1st and 2nd call
```js
mock
  .onFirstCall.resolves({ten: 10})
  .onSecondCall.resolves({twe: 20});
```
## proxyquire
```js
// db.js
async function insertItem(fullName, sqlClient) {
  const row = await sqlClient.query(`insert into user (full_name) values (${fillName}) returning *`);
  return row;
}
module.exports = {
  insertItem
};
```
```js
// my-controller.js
const db = require("./db.js");

async function postUser(fullName, sqlClient) {
  const row = await db.insertItem(fullName, sqlClient);
}
module.exports = {
  postUser
}
```
```js
// test.js
const proxyquire = require("proxyquire");
const sinon = require("sinon");

it("should call db function once", async () => {
  cosnt sandbox = sinon.createSandbox();
  const controller = proxyquire("./my-controller.js", {
    "./db": {
      insertItem: sandbox.stub().onFirstCall().resolve({userId: 1})
    }
  });
  const sqlClientMock = sandbox.stub()/* .return(... */;
  const row = await controller.postUser("Test user 1", sqlClientMock);
  expect(...
});
```
## Mocking the function in same file (TLDR: not possible)
```js
// main.js
function sum(a, b) { // we need to mock sum function. But not possible
    return a + b;
}
function double(n) {
  const double = sum(n, n);
  console.log("double :", double);
  return double;
}
module.exports = { sum, double };
```
```js
// test/main.test.js
const { expect } = require("chai");
const main = require("../main.js");
const sinon = require("sinon");

describe("testing double function", () => {
  it("should not call original sum function", () => {
    main.sum = sinon.stub(main, "sum").returns(5); // this will not work, since the double function accesses sum function through closure
    const res = main.double(2);
    expect(res).to.equal(5);
  });
});
```
To mock sum function, either we have to move sum function inside some class or move it to other file (module).


