# Polar Chords
Display chords on a circular diagrams


## Installation
```bash
npm -g pug-cli sass
pug -o docs/ -P src/
sass src/style.sass docs/style.css
```

## dev
```bash
npm -g pug-cli sass
pug -w -o docs/ -P src/
sass -w src/style.sass docs/style.css
fswatch -0 src/*.js | xargs -0 -n 1 -I {} cp {} 
docs/
```