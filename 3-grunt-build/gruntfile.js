module.exports = (grunt) => {
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

  const sass = require('node-sass')
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({

    clean: {
      options: {
        force: true
      },
      build: {
        src: ['dist'],
      },
    },

    sass: {
      options: {
        implementation: sass,
        sourceMap: false,
        outputStyle: 'expanded'
      },
      build: {
        expand: true,
        ext: '.css',
        cwd: 'src/assets/styles',
        src: '*.scss',
        dest: 'dist/assets/styles'
      }
    },

    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env']
      },
      build: {
        expand: true,
        cwd: 'src/assets/scripts',
        src: '*.js',
        dest: 'dist/assets/scripts'
      }
    },

    jshint: {
      build: ['src/assets/scripts/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    csslint: {
      build: ['src/assets/styles/*.scss'],
      options: {
        jshintrc: '.csslintrc'
      }
    },

    imagemin: {
      build: {
        expand: true,
        cwd: 'src/assets/images',
        src: '**',
        dest: 'dist/assets/images'
      },
      buildfont: {
        expand: true,
        cwd: 'src/assets/fonts',
        src: '**',
        dest: 'dist/assets/fonts'
      }
    },

    swigtemplates: {
      options: {
        defaultContext: data,
        templatesDir: 'src/'
      },
      build: {
        src: ['src/**/*.html'],
        dest: 'dist'
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhiteSpace: true,
        minifyCss: true,
        minifyJs: true
      },
      build: {
        expand: true,
        cwd: 'dist',
        src: '*.html',
        dest: 'dist'
      }
    },

    copy: {
      build: {
        expand: true,
        cwd: 'public/',
        src: '**',
        dest: 'dist/'
      }
    },

    useminPrepare: {
      html: 'dist/*.html',
      options: {
        dest: 'dist',
        root: ['dist', '.']
      }
    },

    usemin: {
      html: 'dist/*.html'
    },

    browserSync: {
      dev: {
        options: {
          keepalive: true,
          open: true,
          base: ["dist", "src", "public"]
        }
      },
      prod: {
        options: {
          keepalive: true,
          open: true,
          base: ["dist"]
        }
      }
    },

    watch: {
      buildScss: {
        files: 'src/assets/styles/*.scss',
        tasks: ['sass']
      },
      buildJs: {
        files: 'src/assets/scripts/*.js',
        tasks: ['babel']
      },
      buildHtml: {
        files: 'src/*.html',
        tasks: ['swigtemplates']
      }
    }

  })

  grunt.registerTask('clear', ['clean'])
  grunt.registerTask('compile', ['sass', 'swigtemplates', 'babel'])
  grunt.registerTask('lint', ['csslint'], ['jshint'])
  grunt.registerTask('serve', ['clean', 'compile', 'browserSync:dev', 'watch'])
  grunt.registerTask('build', ['clean', 'copy', 'compile', 'imagemin', 'useminPrepare', 'usemin', 'htmlmin'])
  grunt.registerTask('start', ['build', 'browserSync:prod'])
  // grunt.registerTask('deploy')
}