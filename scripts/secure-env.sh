#!/usr/bin/env bash

cp .env.example .env

echo $CI_DB_USER

sed  's/\($CI_DB_USER\)/'"$CI_DB_USER"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_DB_PASSWORD"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_DB_NAME"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_JWT_SECRECT"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_JWT_EXPIRATION_TIME"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_COOKIE_AUTH_KEY"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_REDIS_HOST"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_REDIS_PORT"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_REDIS_NAME"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_AWS_REGION"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_AWS_ACCESS_KEY_ID"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_AWS_SECRET_ACCESS_KEY"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_AWS_PUBLIC_BUCKET_NAME"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_AWS_PRIVATE_BUCKET_NAME"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_SENTRY_DSN"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_UNSPLASH_ACCESS_KEY"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_UNSPLASH_SECRET_KEY"'/' .env
sed  's/\($CI_DB_USER\)/'"$CI_UNSPLASH_API_ENDPOINT"'/' .env

cat .env
