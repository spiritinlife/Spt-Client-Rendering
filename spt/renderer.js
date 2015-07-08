//<script>
	document.addEventListener('DOMContentLoaded',function(e){	
	
		var t0 = performance.now();


		var dataReduce = JSON.parse(document.getElementById('hidden-data').innerHTML),
			sptElems = document.getElementsByTagName("spt"),
			domElems = {}

		for (var i = sptElems.length; i--;) {
			domElems = sptElems[i].getElementsByTagName("*")
			for (var j = domElems.length; j--;) {
					reduce(domElems[j])
			}
			sptElems[i].style.display = "block"	
		}

		var t1 = performance.now();
		console.log("Rendering took " + (t1 - t0) + " milliseconds.")

		function reduce(elem){
			
				if ( typeof elem.innerHTML == 'undefined' ||  elem.innerHTML.indexOf("<script>") != -1  )
						return

				if (elem.innerHTML.indexOf("{{") != -1) {
						var html = elem.innerHTML
						elem.innerHTML  = ""
						
						for ( key in dataReduce ) {
							if (html.indexOf(key) != -1)
								elem.innerHTML = dataReduce[key]
						}
						
						if ( html.indexOf("for") != -1 ) {
						
							var toBeReplaced = html
							var matches = toBeReplaced.match(/for (.*) in (.*) '(.*) \1 (.*)'/)
							var array = dataReduce[matches[2].trim()]
							var element = []
							
							for ( var i=0; i< array.length; i++) {
									element.push(matches[3])
									element.push(array[i])
									element.push(matches[4])
							}
							elem.innerHTML = element.join("")
					
						} else if ( html.indexOf("if") != -1  ) {
							var sanitizedHtml = html.substring(2,html.length-2)
							elem.innerHTML = eval(['(function() { ',sanitizedHtml.replace(/\((.*)\)/,function(match,p1){
								return ['(',dataReduce[p1.trim()],')'].join("")
							}).replace(/return (.*)/,function(match,p1){
								return 'return "' + dataReduce[p1.trim()]+ '"'
							}),'})()'].join(""))
																 	
						}
					
					}
				}
		})
//</script>