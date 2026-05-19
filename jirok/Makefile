COMPOSE = docker compose

all: up

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up --build -d

# without detach
start:
	$(COMPOSE) up --build

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps


clean:
	$(COMPOSE) down

fclean:
	$(COMPOSE) down -v --remove-orphans

re: fclean build up
