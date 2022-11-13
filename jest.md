# jest

`npx jest` - selects files with .unit.test.js extension
`npx jest ./path/to/my/file --coverage=false` run test for one file
`npx jest --coverage=false -- ./path/to/my/file1 ./path/to/my/file1` run test for few (particular) files

if test execution is too slow then use `--maxWorkers=1`
Ex: `npx jest ./path/to/my/file --coverage=false --maxWorkers=1`


## configuring jest with typescript project

`yarn add -D jest @types/jest ts-jest` - install deps
`npx ts-jest config:init` - init
`npx jest` OR `npx jest ./path/to/my/file` - run test cases

## expect

[https://jestjs.io/docs/expect](https://jestjs.io/docs/expect)

`.toBe` for premitive values
`.toEqual` for objects // object deep equal
`.toThrow` for error check
`.toHaveBeenCalledTimes` for function call count
`.toHaveReturnedWith` to check return value of mocked function (https://jestjs.io/docs/expect#tohavereturnedwithvalue)

## spyOn
const spyiedFn = jest.spyOn(myClass, "myMethod");

## mock node_modules package

```ts
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn((handler) => {}),
      },
      response: {
        use: jest.fn((handler) => {}),
      },
    },
  })),
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn((handler) => {}),
    },
    response: {
      use: jest.fn((handler) => {}),
    },
  }
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
test("test axios post mocking", () = {
  const postMock = mockedAxios.post.mockResolvedValue({"msg": "ok"});
  ...
  expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  postMock.mockReset();
})
```

```ts
// ex 2
jest.mock("../myService/my.service", () => {
  return {
    MyService: function () {
      return {
        getNames: jest.fn().mockResolvedValue(["name 1", "name 2]),
        getValue: jest.fn().mockResolvedValue("100"),
        getMsg: jest.fn().mockResolvedValue("some msg")
      };
    }
  };
});

const myService = new MyService();

test("", async() => {
  const namesMock = myService.getNames.mockResolvedValueOnce(["test"]);
  // other code
  expect(myService.mock.calls.length).toBe(1);
  namesMock.mockReset();
});
```

## axios mock

```ts
import axios from "axios";
jest.mock("axios");
// axios has been mocked. now return values of get, put, post will be undefined,
// so need to do .mockResolvedValue / .mockResolvedValueOnce where ever required.
// ex: axios.get.mockResolvedValueOnce({data: {msg: "test"}})
// to check how many times called: expect(axios.get.mock.calls.length).toBe(1);

test("test axios calls", async()=> {
  const getMock = axios.get.mockResolvedValueOnce({"msg": "Hello"});
  ...
  expect(axios.get.mock.calls.length).toBe();
  getMock.mockReset();
});
```


## best way to mock axios (no liniting/typescript error)

```sql
import axios from "axios"
jest.mock("axios);

describe("desc 1", () => {
  test("test 1", () => {
    const getMock = jest.spyOn(axios, "get").mockResolvedValueOnce({ data: responseData });
    // ... other code
    expect(getMock.mock.calls.length).toBe(1);
    getMock.mockReset();
  });
});
```

## custom value for environtment variables

```ts
// file: env.service.ts
export class EnvService {
  getEnv(envName: string) {
    return process.env[envName];
  }
}
```

```ts
// file: env.service.unit.test.ts
import { EnvService } from "./env.service";
const OLD_ENV = process.env;
const envService = new EnvService();
describe("test index", () => {
  beforeEach(() => {
    process.env = {...OLD_ENV};
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("should get custom env", async () => {
    process.env.MY_ENV = "11";
    expect(envService.getEnv("MY_ENV")).toBe("11");
  });
  test("should NOT get custom env", async () => {
    expect(envService.getEnv("MY_ENV")).toBe(undefined);
  });
});
```




