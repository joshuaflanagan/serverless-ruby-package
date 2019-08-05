setup_gemfile() {
  if test "$1" = 'gems.rb'; then
    echo "### RENAME Gemfile TO gems.rb"
    mv Gemfile gems.rb
    mv Gemfile.lock gems.locked
  fi
}

restore_default_gemfile() {
  if test "$1" = 'gems.rb'; then
    echo "### RENAME gems.rb TO Gemfile"
    mv gems.rb Gemfile
    mv gems.locked Gemfile.lock
  fi
}

run_test() {
  GEMFILE=$1

  echo "### BUILD DEMO_SERVICE WITH $GEMFILE"
  pushd __tests__/demo_service

  setup_gemfile $GEMFILE

  echo '### BUILD PACKAGE'
  serverless package
  echo

  echo '### 1) EXAMINE PACKAGE'
  unzip -l .serverless/demo.zip
  echo

  echo '### 2) VERIFY FUNCTION CAN LOAD DEPENDENCIES'
  serverless invoke local -f hello

  restore_default_gemfile $GEMFILE

  popd
}

run_test Gemfile
run_test gems.rb
