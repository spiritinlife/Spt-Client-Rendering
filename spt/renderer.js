//<script>
	document.addEventListener('DOMContentLoaded',function(e){	
//		var pattBasic = new RegExp(/{{\s*/);
//		var pattScript = new RegExp(/\s*<script>\s*/);
//		var pattFor = new RegExp(/{{\s*for\s*/);
//		var pattForExtractor = new RegExp(/{{\s*for\s*(.*)\s*in\s*(.*)\s*'\s*(.*)\s*\1\s*(.*)\s*'}}/);
//		var pattIf = new RegExp(/{{\s*if\s*/);
		
	
		var dataReduce = JSON.parse(document.getElementById('hidden-data').innerHTML)	
//		var domHeadElems = document.head.getElementsByTagName("*")
//		var domBodyElems = document.body.getElementsByTagName("*")
		var domElems = document.querySelectorAll("spt *")

		var sptElems = document.getElementsByTagName("spt")	


//		for (var i = domHeadElems.length; i--;) {
//				reduce(domHeadElems[i])
//		}

		for (var i = domElems.length; i--;) {
				reduce(domElems[i])
		}
		
		for (var i = 0; i < sptElems.length; i++) {
				sptElems[i].style.display = "block"	
		}

	
		function reduce(elem){
			if (( typeof elem.innerHTML == 'undefined' ||  new RegExp(/\s*<script>\s*/).test(elem.innerHTML) ) )
					return
				
				if ( new RegExp(/{{\s*/).test(elem.innerHTML) ) {
					var html = elem.innerHTML.trim()
					elem.innerHTML  = ""
					
					if ( new RegExp(/{{\s*for\s*/).test(html) ) {
						var toBeReplaced = html
						var matches = toBeReplaced.match(/{{\s*for\s*(.*)\s*in\s*(.*)\s*'\s*(.*)\s*\1\s*(.*)\s*'}}/)
						var array = dataReduce[matches[2].trim()]
						for ( e in array ) {
								elem.innerHTML += matches[3] + array[e] + matches[4]
						}
					}
				
					for ( key in dataReduce ) {
							if ( new RegExp('{{\s*'+key+'\s*}}').test(html) ) {
								elem.innerHTML = dataReduce[key]
							}
					}
						
					if ( new RegExp(/{{\s*if\s*/).test(html) ) {
						var sanitizedHtml = html.substring(2,html.length-2)
						elem.innerHTML = eval('(function() { ' + sanitizedHtml.replace(/\(\s*(.*)\s*\)/,function(match,p1){
							return '('+dataReduce[p1]+')'
						}).replace(/return\s*(.*)/,function(match,p1){
							return 'return "' + dataReduce[p1.trim()]+ '"'
						}) + '})()')	
					}
				}
			}
		})
//</script>