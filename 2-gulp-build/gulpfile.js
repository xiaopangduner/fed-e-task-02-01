const { dest, src, series, parallel, watch } = require('gulp')
const loadPlugins = require('gulp-load-plugins')

const browserSync = require('browser-sync')

const plugin = new loadPlugins()
const bs = browserSync.create()


const data = {
  menus: [
    {
      name: 'Home',
      link: 'index.html'
    },
    {
      name: 'About',
      link: 'about.html'
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

// 清除打包文件夹
const clean = () => {
  return src('dist')
    .pipe(plugin.clean({ force: true }))
}

// scss转换css，合并、压缩
const css = () => {
  return src('src/assets/styles/*.scss')
    .pipe(plugin.sass())
    .pipe(plugin.concat('app.min.css'))
    .pipe(plugin.autoprefixer())
    .pipe(plugin.csso())
    .pipe(dest('dist/assets/styles'))
}

// scss验证
const cssLint = () => {
  return src('src/assets/styles/*.scss')
    .pipe(plugin.sassLint())
    .pipe(plugin.sassLint.format())
    .pipe(plugin.sassLint.failOnError())
}

// js合并、转es5、压缩
const js = () => {
  return src('src/assets/scripts/*.js')
    .pipe(plugin.concat('app.min.js'))
    .pipe(plugin.babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(plugin.uglify())
    .pipe(dest('dist/assets/scripts'))
}

const jsLint = () => {
  console.log(plugin)
  return src('src/assets/scripts/*.js')
    .pipe(plugin.eslint({
      rules: {
        'my-custom-rule': 1,
        'strict': 2
      },
      globals: [
        'jQuery',
        '$'
      ],
      envs: [
        'browser'
      ]
    }))
    .pipe(plugin.eslint.format())
    .pipe(plugin.eslint.failAfterError())
}

const page = () => {
  return src("src/*.html")
    .pipe(plugin.swig({ data }, { cache: false }))
    .pipe(dest('dist'))
}

const image = () => {
  return src("src/assets/images/**")
    .pipe(plugin.imagemin())
    .pipe(dest('dist/assets/images'))
}

const fonts = () => {
  return src("src/assets/fonts/**")
    .pipe(plugin.imagemin())
    .pipe(dest('dist/assets/images'))
}

const extra = () => {
  return src("public/**")
    .pipe(dest('dist/public'))
}

const devServe = () => {
  watch("src/assets/styles/*.scss", css)
  watch("src/assets/scripts/*.js", js)
  watch("src/*.html", page)
  watch([
    'src/assets/images/**',
    'src/assets/scripts/*.js',
    'src/*.html'
  ], bs.reload)

  bs.init({
    server: {
      baseDir: ["dist", "public", "src"]
    }
  })
}

const prodServe = () => {

  bs.init({
    server: {
      baseDir: 'dist'
    }
  })
}

//上线之前执行的任务
const lint = parallel(cssLint, jsLint)

const build = parallel(css, page, js, fonts, image, extra)

const serve = series(css, page, js, devServe)

const publish = () => {
  return src('dist/**/*')
    .pipe(plugin.ghPages())
}

const start = series(build, prodServe)

const deploy = series(build, publish)

module.exports = {
  clean,
  lint,
  serve,
  build,
  start,
  deploy
}