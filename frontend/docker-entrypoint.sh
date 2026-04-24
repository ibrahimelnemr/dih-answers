#!/bin/sh
set -e

# Default to local backend if BACKEND_URL is not set
BACKEND_URL=${BACKEND_URL:-http://localhost:8000}

# Extract hostname from URL for proxy Host header
BACKEND_HOST=$(echo "$BACKEND_URL" | sed 's|https\?://||' | cut -d/ -f1 | cut -d: -f1)
export BACKEND_URL BACKEND_HOST

# Substitute only our variables, leaving nginx variables ($uri, $host, etc.) intact
envsubst '${BACKEND_URL} ${BACKEND_HOST}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
