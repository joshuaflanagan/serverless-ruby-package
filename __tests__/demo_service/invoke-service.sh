  docker run --rm                                                     \
             --volume $(pwd):/var/task                                \
             --env RUBYLIB=/var/task                                  \
             --entrypoint '/var/lang/bin/ruby'                        \
             $RUBY_IMAGE                                              \
             '-e require "handler"; puts hello(event:{},context:{})'