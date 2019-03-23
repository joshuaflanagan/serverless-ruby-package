pushd __tests__/demo_service
echo '### BUILD PACKAGE'
serverless package
echo
echo '### 1) EXAMINE PACKAGE'
unzip -l .serverless/demo.zip
echo
echo '### 2) VERIFY FUNCTION CAN LOAD DEPENDENCIES'
serverless invoke local -f hello
