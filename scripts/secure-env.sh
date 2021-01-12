#!/usr/bin/env bash

cp .env.example .env

echo $CI_DB_USER

sed  -i "s~CI_DB_USER~$CI_DB_USER~g" .env
sed  -i "s~CI_DB_PASSWORD~$CI_DB_PASSWORD~g" .env
sed  -i "s~CI_DB_NAME~$CI_DB_NAME~g" .env
sed  -i "s~CI_JWT_SECRECT~$CI_JWT_SECRECT~g" .env
sed  -i "s~CI_JWT_EXPIRATION_TIME~$CI_JWT_EXPIRATION_TIME~g" .env
sed  -i "s~CI_COOKIE_AUTH_KEY~$CI_COOKIE_AUTH_KEY~g" .env
sed  -i "s~CI_REDIS_HOST~$CI_REDIS_HOST~g" .env
sed  -i "s~CI_REDIS_PORT~$CI_REDIS_PORT~g" .env
sed  -i "s~CI_REDIS_NAME~$CI_REDIS_NAME~g" .env
sed  -i "s~CI_AWS_REGION~$CI_AWS_REGION~g" .env
sed  -i "s~CI_AWS_ACCESS_KEY_ID~$CI_AWS_ACCESS_KEY_ID~g" .env
sed  -i "s~CI_AWS_SECRET_ACCESS_KEY~$CI_AWS_SECRET_ACCESS_KEY~g" .env
sed  -i "s~CI_AWS_PUBLIC_BUCKET_NAME~$CI_AWS_PUBLIC_BUCKET_NAME~g" .env
sed  -i "s~CI_AWS_PRIVATE_BUCKET_NAME~$CI_AWS_PRIVATE_BUCKET_NAME~g" .env
sed  -i "s~CI_SENTRY_DSN~$CI_SENTRY_DSN~g" .env
sed  -i "s~CI_UNSPLASH_ACCESS_KEY~$CI_UNSPLASH_ACCESS_KEY~g" .env
sed  -i "s~CI_UNSPLASH_SECRET_KEY~$CI_UNSPLASH_SECRET_KEY~g" .env
sed  -i "s~CI_UNSPLASH_API_ENDPOINT~$CI_UNSPLASH_API_ENDPOINT~g" .env

cat .env
