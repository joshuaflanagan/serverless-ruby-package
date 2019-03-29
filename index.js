'use strict';

const path = require("path");
const { execSync } = require('child_process');

class PackageRubyBundlePlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'before:package:createDeploymentArtifacts': this.beforePackage.bind(this),
      'before:package:function:package': this.beforePackage.bind(this),
    };
  }

  log(message){
    this.serverless.cli.log(message, "ruby-package");
  }

  beforePackage(){
    this.warnOnUnsupportedRuntime();

    const gemRoot = "vendor/bundle/ruby/2.5.0"; //TODO: infer? configure?
    const extensionDir = `${gemRoot}/extensions/x86_64-linux/2.5.0-static/`;
    const excludeGemTests = true; //TODO: make configurable
    const identifyGemsScript = `
      require 'json'
      root = ENV['GEM_HOME']
      gems = Bundler.definition.specs_for([:default]).reject{|s| s.name=='bundler'}
      details = gems.map{|gem|
        {
          extensions: !!gem.extensions.any?,
          name: gem.full_name,
          path: gem.full_gem_path.split(root).last,
        }
      }
      puts JSON.generate(details.sort_by{|x| x[:name]})
    `

    this.serverless.service.package.excludeDevDependencies = false; // only relevant to nodejs
    this.serverless.service.package.exclude = ["**"]; // force whitelist
    this.serverless.service.package.include.push("vendor/bundle/bundler/**"); // bundler standalone files

    const gemFilePath = this.serverless.config.servicePath + "/Gemfile"
    const output = execSync(`BUNDLE_GEMFILE=${gemFilePath} bundle exec ruby`, {input: identifyGemsScript});
    const gems = JSON.parse(output)

    if (gems.some(x=>x.extensions)){
      if (process.platform != "linux"){
        this.nativeLinuxBundle();
      }
    }

    if (gems.length < 10) {
      this.log(`Bundling gems: ${gems.map(x=>x.name).join(" ")}`);
    } else {
      this.log(`Bundling ${gems.length} gems`);
    }

    gems.forEach((gem) =>{
      this.serverless.service.package.include.push(`${gemRoot}${gem.path}/**`);
      if (gem.extensions){
        this.serverless.service.package.include.push(`${extensionDir}${gem.name}/**`);
      }

      // includes that start with a ! are treated as excludes when evaluating,
      // but are ordered along with the includes. If these patterns were
      // specified as excludes, they would be evaluated first, and then the
      // includes on the gem paths would bring them back.
      this.serverless.service.package.include.push(`!${gemRoot}${gem.path}/.git/**`);
      if (excludeGemTests) {
        this.serverless.service.package.include.push(`!${gemRoot}${gem.path}/test/**`);
        this.serverless.service.package.include.push(`!${gemRoot}${gem.path}/spec/**`);
      }
    });
  }

  nativeLinuxBundle(){
    this.log(`Building gems with native extensions for linux`);
    const localPath = this.serverless.config.servicePath;
    execSync(`docker run --rm -v "${localPath}:/var/task" lambci/lambda:build-ruby2.5 bundle install --standalone --path vendor/bundle`)
  }

  warnOnUnsupportedRuntime(){
    if (this.serverless.service.provider.name != 'aws'){
      this.log(`WARNING: serverless-ruby-package has only been tested with the AWS provider. It may not work with ${this.serverless.service.provider.name}, but bug reports are welcome.`);
      return;
    }
    if (this.serverless.service.provider.runtime != 'ruby2.5'){
      this.log(`WARNING: serverless-ruby-package has only been tested with the ruby2.5 runtime. It may not work with ${this.serverless.service.provider.runtime}, but bug reports are welcome.`);
    }
  }
}

module.exports = PackageRubyBundlePlugin;
