#!/bin/bash
# Redis test: set and get a key for health check
redis-cli set shareuptime:test ok
redis-cli get shareuptime:test
