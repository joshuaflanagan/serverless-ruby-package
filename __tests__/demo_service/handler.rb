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

  begin
    require "http"
    r = HTTP.get("http://icanhazip.com")
    body[:response] = r.to_s
  rescue Exception => e
    body[:error_class] = e.class.to_s
    body[:error_message] = e.message
  end

  {
    statusCode: 200,
    body: JSON.generate(body)
  }
end
