/*!
 * spt-engine
 * @createDate 07/06/2015
 * @author Spritinlife ( George Chailazopoulos )
 * @copyright 2015 Spritinlife ( George Chailazopoulos ) 
 * @license MIT license (MIT)
*/

'use strict'

/**
 * Module dependencies.
 * @private
 */
var fs   = require('fs'),
		util = require('util'),
		path = require('path'),
		Transform = require('stream').Transform



/**
*	Module exports
*	@public
*/
module.exports = sptEngine


/**
 * This function is a stream transformer responsible for injecting @sptinclude files into the response
 * @param   {Object}   options 
 */
function SptIncludeProcedure(options) {
  if (!(this instanceof SptIncludeProcedure))
    return new SptIncludeProcedure(options)
	
	this.directory = options.directory
  Transform.call(this, options)
}

util.inherits(SptIncludeProcedure, Transform)

/**
 * This is the function that does the magic and it does not get called by the user
 */
SptIncludeProcedure.prototype._transform = function(chunk, encoding, done) {
	var that = this
	
	chunk = new Buffer(chunk.toString().replace(/(@sptinclude) (.*)/, function(match, p, filename) {
		return fs.readFileSync(path.join(that.directory,filename + ".spt"))
	}))
	
	this.push(chunk,encoding)
	done()   
}


/**
*	Read the renderer file for fast use later
*	store the contents in renderer
*/
var renderer = ""
fs.readFile(__dirname + '/renderer.js',function (e,script) {
	if (e) return callback(new Error(e))
	renderer = script
})

/**
 * This function is exposed and it should be used as part of the expressjs middleware.
 * @param   {String}   directory	denotes the directory where the files exist
 * @returns {Function} expressjs middleware function
 */
function sptEngine(directory){
	
  if (!directory) {
    throw new TypeError('root path required')
  }

  if (typeof directory !== 'string') {
    throw new TypeError('root path must be a string')
  }

	sptEngine.directory = directory

	return function(req,res,next){
		
		/**
		 * This should be called whenever you need to render file with spt extensions
		 * @param {String} filepath The path to the spt file 
		 * @param {Object} data     All the data that the renderer need to render the requested spt file
		 */
		res.sptRender = function(filepath, data) {
    	res.setHeader('Content-Type', 'text/html; charset=UTF-8')
			var fileStream = fs.createReadStream(path.join(sptEngine.directory,filepath + ".spt"))
			
			res.write("<style>spt{ display:none; } </style>")
			
			fileStream.pipe(new SptIncludeProcedure({directory:sptEngine.directory})).pipe(res, {end : false});
			
			fileStream.on('error',function(e){
				return next(new Error(e))
			})
			
			fileStream.on('end',function(){
				res.write('<div id=\'hidden-data\' style=\'display:none\'>' + JSON.stringify(data) + '</div>')
				res.end(renderer)
			})
		}
		
		return next()
	}
}


