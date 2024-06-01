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
