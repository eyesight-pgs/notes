# regexp

## negative/positive look-ahead/look-behind

- link: `https://stackoverflow.com/questions/2973436/regex-lookahead-lookbehind-and-atomic-groups`
- table
  ```txt
  (?!) - negative lookahead
  (?=) - positive lookahead
  (?<=) - positive lookbehind
  (?<!) - negative lookbehind

  (?>) - atomic group
  ```
- ex:
  ```txt
  items:
    - get("/users") // No
    - put("/users") // Yes
    - put("/users/address") // No
    - post("/users/roles") // Yes
    - get("/users/roles") // No
  reg exp to get lines which do not have "get" and "address": (?!get)\("/users(?!/address).*
  ```


