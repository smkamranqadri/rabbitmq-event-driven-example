dev:
	docker-compose --profile dev up --build

prod:
	docker-compose --profile prod up --build

down:
	docker-compose --profile dev down