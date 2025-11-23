# ==== GO LANG ====

## install go
https://go.dev/doc/install

print go related env vars: `go env`

GO_PATH: `https://rakyll.org/default-gopath/`

go hello world: `https://go.dev/doc/code`


## To avoid value not used
```go
package use
func Use(val ...interface{}) {
}
func U(val ...interface{}) {
}
```
```go
// usage
import . "_/use"
U(10)
U(struct{name string}{"Foo"})
```



## Usual patterns in golang:

```go
struct

method


func(structdata) {
    create struct from struct data
    call method
}
------------------------------
gorillaHandler := mux.NewRouter()
------------------------------
```

## Encryption

```go
package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
)

func main() {
	key := []byte("a very very very very secret key") // 32 bytes
	plaintext := []byte("some really really really long plaintext")
	fmt.Printf("%s\n", plaintext)
	ciphertext, err := encrypt(key, plaintext)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%0x\n", ciphertext)
	result, err := decrypt(key, ciphertext)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", result)
}

// See alternate IV creation from ciphertext below
//var iv = []byte{35, 46, 57, 24, 85, 35, 24, 74, 87, 35, 88, 98, 66, 32, 14, 05}

func encrypt(key, text []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	b := base64.StdEncoding.EncodeToString(text)
	ciphertext := make([]byte, aes.BlockSize+len(b))
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return nil, err
	}
	cfb := cipher.NewCFBEncrypter(block, iv)
	cfb.XORKeyStream(ciphertext[aes.BlockSize:], []byte(b))
	return ciphertext, nil
}

func decrypt(key, text []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	if len(text) < aes.BlockSize {
		return nil, errors.New("ciphertext too short")
	}
	iv := text[:aes.BlockSize]
	text = text[aes.BlockSize:]
	cfb := cipher.NewCFBDecrypter(block, iv)
	cfb.XORKeyStream(text, text)
	data, err := base64.StdEncoding.DecodeString(string(text))
	if err != nil {
		return nil, err
	}
	return data, nil
}
```


## Websocket

- browser websocket
```js
const socket = new WebSocket("http://localhost:3333/ws")
socket.onopen = () => {
	console.log("connected to server")
	socket.send("Hi from client")
}
socket.onclose = event => {
	console.log("websocket connection closed", event)
	socket.send("client closed")
}
socket.onerror = err => {
	console.log("Socket error: ", err)
}
```
- Go Lang websocket
```go
var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
}
var reader(conn *websocket.Conn) {
	for {
		// read
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println(string(p))
		
		// write
		writeErr := conn.WriteMessage([]byte(p))
		if writeErr != nil {
			fmt.Println(writeErr)
			return
		}

	}
}
```


## FAQ / Special cases:

- Panic does not kill server. Why? Panic should stops whole program. Right?
	In case of net/http it recovers from panic. So server does not crash for a panic.
	Just One request is stopped from further processing.
	link: https://about.sourcegraph.com/blog/go-when-is-it-ok-to-recover/
	> One notable example of recover being used is in net/http. The connection struct recovers from panics so that a panic in a request handler doesn’t crash the entire server.

- Gorilla mux middlewares not executed if route is missing. Why?
	link: https://github.com/gorilla/mux/issues/416
	Its intended behavior.
	To run middleware function for all requests, we can do something like this:

	```go
	var customHandler http.Handler = gorillaRouter
	/*
		Global middlewares
		middlewares must be registered in "REVERSE ORDER"
		last middleware will be called first
	*/
	customHandler = middlewares.SetLoggers(customHandler) // last to run
	customHandler = middlewares.CORS(customHandler)
	customHandler = middlewares.LogReq(customHandler)
	customHandler = middlewares.ReqMap(customHandler)
	customHandler = middlewares.SetReqId(customHandler) // first to run 
	```

- Golang set content type json is ignored.
	net/http: ResponseWriter doesn't overwrite content-type after WriteHeader is called
	link: https://github.com/golang/go/issues/17083
	Can not change headers once `w.WriteHeader()` function is called.



