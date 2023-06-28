set -e

pushd __tests__/demo_service
echo '### BUILD PACKAGE'
yarn run serverless package
echo
echo '### 1) EXAMINE PACKAGE'
unzip -l .serverless/demo.zip
echo
echo '### 2) VERIFY FUNCTION CAN LOAD DEPENDENCIES'
./invoke-service.sh
