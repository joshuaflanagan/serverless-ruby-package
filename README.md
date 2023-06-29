# serverless-ruby-package

Teaches the [serverless framework](https://serverless.com/framework/) how to
package ruby services and their gem dependencies.

By default, `serverless` will package _all_ files in your ruby service project.
That includes test files, `node_modules`, readmes, etc. You don't need any of
those files to execute your function - they just increase the size of the package
and slow down updates. In most cases, it also won't include any rubygems that
your function depends on, so the function will not work once it is deployed.

This plugin solves those problems in a couple ways. First, it excludes _all_
files by default, forcing you to whitelist the files needed by your function
(using the `package/includes` key in `serverless.yml`). Second, it automatically
packages the gems from your default bundler group -- skipping gems from
any custom groups, like `development` or `test`. Sometimes gems themselves will
install their own test files - those will also be excluded from the package.

It also handles cross-compiling any gems with native extensions. For example,
if you are developing your service on macOS, any gems with native extensions
will be compiled locally for macOS. But to deploy to a provider like AWS Lambda,
the gems need to be compiled for linux. The plugin will automatically detect
this situation and build the extensions for linux using a local docker container.
You only need to have [docker](https://www.docker.com) installed with the daemon running.


## Usage

The plugin will make it easier to work with rubygems in your serverless project,
but it requires your project to follow some conventions:

1) Add the plugin

```
npm install --save-dev serverless-ruby-package
```

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-ruby-package
```

2) You must use [bundler](https://bundler.io/) in _standalone_ mode, with the path `vendor/bundle`:

```
bundle install --standalone --path vendor/bundle
```

3) Add the following lines to the top of your service handler file:

```ruby
load "vendor/bundle/bundler/setup.rb"
```

4) The plugin will force the `serverless` packaging step to exclude _all_ files
by default. You need to explicitly add your service handler file to `serverless.yml`:

```yaml
package:
  include:
    - handler.rb
```

(optional) If your service is implemented across multiple ruby files, it is
recommended that you keep your handler file in the root, and the rest of the
files in a `lib/` directory. You can make them available to your handler by
adding the following line to the top of your handler:

```ruby
# handler.rb
load "vendor/bundle/bundler/setup.rb"
$LOAD_PATH.unshift(File.expand_path("lib", __dir__))
```

You will also need to edit your `serverless.yml` `package` settings to include
those files:

```yaml
package:
  include:
    - handler.rb
    - lib/**
```

## Verify

Build your package to confirm it is being built as expected:

```
serverless package
```

> Note - if you have gems with native extensions, and are not developing on
linux, make sure have docker installed and running. The first time you package
may take a really long time as the docker image is downloaded. Future packaging
will be much faster.

That will create the package that is uploaded during a `serverless deploy`, but
keep it around so you can examine it. You can use the following command to verify
it only includes the files you expect:

```
unzip -l .serverless/<servicename>.zip
```

## Configuration

By default, if any gems have native extensions, they will be compiled for the
AWS Lambda Linux using Docker.

You can override the default behavior by adding to your `serverless.yml` file:

```
custom:
  rubyPackage:
    alwaysCrossCompileExtensions: false
```

You can also override this behavior using environment variable. If you set the
environment variable, it will have precedence over the `serverless.yml` file:

```
CROSS_COMPILE_EXTENSIONS=false serverless package
```

## Development

To work on this plugin, you should first run the following in your local directory:

```
./dev_setup.sh          # configures the demo service project needed by the tests

yarn test               # run the automated test suite

./integration_test.sh   # run serverless package on the demo project and observe the results
```

### Troubleshooting the demo_service

* Make sure the version of bundler specified in the demo_service Gemfile.lock
is compatible with the version installed in the `amazon/aws-lambda-ruby:3.2`
image.

* Make sure you can invoke the function n in the docker image:

```
./invoke-service.sh
```

### Releasing a new version

* Commit a description of the changes in CHANGELOG.md

* Run `yarn publish`. It will prompt for the new version number, and npm credentials.
It will create a new commit and tag with the version number changes. Make sure
to push them.
