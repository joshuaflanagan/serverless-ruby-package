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

  beforePackage(){
    const gemRoot = "vendor/bundle/ruby/2.5.0"; //TODO: infer? configure?
    const excludeGemTests = true; //TODO: make configurable
    const identifyGemsScript = `
      gems = Bundler.definition.specs_for([:default]).reject{|s| s.name=='bundler'}
      paths = gems.map(&:full_gem_path)
      root = ENV['GEM_HOME']
      relative = paths.map{|p| p.split(root).last}.sort
      puts relative`

    this.serverless.service.package.exclude = ["**"]; // force whitelist
    this.serverless.service.package.include.push("vendor/bundle/bundler/**"); // bundler standalone files

    const gemFilePath = this.serverless.config.servicePath + "/Gemfile"
    const output = execSync(`BUNDLE_GEMFILE=${gemFilePath} bundle exec ruby`, {input: identifyGemsScript});
    const gems = output.toString().trim().split("\n");

    if (gems.length < 10) {
      this.serverless.cli.log(`Bundling gems: ${gems.map(x=>path.basename(x)).sort().join(" ")}`);
    } else {
      this.serverless.cli.log(`Bundling ${gems.length} gems`);
    }

    gems.forEach((gem) =>{
      this.serverless.service.package.include.push(`${gemRoot}${gem}/**`);

      // includes that start with a ! are treated as excludes when evaluating,
      // but are ordered along with the includes. If these patterns were
      // specified as excludes, they would be evaluated first, and then the
      // includes on the gem paths would bring them back.
      this.serverless.service.package.include.push(`!${gemRoot}${gem}/.git/**`);
      if (excludeGemTests) {
        this.serverless.service.package.include.push(`!${gemRoot}${gem}/test/**`);
        this.serverless.service.package.include.push(`!${gemRoot}${gem}/spec/**`);
      }
    });
  }
}

module.exports = PackageRubyBundlePlugin;
