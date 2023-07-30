const Plugin = require("../index");

const process = require('process');


let plugin = null;
let serverless = null;
let options = null;

beforeEach(()=>{
  serverless = {
    cli: {log: () => {}},
    config: {
      servicePath: process.cwd() + "/__tests__/demo_service"
    },
    service: {
      package: {
        include: ["handler.rb", "lib/**"],
        exclude: ["mytest.rb"]
      },
      provider: {
        name: "aws",
        runtime: "ruby2.5"
      },
      custom: {
        rubyPackage: {
          alwaysCrossCompileExtensions: false,
        }
      }
    }
  }
  options = {};

  plugin = new Plugin(serverless, options);
});

test("captures the serverless configuration", () => {
  expect(plugin.serverless).toBe(serverless);
});

test("captures the options", () => {
  expect(plugin.options).toBe(options);
});

test("hooks in before packaging deployment artifacts", () => {
  expect(Object.keys(plugin.hooks)).toContain("before:package:createDeploymentArtifacts");
});

test("hooks in before packaging an individual function", () => {
  expect(Object.keys(plugin.hooks)).toContain("before:package:function:package");
});

test("disables 'Excluding development dependencies', which only applies to node projects", () =>{
  plugin.beforePackage();
  expect(plugin.serverless.service.package.excludeDevDependencies).toBe(false);
});

test("forces whitelisting files to package by excluding all files by default", () =>{
  plugin.beforePackage();
  expect(plugin.serverless.service.package.exclude).toEqual(["**"]);
});

test("include the bundler standalone files", () => {
  plugin.beforePackage();

  expect(plugin.serverless.service.package.include).toContain("vendor/bundle/bundler/**");
});

test("preserve the includes specified in serverless configuration", () => {
  plugin.beforePackage();

  expect(plugin.serverless.service.package.include).toContain("handler.rb");
  expect(plugin.serverless.service.package.include).toContain("lib/**");
});

test("include files for each gem needed by default bundler group - excluding .git/test files", () =>{
  plugin.beforePackage();

  // asserting on entire array since order matters
  expect(plugin.serverless.service.package.include).toEqual([
    "handler.rb",
    "lib/**",
    "vendor/bundle/bundler/**",
    "vendor/bundle/ruby/3.2.0/gems/addressable-2.8.4/**",
    "!vendor/bundle/ruby/3.2.0/gems/addressable-2.8.4/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/addressable-2.8.4/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/addressable-2.8.4/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/connection_pool-2.4.1/**",
    "!vendor/bundle/ruby/3.2.0/gems/connection_pool-2.4.1/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/connection_pool-2.4.1/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/connection_pool-2.4.1/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/domain_name-0.5.20190701/**",
    "!vendor/bundle/ruby/3.2.0/gems/domain_name-0.5.20190701/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/domain_name-0.5.20190701/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/domain_name-0.5.20190701/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/ffi-1.15.5/**",
    "vendor/bundle/ruby/3.2.0/extensions/x86_64-linux/3.2.0/ffi-1.15.5/**",
    "!vendor/bundle/ruby/3.2.0/gems/ffi-1.15.5/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/ffi-1.15.5/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/ffi-1.15.5/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/ffi-compiler-1.0.1/**",
    "!vendor/bundle/ruby/3.2.0/gems/ffi-compiler-1.0.1/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/ffi-compiler-1.0.1/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/ffi-compiler-1.0.1/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/http-5.1.1/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-5.1.1/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-5.1.1/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-5.1.1/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/http-cookie-1.0.5/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-cookie-1.0.5/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-cookie-1.0.5/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-cookie-1.0.5/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/http-form_data-2.3.0/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-form_data-2.3.0/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-form_data-2.3.0/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/http-form_data-2.3.0/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/llhttp-ffi-0.4.0/**",
    "vendor/bundle/ruby/3.2.0/extensions/x86_64-linux/3.2.0/llhttp-ffi-0.4.0/**",
    "!vendor/bundle/ruby/3.2.0/gems/llhttp-ffi-0.4.0/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/llhttp-ffi-0.4.0/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/llhttp-ffi-0.4.0/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/psych-5.0.1/**",
    "vendor/bundle/ruby/3.2.0/extensions/x86_64-linux/3.2.0/psych-5.0.1/**",
    "!vendor/bundle/ruby/3.2.0/gems/psych-5.0.1/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/psych-5.0.1/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/psych-5.0.1/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/public_suffix-5.0.1/**",
    "!vendor/bundle/ruby/3.2.0/gems/public_suffix-5.0.1/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/public_suffix-5.0.1/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/public_suffix-5.0.1/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/rake-13.0.6/**",
    "!vendor/bundle/ruby/3.2.0/gems/rake-13.0.6/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/rake-13.0.6/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/rake-13.0.6/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/redis-5.0.6/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-5.0.6/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-5.0.6/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-5.0.6/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/redis-client-0.14.1/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-client-0.14.1/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-client-0.14.1/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-client-0.14.1/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/redis-namespace-1.11.0/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-namespace-1.11.0/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-namespace-1.11.0/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/redis-namespace-1.11.0/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/stringio-3.0.4/**",
    "vendor/bundle/ruby/3.2.0/extensions/x86_64-linux/3.2.0/stringio-3.0.4/**",
    "!vendor/bundle/ruby/3.2.0/gems/stringio-3.0.4/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/stringio-3.0.4/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/stringio-3.0.4/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/unf-0.1.4/**",
    "!vendor/bundle/ruby/3.2.0/gems/unf-0.1.4/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/unf-0.1.4/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/unf-0.1.4/spec/**",
    "vendor/bundle/ruby/3.2.0/gems/unf_ext-0.0.8.2/**",
    "vendor/bundle/ruby/3.2.0/extensions/x86_64-linux/3.2.0/unf_ext-0.0.8.2/**",
    "!vendor/bundle/ruby/3.2.0/gems/unf_ext-0.0.8.2/.git/**",
    "!vendor/bundle/ruby/3.2.0/gems/unf_ext-0.0.8.2/test/**",
    "!vendor/bundle/ruby/3.2.0/gems/unf_ext-0.0.8.2/spec/**"
  ]);
});
