# axios

- avoid throwing error when response status code is 4xx/5xx
- use `validateStatus: () => true`
  ```ts
  const res: AxiosResponse = await axios.request({
    url: 'some url',
    method: 'POST',
    headers: {
      'some': 'header',
    },
    data: {
      'some: 'data'
  					},
    validateStatus: () => true, // don't throw error when status code like 4xx, 5xx
  })
  ```
## handle error with try catch

- type of error in catch block: https://github.com/axios/axios/issues/3612

