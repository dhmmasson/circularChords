#!/bin/bash

# Compile Pug templates
pug src/*.pug --out docs -P

# Compile Sass stylesheets
sass src/style.sass docs/style.css

# Copy JavaScript files
cp src/*.js docs

exit 0