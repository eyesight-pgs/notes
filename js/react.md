# react

## new react project

`npx create-react-app my-app --template typescript`

## basic

```ts
// html
<div id="app"></div>

// js
ReactDOM.render(
	<MyComponent />,
	document.getElementById("app")
)
```

## component

should starts with capital letter

```ts
function MyComp() {
	return <h3>Hello</h3>
}

class MyComp extends React.Component {
	public render() {
		return <h3>Hello</h3>
	}
}
```


## props - with function component

```js
function AppComp(props) { // here props can be named anything
  return <h2>
    name: {name}
    age: {age}
  </h2>
}
ReactDOM.render(
  <AppComp name="Foo Bar" age="10" />,
  document.getElementById("app");
)
```

```js
function SubComp({age}) {
  return <h3>age: {age}</h3>
}
function AppComp({name}) {
  return <SubComp name={name} age={10} />
}
ReactDOM.render(
  <AppComp name="Foo Bar" />,
  document.getElementById("app");
)
```

## props - with class component

Access props with `this` keyword like `this.props.age`.

```js
class MyClassComponent extends React.Component {
  public render() {
    return <h3>name: {this.props.age}, age: {this.props.age}</h3>
  }
}

ReactDOM.render(
  <MyClassComponent name="Foo Bar" age="10" />,
  document.getElementById("app");
)
```

## style

```ts
function MyComp() {
  return <h3
    style={
      { border: '1px solid black', margin: '10px' } // this is normal object literal
    }
  >Hello</h3>
}
```






