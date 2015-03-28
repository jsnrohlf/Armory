module.exports = function(grunt) {

  grunt.initConfig({
    nodemon: {
      dev: {
        script: 'server/server.js',
        options: {
          ignoredFiles: [ 'README.md', 'node_modules/**' ],
          delayTime: 300,
          watch: [ 'server' ],
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });
            nodemon.once('start', function() {
              setTimeout(function() {
                require('open')('https://localhost:8000');
              }, 1500);
            });
          }
        }
      },
      exec: {
        options: {
          exec: 'less'
        }
      }
    },
    requirejs: {
      mainJS: {
        options: {
          baseUrl: 'public/js/',
          paths: {
            desktop: 'app/config/Init',
            socketio: 'empty:'
          },
          wrap: true,
          name: 'libs/almond/almond',
          preserveLicenseComments: false,
          optimize: 'uglify',
          mainConfigFile: 'public/js/app/config/Init.js',
          include: [ 'desktop' ],
          out: 'public/js/app/config/Init.min.js'
        }
      },
      mainCSS: {
        options: {
          optimizeCss: 'standard',
          cssIn: './public/css/app.css',
          out: './public/css/app.min.css'
        }
      }
    },
    jshint: {
      files: [ 'Gruntfile.js', 'public/js/app/**/*.js', '!public/js/app/**/*min.js' ],
      options: {
        globals: {
          jQuery: true,
          console: false,
          module: true,
          document: true
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [ 'server/test/*.js' ]
      }
    },
    shell: {
      copyBootstrapCSS: {
        command: 'xcopy /y /i ./public/js/libs/bootstrap/dist/css/bootstrap.css ./public/css/bootstrap.css'
      },
      copyFontAwesomeCSS: {
        command: 'xcopy /y /i ./public/js/libs/font-awesome/css/font-awesome.css ./public/css/font-awesome.css'
      },
      copyFontAwesomeFonts: {
        command: 'xcopy /y /s /i./public/js/libs/font-awesome/fonts/* ./public/fonts'
      }
    },
    copy: {
      BootstrapCSS: {
        files: [{expand: true, src: ["./public/js/libs/bootstrap/dist/css/bootstrap.css"], dest: "./public/css/bootstrap.css" }]
      },
      FontAwesomeCSS: {
        files: [{expand: true, src: ["./public/js/libs/font-awesome/css/font-awesome.css"], dest: "./public/css/font-awesome.css" }]
      },
      FontAwesomeFonts: {
        files: [{expand: true, src: ["./public/js/libs/font-awesome/fonts/*"], dest: "./public/fonts" }]
      }
    },
    less: {
      production: {
        options: {
          paths: [ 'public/css' ]
        },
        files: {
          'public/css/includes/css/custom.css': 'public/css/includes/less/custom.less'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('init', ['copy:BootstrapCSS', 'copy:FontAwesomeCSS', 'copy:FontAwesomeFonts', 'less:production', 'requirejs:mainJS', 'requirejs:mainCSS']);
  grunt.registerTask('build', ['less:production', 'requirejs:mainJS', 'requirejs:mainCSS']);
  grunt.registerTask('server', ['nodemon:dev']);
  grunt.registerTask('default', ['init', 'build']);

};
