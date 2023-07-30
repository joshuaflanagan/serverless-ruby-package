#!/bin/bash
set -euo pipefail

# script to build gems within amazon linux lambda containers
echo '## INSTALLING PACKAGES ##'
yum update -y
yum install -y gcc gcc-c++ make libffi-devel libyaml-devel

echo '## INSTALLING GEMS ##'
bundle config set --local path 'vendor/bundle'
bundle install --standalone
