docker run --rm -v $(dirname $(realpath $0)):/var/task lambci/lambda:build-ruby2.5 ruby -I. -rhandler -e "puts hello(event:{},context:{})"
