## gulp-version-rev

静态资源添加版本号gulp插件

## Installation

```bash
npm install gulp-version-rev
```

## Usage

```js
var gulp = require('gulp');
var versionRev = require('gulp-version-rev');

gulp.task('rev',function() {
    gulp.src("./test/test.html")
        .pipe(versionRev())
        .pipe(gulp.dest('./'));
});
```

## Options

### hashLen: length of hash version string
Type: `Number` default: 7

### verStr: use custom version string 
Type: `String`  
default:'?v='

## Example

before：
<link rel="stylesheet" href="./styles/test.css" type="text/css" />

after：

<link rel="stylesheet" href="./styles/test.css?v=0ede2cf" type="text/css" />


