{ exec } = require 'child_process'
option '-r', '--run', 'run the application after build is complete'

task 'build', 'Build projects from src/*.coffee to output/*.js', (options) ->
	exec 'coffee --compile --output output/ src/', (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
	if options.run
		exec 'node output/app.js', (err, stdout, stderr) ->
			throw err if err
			console.log stdout + stderr	
		console.log 'socket.io can be included from http://localhost:8000/socket.io/socket.io.js'
