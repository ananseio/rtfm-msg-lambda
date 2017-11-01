#!/bin/sh
mkdir .tmp

json out -e 'this.out = JSON.stringify({
  name: this.name,
  version: this.version,
  dependencies: this.dependencies
})' < package.json | json > .tmp/package.json

find dist -type f ! -name '*.d.ts' -exec rsync {} -R .tmp \;
cp serverless.yml .tmp
cp yarn.lock .tmp

(cd .tmp && yarn --prod && serverless "$@")

rm -r .tmp
