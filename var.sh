#!/bin/bash


sed -i "s|api_host|$APPLICATION_HOST|g" .env.example
sed -i "s|api_port|$APPLICATION_PORT|g" .env.example
sed -i "s|env_node|$APPLICATION_NODE_ENV|g" .env.example
sed -i "s|key_app|$APPLICATION_APP_KEY|g" .env.example
sed -i "s|host_pg|$APPLICATION_HOST_PG|g" .env.example
sed -i "s|port_pg|$APPLICATION_PORT_PG|g" .env.example
sed -i "s|pg_user|$APPLICATION_PG_USER|g" .env.example
sed -i "s|pg_pass|$APPLICATION_PG_PASS|g" .env.example
sed -i "s|pg_db|$APPLICATION_PG_DB|g" .env.example
sed -i "s|aws_key|$APPLICATION_AWS_ACCESS_KEY_ID|g" .env.example
sed -i "s|secret_aws|$APPLICATION_AWS_SECRET_ACCESS_KEY|g" .env.example
sed -i "s|host_redis|$APPLICATION_REDIS_HOST|g" .env.example
sed -i "s|port_redis|$APPLICATION_REDIS_PORT|g" .env.example

mv .env.example .env

sed -i "s|aws_key|$TF_VAR_APPLICATION_AWS_ACCESS_KEY_ID|g" config.json
sed -i "s|secret_aws|$TF_VAR_APPLICATION_AWS_SECRET_ACCESS_KEY|g" config.json
sed -i "s|region_aws|$TF_VAR_APPLICATION_AWS_REGION|g" config.json
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" app/Controllers/Http/UserController.js
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" app/Exceptions/Handler.js
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" resources/views/menu.edge
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" resources/views/login.edge
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" resources/views/register.edge
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" resources/views/generate-cupom.edge
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" resources/views/del-cupom.edge
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" resources/views/del-user.edge
sed -i "s|api_kong_key|$APPLICATION_API_KONG_KEY|g" resources/views/mass.edge