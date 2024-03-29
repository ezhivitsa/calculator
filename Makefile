.PHONY: clean-dist
clean-dist:
	npx rimraf dist

.PHONY: clean-pkg
clean-pkg:
	npx rimraf pkg

.PHONY: clean
clean: clean-dist clean-pkg

.PHONY: build-wasm-pack
build-wasm-pack:
	wasm-pack build --out-dir pkg --target web --mode normal

.PHONY: build-wasm
build-wasm: clean-pkg build-wasm-pack

.PHONY: build-webpack
build-webpack:
	npx webpack --config webpack.prod.config.js

.PHONY: build-js
build-js: clean-dist build-webpack

.PHONY: copy-wasm
copy-wasm:
	npx cpy 'pkg/*.wasm' dist

.PHONY: build
build: build-wasm build-js copy-wasm

.PHONY: webpack-dev
webpack-dev:
	npx webpack serve --config webpack.dev.config.js

.PHONY: dev
dev: clean webpack-dev

.PHONY: deps
deps:
	yarn

.PHONY: lint-js
lint-js:
	npx eslint "src/client/**/*.{ts,tsx}"

.PHONY: lint-styles
lint-styles:
	npx stylelint "src/client/**/*.pcss"

.PHONY: test-jest
test-jest:
	npx jest

.PHONY: test-cargo
test-cargo:
	cargo test

.PHONY: test
test: lint-js lint-styles test-jest test-cargo

.PHONY: deploy-gh-pages
deploy-gh-pages:
	npx gh-pages -d dist

.PHONY: deploy
deploy:
	PUBLIC_PATH=calculator \
	$(MAKE) build deploy-gh-pages
