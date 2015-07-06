# Spt-Client-Rendering
A Client side rendering, written to work with expressjs.<br>
The difference in this library is that while you think the rendering happens in the server it does not!!
It actually <b>injects a js script</b> to every spt file along with the data that need to be rendered and it does the rendering
on the <b>client</b>.

#Is that better ? i do not know yet :)

# Language Specification

Whenever you want to use the SPT templating language you need to use the <spt></spt> tag.
The spt language has the following :

- Variable binding
- For loops 
- if/else nested ( use of eval , find better solution )
- include other spt files ( under devel because it is sychronous at this moment )


The syntax is the following
Whenever you want to add something dynamic to the page you use {{}}
- for Variable binding: it is ```{{myawesomevariable}}```
- for loops : it is ```<ul>{{for m in manymessages '<li> m </li>'}}</ul>```
- for if/else : it is ```<p>{{if (thisIsTrue) {
						return message
			} 
			else {
				return 'Oooh'
			}
		}}</p>```
- for partial spt files : it is ```@sptinclude filepath```


# USAGE
It can be used with express , see the index.js for how.
```
app.use(spt(path.join(__dirname,"public")))


app.get('/', function (req, res) {
  res.sptRender('index', {title : "Cool site", manymessages:['a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a'],thisIsTrue: false,message : 'Hellp',messages:['sdsd','aaaa','aaaa','aaaa','aaaa']});
})
```