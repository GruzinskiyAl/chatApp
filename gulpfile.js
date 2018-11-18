var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var rigger       = require('rigger');


gulp.task('watch', function() {
    gulp.watch([
        './dist/*.html'
    ]).on('change', browserSync.reload);
});


gulp.task('server',function(){
    browserSync({
        port: 9000,
        server: {
            baseDir: 'dist'
        }
    })
});

gulp.task('default', ['watch', 'server']);