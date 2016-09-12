## gulp-version-rev

静态资源添加版本号gulp插件

#github
https://github.com/502222517/gulp-version-rev

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
default:'v'

### replaces 替换或追加版本号  // { text:'aaa',isAppend:true} ==> isAppend为true,aaa会替换成aaa?v=f2a1662 ;isAppend为false会替换成f2a1662
Type:`Array` default:null

## Example

before：
<link rel="stylesheet" href="./styles/test.css" type="text/css" />

after：

<link rel="stylesheet" href="./styles/test.css?v=0ede2cf" type="text/css" />


