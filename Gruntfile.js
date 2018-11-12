//grungfile.js
//模块化导入函数
module.exports = function(grunt){
	// 任务配置,所有插件的配置信息
	grunt.initConfig({

		//获取package.json的信息
		pkg:grunt.file.readJSON('package.json'),
		//uglify插件的配置信息
		uglify:{
            options:{
                banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist:{
                src:'src/js/*.js',
                dest:'dist/<%=pkg.name%><%pkg.version%>.min.js'
            }
        },
        cssmin:{
        	options:{
        		mergeIntoShorthands:false,
        		roundingPrecision:-1,
        	},
        	target:{
        		files:[{
        			expand:true,
	        		cwd:'src/css',
	        		src:['*.css'],
	        		dest:'dist/css',
	        		ext:'.min.css',
        		}]
        	}
        },
        clean:{
        	dest:['dist/*'],

        },
        jshint:{
        	test:['src/js/wipe.js'],
        	options:{
        		jshintrc:'.jshintrc' //检测JS代码错误要根据此文件的设置规范进行检测，可以自己修改规则
        	}
        },
        copy: {
		    main:{
		        expand: true, 
		        cwd: 'src/',
		        src: '*.js',
		        dest: 'dist/'
		    }
		}
	});
	// 告诉grunt需要使用插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	// 告诉grunt当我们在终端中输入grunt时需要做什么
	grunt.registerTask('default',['jshint','clean','uglify']);
};