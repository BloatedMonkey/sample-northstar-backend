.PHONY: dev build test clean docker-up docker-down seed

dev:
	docker-compose up -d postgres redis
	sleep 3
	npm run dev

build:
	npm run build

test:
	npm run test
	npm run test:e2e

clean:
	docker-compose down -v
	rm -rf dist node_modules

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

seed:
	npm run prisma:seed

