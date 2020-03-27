clean:
	npx rimraf dist pkg

build-wasm:
	wasm-pack build --out-dir pkg

build: clean build-wasm

webpack-dev:
	npx webpack-dev-server --config webpack.dev.config.js

dev: clean webpack-dev

lint-styles:
	npx stylelint "src/client/**/*.pcss"
