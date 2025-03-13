# RXJS - Observables


```js
const { range, of, from, firstValueFrom, filter, map, Observable } = require("rxjs");



const apiCall = new Promise((resolve, reject) => {
  setTimeout(() => resolve('{"msg": "Hello World!"}'), 2000);
});

const generator = from(apiCall);


function processData(data) {
  const parsedData = JSON.parse(data);
  console.log(" data is :", parsedData);

  console.log("api call completed");
}
function handleError(error) {
  console.error(error);
}

console.log("calling api call");
firstValueFrom(generator).then(processData);
```
