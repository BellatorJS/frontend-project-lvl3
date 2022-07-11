install:
	npm ci
publish:
	npm publish --dry-run
	
fix:	
	npx eslint --fix
lint:
	npx eslint .
build:
	npx webpack serve
