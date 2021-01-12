#!/usr/bin/env bash

cp .env.example .env

sed  's/\(DB_USER\)/'$CI_DB_USER'/' .env
sed  's/\(DB_PASSWORD\)/'$CI_DB_PASSWORD'/' .env
sed  's/\(DB_NAME\)/'$CI_DB_NAME'/' .env
sed  's/\(JWT_SECRECT\)/'$CI_JWT_SECRECT'/' .env
sed  's/\(JWT_EXPIRATION_TIME\)/'$CI_JWT_EXPIRATION_TIME'/' .env
sed  's/\(COOKIE_AUTH_KEY\)/'$CI_COOKIE_AUTH_KEY'/' .env
sed  's/\(REDIS_HOST\)/'$CI_REDIS_HOST'/' .env
sed  's/\(REDIS_PORT\)/'$CI_REDIS_PORT'/' .env
sed  's/\(REDIS_NAME\)/'$CI_REDIS_NAME'/' .env
sed  's/\(AWS_REGION\)/'$CI_AWS_REGION'/' .env
sed  's/\(AWS_ACCESS_KEY_ID\)/'$CI_AWS_ACCESS_KEY_ID'/' .env
sed  's/\(AWS_SECRET_ACCESS_KEY\)/'$CI_AWS_SECRET_ACCESS_KEY'/' .env
sed  's/\(AWS_PUBLIC_BUCKET_NAME\)/'$CI_AWS_PUBLIC_BUCKET_NAME'/' .env
sed  's/\(AWS_PRIVATE_BUCKET_NAME\)/'$CI_AWS_PRIVATE_BUCKET_NAME'/' .env
sed  's/\(SENTRY_DSN\)/'$CI_SENTRY_DSN'/' .env
sed  's/\(UNSPLASH_ACCESS_KEY\)/'$CI_UNSPLASH_ACCESS_KEY'/' .env
sed  's/\(UNSPLASH_SECRET_KEY\)/'$CI_UNSPLASH_SECRET_KEY'/' .env
sed  's/\(UNSPLASH_API_ENDPOINT\)/'"$CI_UNSPLASH_API_ENDPOINT"'/' .env

cat .env
