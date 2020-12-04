#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

# Ensure we have everything we need under vendor/
go mod tidy
go mod vendor

# Remove unwanted vendor files
find vendor/ \( -name "OWNERS" \
  -o -name "OWNERS_ALIASES" \
  -o -name "BUILD" \
  -o -name "BUILD.bazel" \
  -o -name "*_test.go" \) -exec rm -f {} +