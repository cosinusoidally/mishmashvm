#!/bin/bash
if [[ $1 == "--no-ion" ]]; then
  echo "disabling no-ion"
  node node_compat_min.js $2
else
  node node_compat_min.js $@
fi
