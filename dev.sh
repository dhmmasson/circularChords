pug -w -o docs/ -P src/
sass -w src/style.sass docs/style.css
fswatch -0 src/*.js | xargs -0 -n 1 -I {} cp {} docs/