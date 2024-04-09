#!/bin/bash
set -euo pipefail

os=$(. /etc/os-release; echo "$PRETTY_NAME")

# script to build gems within amazon linux lambda containers
echo '## INSTALLING PACKAGES ##'

# Amazon Linux 2 uses yum while Amazon Linux 2023 and likely future versions
# use dnf
if [[ $os == "Amazon Linux 2" ]]
then
  pkg_mgr="yum"
else
  pkg_mgr="dnf"
fi

eval "${pkg_mgr} update -y"
eval "${pkg_mgr} install -y gcc gcc-c++ make libffi-devel libyaml-devel"

echo '## INSTALLING GEMS ##'
bundle config set --local path 'vendor/bundle'
bundle install --standalone
