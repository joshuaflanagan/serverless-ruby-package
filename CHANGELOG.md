# Changelog

## 3.2.0

Default to ruby 3.2.

Switched to using official Amazon Linux docker images.

Removed the ability to configure your own docker image to build native gems.

## 2.7.0

No behavior changes. Switching to a version strategy that where the first two
digits match the default ruby runtime version. Additional revisions to the
package will only increment the third part of the version number.

## 1.4.0
Add support for ruby 2.7 runtime (Thank you kmfukuda)

## 1.3.0
Add support for specifying a custom docker image for building native extensions.

## 1.2.0
Add support for `CROSS_COMPILE_EXTENSIONS` environment variable.

Update lodash and mixin-deep transitive dependencies, to address security vulnerabilities.

## 1.1.2

Update js-yaml transitive dependency to address security vulnerability.

## 1.1.1

Compile gems with native extensions using docker, even when developing on linux.

## 1.1.0

Support for compiling gems with native extensions on non-linux platforms

## 1.0.1
Initial release. Includes ruby gems in your serverless package
