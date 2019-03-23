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

    "vendor/bundle/ruby/2.5.0/gems/redis-4.1.0/**",
    "!vendor/bundle/ruby/2.5.0/gems/redis-4.1.0/.git/**",
    "!vendor/bundle/ruby/2.5.0/gems/redis-4.1.0/test/**",
    "!vendor/bundle/ruby/2.5.0/gems/redis-4.1.0/spec/**",
    "vendor/bundle/ruby/2.5.0/gems/redis-namespace-1.6.0/**",
    "!vendor/bundle/ruby/2.5.0/gems/redis-namespace-1.6.0/.git/**",
    "!vendor/bundle/ruby/2.5.0/gems/redis-namespace-1.6.0/test/**",
    "!vendor/bundle/ruby/2.5.0/gems/redis-namespace-1.6.0/spec/**",
  ]);
});
