<meta noindex>

# Decoration

Decorators can be use to achieve a standard page layout.

*Note : be aware that decoration is currently only supported by MVEL templates*

### A simple example

Create a template (Template.html)

    <html> 
        <body> 
            
			Hello
        
		    @Decorated
            <div/>

            Sitebricks is ${decoratorPageProperty} ${subclassPageProperty}

		</body> 
    </html> 

Create a new page (Extension.html)
	

    <html> 
        <body> 
            World! 

            This is ${anotherDecoratorPageProperty} ${anotherSubclassPageProperty}
        </body>
    </html> 

Declare the binding class for the template. Note that the At annotation should not be placed on the decorator.

    @Show ("Template.html")
    abstract class Decorator {
        
		public abstract String getSubclassPageProperty();

        public String getDecoratorPageProperty() {
            return "really";
        }
    
	    public String getAnotherDecoratorPageProperty() {
            return "quite";
        }
    } 
	
Declare the binding class for the page
	
    @At("/example")
	@Decorated 
    class Extension extends Decorator {
	
        @Override
        public String getSubclassPageProperty() {
            return "cool";
        }
        public String getAnotherSubclassPageProperty() {
            return "funky";
        }
    } 

In the browser, the output html source will be :

    <html> 
        
		<body> 
        
		    Hello 
			
			World!

            This is quite funky

            Sitebricks is really cool

		</body> 
</html>


  * You must use the @Decorated tag on on both the subclass and in the html decorator file.
  * The decorator page class must have a @Show annotation - leave the value blank if the file name is the same as the class name
  * Just like embedded bricks, you can only extend a decorator with pages - not headless services that e.g. output JSON or write their output directly to Respond (would like to fix this)
  * Normal pages continue to work as they previously did
  
### How to render ressources includes ?

In the Extension.html page, you may want to declare some specific CSS or JavaScript files. Use the @Require annotation to be sure it will be included.

    <html> 
		
        <head>
			@Require
		    <script type="text/javascript" src="myscript.js"></script>
		</head>
	
        <body> 
            World! 

            This is ${anotherDecoratorPageProperty} ${anotherSubclassPageProperty}
        </body>
    </html> 

The script.js ressource will be included.
