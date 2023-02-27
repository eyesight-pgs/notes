# js

## slice(fromIndex, toIndex)

- slice(inclusiveIndex, exclusiveIndex)
- does not modifies original array

## splice(fromIndex, deleteCount, insertElements)

- splice(inclusiveIndex, deleteCount)
- it modifies original array

## error object to string (for printing)

JSON.stringify(err) ===========> will give {}<br>
	because error object does not have enumerable properties.<br>
so use:<br>
JSON.stringify(err, Object.getOwnPropertyNames(err))

## class-validator

validate array of objects

```ts
export class SignInModel {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => AuthParam) // from "class-transformer" package
  authParameters: AuthParam[];
}
```

## class-validator - all decorators docs

https://github.com/typestack/class-validator#validation-decorators

## class-validator - validate simple object (or standard object or object litteral)

use `@IsObject()`

## dotenv

- `yarn add dotenv`
- add following line in the index.js
  ```js
  import 'dotenv/config';
  // or
  require('dotenv').config();
  ```

## json sort and format (sort json keys)

```ts
function jsons(obj, space = 2) {
  const allKeys: string[] = [];
  const seen: any = {};
  JSON.stringify(obj, function (key, value) {
    console.log(key, value)
    if (!(key in seen)) {
      allKeys.push(key);
      seen[key] = null;
    }
    return value;
  });
  allKeys.sort();
  return JSON.stringify(obj, allKeys, space);
}
```

## prevent app crashing due to unhandled promise rejection

```js
process
  .on('unhandledRejection', (reason, p) => {
    console.error(`unhandled promise rejection occurred | reason: ${JSON.stringify(reason)} | promise:`);
    console.error(p);
  })
```



## sort array of objects

```ts
/**
 * @param data: object[]
 * @param sort: string "+key1,-key2"
 * 
 * 
    Example usage:
      const data = [
        {fName: "jjj", lName: "lll", age: 10},
        {fName: "jjj", lName: "aaa", age: 10},
        {fName: "aaa", lName: "aaa", age: 5},
        {fName: "zzz", lName: "zzz", age: 20},
        {fName: "jjj", lName: "lll", age: 15},
      ]
      const sort = "+fName,+lName,-lName"
      sortObjects(data, sort);
      Here,
        +fName: sort asc based on fName
        +lName: if fName values are same then sort asc based on lName
        -age: if fName values are same & lName values are same then sort desc based on age
 */
export function sortArrayOfObjects<T extends {[k: string]: any}> (data: T[], sort: string): T[] {
  // validate sort criteria
  const sortPattern = /^[\+\-]\w+(,[\+\-]\w+)*$/; // ex: "+fName,+lName,-age"
  if(sortPattern.test(sort)) {
  } else {
    console.error(`sortObjects | provided sort criteria is invalid | sort: ${sort}`);
    return data;
  }
  const sorts = sort.split(",");
  let sortedData = data;
  for(let i = sorts.length - 1; i >= 0; i--) { // perform sort for each key from last to first
    if(sorts[i].length < 1) { return sortedData; }
    const order = Number(`${sorts[i].charAt(0)}1`); // +1 or -1
    const key: string = sorts[i].substring(1);
    sortedData = sortedData.sort((a, b) => {
      if(a[key] === undefined && b[key] === undefined) {
        console.error(`sortObjects | most likely provided key is invalid | key: ${key}`);
      }
      let action: number;
      if (a[key] < b[key]) {
        action = -1;
      } else if(a[key] > b[key]) {
        action = 1;
      } else {
        action = 0;
      }
      return action * order;
    });
  }
  return sortedData;
}
```

## flame graph

way1) https://github.com/ThePrimeagen/tyrone-biggums


way2) https://nodejs.org/en/docs/guides/diagnostics-flamegraph/
This requires perf command which works only on linux.

node options:
--perf-basic-prof
--perf-basic-prof-only-functions

sudo perf record -e cycles:u -g -- node --perf-basic-prof app.js
OR
sudo perf record -e cycles:u -g -- node --perf-basic-prof-only-functions app.js

filter:
sudo sed -i -e "/( __libc_start| LazyCompile | v8::internal::| Builtin:| Stub:| LoadIC:|\[unknown\]| LoadPolymorphicIC:)/d" -e 's/ LazyCompile:[*~]\?/ /' perfs.out

rec for 3 sec
sudo perf record -F99 -p `pgrep -n node` -g -- sleep 3



## typeorm

create migration file: `npx typeorm migration:create -n AddingNewColum`


## axios - get curl from error

```ts
function getCurlFromErr(err: Error) {
  if(err instanceof AxiosError) {
    const cfg = err.config;
    const method = cfg.method ?? "?";
    let curl = `curl --location --request ${cfg.method.toUpperCase()} ${cfg.url}    ${Object.keys(cfg.headers).map(key => ` --header '${key}: ${cfg.headers[key]}'`).join(' ')}     --data-raw '${!err.config.data ? "" : (JSON.stringify(err.config.data)).replace(/^./, "").replace(/.$/, "").replace(/\\/g, "")}'`;
    return curl;
  } else {
    return '-';
  }
}
```

## flatten the object (dotNotate)

```ts
function dotNotate(obj: any, target?: any, prefix?: any): any {
    (target = target || {}), (prefix = prefix || "");

    Object.keys(obj).forEach(key => {
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null
      ) {
        dotNotate(obj[key], target, prefix + key + ".");
      } else {
        return (target[prefix + key] = obj[key]);
      }
    });

    return target;
  }
```

## unflatten object

```ts
// keys with only digits treated as array index
function unflatten(data: any) {
    var result = {}
    for (var i in data) {
      var keys = i.split('.')
      keys.reduce(function(r: any, e, j) {
        return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
      }, result)
    }
    return result
  }
```

## promised stream

link: https://stackoverflow.com/a/68750761/9077311

```js
import * as StreamPromises from "stream/promises";
...
await StreamPromises.pipeline(sourceStream, destinationStream);
```

## date time arithmetic with timezone

```js
const moment = require("moment")
const  period = 1
let newDate = new Date("2021-12-23T02:00:00Z");
newDate = moment(newDate)
  .utcOffset(-300) // do time arithmetic in EST timezone
  .startOf("day")
  .add(period - 1, "days")
  .add(27, "hours") // start_of_the_day + 24_hours + 3_hours
  .toDate();
console.log("", newDate.toUTCString());
```

## date time in Y-M-D H:I:S

```js
const input = new Date().toISOString();
const [_, date, time] =  /(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d:\d\d)/.exec(input) ?? [];
let output = `${date} ${time}`;
console.log(output);
```


## printing circular object

if you know which key is responsible for circular reference,
then we can remove it like:

```ts
  {
    ...data,
    pointer: 'obj'
  }
```

ex:
```ts
class A {
	ptr: A
	ten: number
	ele: number
	constructor() {
		this.ptr = this
		this.ten = 10
		this.ele = 11
	}
}
function getNonCircular(a: A) {
	return {
		...a,
		ptr: 'obj'
	}
}
const a = new A()
const nonCircular = getNonCircular(a)
```
## CPU Profiling & Heap Snapshot

`yarn add v8-profiler-next`

```
// PerfService.ts file
import { createWriteStream } from "fs";
import * as v8Profiler from "v8-profiler-next";
import { pipeline } from "stream/promises";

// CPU Profiling
// usage:
//   const cpu = new CpuPerfService("my-cpu-profiling");
//   cpu.start();
//   // do some stuff
//   await cpu.finish();
// then,
//   Navigate to chrome://inspect
//   Click Open dedicated DevTools for Node
//   Select the profiler tab
//   Load your file
export class CpuPerfService {
  private title: string = "";
  public constructor(title: string) {
    this.title = title;
    this.config();
  }

  private config() {
    // set generateType 1 to generate new format for cpuprofile
    // to be compatible with cpuprofile parsing in vscode.
    v8Profiler.setGenerateType(1);
  }

  private getDate() {
    const input = new Date().toISOString();
    const [_, date, time] =  /(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d:\d\d)/.exec(input) ?? [];
    let output = `${date}--${time}`;
    return output;
  }

  public start() {
    v8Profiler.startProfiling(this.title, true);
  }

  // if it doesn't have the extension .cpuprofile then
  // chrome's profiler tool won't like it.
  public async finish() {
    const profile = v8Profiler.stopProfiling(this.title);
    const exportStream = profile.export(); // export returns stream if no parameter provided
    const date = this.getDate();
    const filename = `${this.title}--${date}.cpuprofile`;
    const writeSteam = createWriteStream(filename, "utf8");
    try {
      await pipeline(exportStream, writeSteam);
    } catch(error) {
      console.log(`===== error: failed to write data to file =====`);
      console.log(error);
      console.log(`===== error: failed to write data to file =====`);
    }
  }
}

// Heap Snapshot
// usage:
//   const heap = new HeapPerfService("my-heap-check");
//   await heap.takeSnapshot();
//   // do some stuff
//   await heap.takeSnapshot();
export class HeapPerfService {
  private title: string = "";
  private count: number = -1;

  public constructor(title: string) {
    this.title = title;
  }

  private getDate() {
    const input = new Date().toISOString();
    const [_, date, time] =  /(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d:\d\d)/.exec(input) ?? [];
    let output = `${date}--${time}`;
    return output;
  }

  public async takeSnapshot() {
    this.count++;
    const snapshot = v8Profiler.takeSnapshot();
    const exportStream = snapshot.export(); // export returns stream if no parameter provided
    const date = this.getDate();
    const filename = `${this.title}--${date}--${this.count}.heapsnapshot`;
    const writeSteam = createWriteStream(filename, "utf8");
    try {
      await pipeline(exportStream, writeSteam);
    } catch(error) {
      console.log(`===== error: failed to take heap snapshot =====`);
      console.error(error);
      console.log(`===== error: failed to take heap snapshot =====`);
    }
    snapshot.delete();
  }
}
```

## simple http request

```js
import axios from "axios";
async function main() {
  const res = await axios.request({
    method: 'POST',
    url: 'https://example.com',
    headers: {
      "Authorization": "token"
    },
    data: {msg: "hello world"}
  });
  console.log(res.data);
}
main();
```
