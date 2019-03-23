load "vendor/bundle/bundler/setup.rb"
$LOAD_PATH.unshift(File.expand_path("lib", __dir__))

require "json"
require "alpha"
require "beta"
require "redis"

def hello(event:, context:)
  body = {
    alpha: Alpha.describe,
    beta: Beta.describe,
    redis_version: Redis::VERSION
  }

  {
    statusCode: 200,
    body: JSON.generate(body)
  }
end
