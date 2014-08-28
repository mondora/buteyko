var gulp = require('gulp');
var http = require('http');
var static = require('node-static');
var WebSocket = require('faye-websocket');
var _ = require("lodash");
var crypto = require("crypto");
var mkdirp = require("mkdirp");
var concat = require("gulp-concat");


function buildVendorCSS(){

	gulp.src([ "bower_components/bootstrap/dist/css/bootstrap.css"]).pipe( concat("vendor.css")).pipe(gulp.dest("builds"));
}

function buildVendorJS(){
	gulp.src([ "bower_components/bootstrap/dist/js/bootstrap.js"]).pipe( concat("vendor.js")).pipe(gulp.dest("builds"));

}

function build(){
   	console.log("changing ");

	mkdirp.sync("builds");

	return gulp.src('app/**/*').pipe( gulp.dest("builds") );

}


gulp.task('default', function() {

	build();
	buildVendorCSS();
	buildVendorJS();

 	//instantiate a file server
	var file = new static.Server("./builds/", { cache: false} );


	http.createServer( function( req, res ) {
		req.on("end", function () {
            file.serve(req, res);
        }).resume();
	
	}).listen(8080, "0.0.0.0");

	// Set up WebSocket server to reload the browser
    var ws = {
        sockets: {},
        send: function (msg) {
            _.forEach(this.sockets, function (socket) {
                socket.send(msg);
            });
        }
    };
    http.createServer().on("upgrade", function (req, sock, body) {
        var key = crypto.randomBytes(16).toString("hex");
        if (WebSocket.isWebSocket(req)) {
            ws.sockets[key] = new WebSocket(req, sock, body).on("close", function () {
                delete ws.sockets[key];
            });
        }
    }).listen(8000, "0.0.0.0");

    var watcher = gulp.watch("./**/*.html" );

    watcher.on("change", _.throttle(function(){
    	
    	build().on( "end", function(){
    		ws.send("reload");
    	} );

    } ), 1000 );


});
