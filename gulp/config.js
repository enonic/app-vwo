var CONFIG = {
    gulpTasks: 'gulp/tasks/',
    root: {
        src: 'src/main/resources/site/assets',
        dest: 'build/resources/main/site/assets'
    },
    tasks: {
        css: {
            autoprefixer: {
                browsers: ['last 3 versions', 'ie 11']
            },
            maps: {},
            files: {
                common: {
                    src: '/css/app-vwo.less',
                    dest: '/css/app-vwo.css'
                }
            }
        }
    }
};

module.exports = CONFIG;
