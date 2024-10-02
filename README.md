# Event Driven Example

Example of using RabbitMQ for event driven architecture

```
make dev
```

above commond will start a docker compose app with redis and nodejs

```
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email": "jane.doe1@example.com"}'
```

```
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jane.doe1@example.com"}'
```

Run above commond on terminal to observe the logs for pub/sub activity.

- [] More robust Error Handling
- [] Retry Mechanism
- [] Dead Letter Excahnge
