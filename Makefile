build-wasm:
	wasm-pack build --out-dir src/pkg

dev:
	npx webpack-dev-server --config webpack.dev.config.js
