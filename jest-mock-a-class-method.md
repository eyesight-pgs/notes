# using jest how to mock "getItems" function in following code

```ts
import {keyBy} from "lodash";
class A {
  public async getMultipleItemAsMap(itemIds: string[]) {
    const itemArr = await this.getItems(itemIds);
    const loansMap = keyBy(itemArr, "info.itemId");
    return loansMap;
  }
  public getItems(itemIds: string[]) {
    return [
      {
        info: {
          itemId: 1,
          itemName: "item 1"
        }
      },
      {
        info: {
          itemId: 2,
          itemName: "item 2"
        }
      },
    ]
  }
}
```

Ans:
```ts
import {keyBy} from "lodash";

describe("A", () => {
  let a: A;

  beforeEach(() => {
    a = new A();
  });

  it("should return item map", async () => {
    const mockGetItems = jest.spyOn(a, "getItems").mockReturnValue([
      {
        info: {
          itemId: 1,
          itemName: "mocked item 1"
        }
      },
      {
        info: {
          itemId: 2,
          itemName: "mocked item 2"
        }
      },
    ]);

    const expectedMap = {
      "1": {
        info: {
          itemId: 1,
          itemName: "mocked item 1"
        }
      },
      "2": {
        info: {
          itemId: 2,
          itemName: "mocked item 2"
        }
      },
    };
    const actualMap = await a.getMultipleItemAsMap(["1", "2"]);

    expect(mockGetItems).toHaveBeenCalledTimes(1);
    expect(actualMap).toEqual(expectedMap);

    mockGetItems.mockRestore();
  });
});
```

In this example, we create a mock function using jest.spyOn and replace the original getItems method of A with the mock function. We then set the return value of the mock function to an array of mocked items.

We call getMultipleItemAsMap with an array of two item ids, and we expect it to return a map with the two mocked items. We also expect the mock function to have been called once.

After the test, we restore the original getItems method using the mockRestore method of the mock function.

