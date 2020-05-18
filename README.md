# Calculator

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![Watch on GitHub](https://img.shields.io/github/watchers/ezhivitsa/calculator.svg?style=social&label=Watch)](https://github.com/ezhivitsa/calculator/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/ezhivitsa/calculator.svg?style=social&label=Stars)](https://github.com/ezhivitsa/calculator/stargazers)

Calculator is based on the following primary technologies:

- react
- mobx
- webpack
- postcss
- eslint
- typescript
- webassembly
- rust

Application structured in a way that allows us to write js code for frontend and rust code for webassembly at the same time and demonstrates some techniques how to write client-side code. In particular we use commands, events and appropriate handlers to achieve our goals.

### How to start development

Type the following command to install dependencies:
```bash
$ make deps
```

To run webpack build of the rust and js files type the following command:
```bash
$ make dev
```

And open in the browser `http://localhost:8080`

### How to make a build

To make a final build type the following command:
```bash
$ make build
```

### How to start tests

To start tests type the following command:
```bash
$ make test
```

### Explanations of the files structure.

1. **[src/wasm](./src/wasm)** - this folder contains `Rust` codebase. We compile `wasm` file using this code.
2. **[src/client/adapters](src/client/adapters)** - this folder contains code with interface which is based on another interface (adapter or wrapper pattern). Particularly we create `calculator-adapter` to organize communication between `js` and `wasm`.
3. **[src/client/components/global](src/client/components/global)** - global `React` components which can be used everywhere in the application. For example, `Button`, `Toggle`.
4. **[src/client/components/pages](src/client/components/pages)** - `React` components for particular page. Here we have only one page with calculator itself.
5. **[src/client/lib](src/client/lib)** - folder with common functions where we can do some common actions, for example transformations or validations. This functions help us to avoid copy-paste of functionality.
6. **[src/client/providers](src/client/providers)** - contains `React` context [providers](https://reactjs.org/docs/context.html#contextprovider)
7. **[src/client/services](src/client/services)** - folder with business logic
8. **[src/client/services/app](src/client/services/app)** - services where we can place some logic and send command which we will handle in another layer
9. **[src/client/services/command-handlers](src/client/services/command-handlers)** - this folder contains command handlers and state logic. Using state we can determine what event should we trigger. The main purpose of this handlers is to make validations and trigger or not trigger appropriate events.
10. **[src/client/services/event-handlers](src/client/services/event-handlers)** - folder with event handlers where we change current data. Here we call methods of adapter to update data structure in Rust code.
11. **[src/client/stores](src/client/stores)** - `MobX` stores. Here we use stores and add logic to handle application events and change store data in an appropriate way.
12. **[src/client/styles](src/client/stores)** - global styles and css variables
13. **[src/client/texts](src/client/texts)** - static texts

### Important things to keep in mind

1. Logical components should be tightly coupled. Keep all component related files, such as images, styles, sub components as close as possible to the component. Do not put component into the `globals` folder for the *future use*.
2. Two separate page components should be loosely coupled. If there is two page components which use same image - keep two copies of every image within every page. Do not create generic images folder, as all images belong to some ui components.

### Conventions

1. Name of all files for components should start from lowercase letter and words should be separated by a dash (`date-range`, `multi-action-button`).
2. Code style (eslint, typescript).

## License

Koa react starter is released under the [MIT License](LICENSE).
