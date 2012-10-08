<meta noindex>

# Configuration

Sitebricks support two configuration patterns :

  * Annotation : using @Show, @Service and @EmbedAs
  * Modular : using Guice like configuration
  
Differences between the two patterns are described below.

### Annotation configuration

Declaration of a basic page

    @At("/movies")
	@Show
	public class MoviesPage {
        ...
	}

This will look for a template named MoviesPage.html (or .xml or .mvel, etc., depending on the templating engine in use). If you want to customize the name of the template, you can specify it in the `@Show` annotation:

    @At("/movies")
    @Show("movies.html")
    public class MoviesPage {
          ...
    }


Declaration of a web service (or resource):
	
	@At("/actors")
	@Service
	public class ActorsService {
        ...
	}
	

There is no template backing this Sitebricks page, it is sometimes referred to as a _headless_ web service.

Declaration of brick

	@EmbedAs("Soundtrack")
	public class SoundtrackPage {
		...
	}
	
A brick is any page that can be embedded inside another page's template by specifying it using `@<name_of_brick>`. So for example, to embed the above you would use `@Soundtrack` on any XML/HTML element in your container template. Note that this only works with Sitebricks templates.

Finally to auto-scan the root package that contains all your classes:
	
	public class MyAppConfig extends SitebricksModule {
        @Override
        protected void configureSitebricks() {
            scan(Example.class.getPackage());
        }
    }
	
### Modular configuration

As an alternative to package scanning and the use annotations, Sitebricks provides a modular, declarative configuration style. You may find this preferable for several reasons:

  * Capture all page mappings in one place
  * Avoid package scanning because it loads classes that are not all pages
  * Avoid package scanning because it is slow
  * Avoid package scanning because it is unfeasible (for example, due to a security manager or in Google Appengine)
  * Package a Sitebricks library for distribution as a drop-in module

Declaration of a basic page, a service and a brick.
  
    public class MyAppConfig extends SitebricksModule {
        @Override
        protected void configureSitebricks() {
            at("/movies").show(MoviesPage.class); // basic page
			at("/actors").serve(ActorsPage.class); // service
			embed(SoundtrackPage.class).as("Soundtrack"); // brick
        }
    }


#### Scopes

Since this is just a normal Guice module, any of the at() or embed() rules for page objects can be scoped like a normal Guice binding:

    public class MyAppConfig extends SitebricksModule {
        @Override
        protected void configureSitebricks() {
            at("/movies").show(MoviesPage.class).in(Scopes.SINGLETON);
        }
    }

This ensures that the same instance of class MoviesPage services all requests in the entire application. 

#### Static resources

*Note:* this method is currently only supported for text resources.

If you are packaging a library for other users to consume as a Sitebricks module, it is sometimes useful to be able to include static resources like css or javascript.

Sitebricks allows you to declare static resources served at URI paths in the same manner as page objects. To do this you must use a slightly modified at() directive. Let's say the file you wanted to serve was bricks.css, sitting in the same package as your Sitebricks module. You can expose it at URL /static/sitebricks.css as follows:

    public class MyAppConfig extends SitebricksModule {
        @Override
        protected void configureSitebricks() {
            at("/static/sitebricks.css").export("bricks.css");
        }
    }
	
Although it is not a great idea to serve large static resources in this method, it can be good for making a simple, useful library.