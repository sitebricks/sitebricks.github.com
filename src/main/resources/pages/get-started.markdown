<meta noindex>

# Getting Started
Sitebricks is available through Maven and releases are published to Central fairly often.

### Using Maven
You can add a dependency on Sitebricks in your Maven project.

    <dependency>
      <groupId>com.google.sitebricks</groupId>
      <artifactId>sitebricks</artifactId>
      <version>0.8.5</version>
    </dependency>


At the time of writing, *0.8.5* is the most recent release version. *0.8.6-SNAPSHOT* is the current
development version. If you want the features in it, you should build from source instead.

### Building from source
To build from source you will need Maven 2.2.1 and git installed.

First check out the sources from Github:

    git clone https://github.com/dhanji/sitebricks.git sitebricks

Now build Sitebricks and install it in your local Maven repository.

    cd sitebricks
    mvn install

If everything is successful, you should have a copy of Sitebricks snapshot jars in your local
 repository. Remember to use the snapshot version in your pom.xml:

    <dependency>
      <groupId>com.google.sitebricks</groupId>
      <artifactId>sitebricks</artifactId>
      <version>0.8.6-SNAPSHOT</version>
    </dependency>

If you have no idea how to create a Maven `pom.xml`, check out the [Maven Guide](#maven).

### What next?
You will place your compiled classes inside the WEB-INF/ directory in another dir called classes. You may place html templates side by side with the classes OR in the root (where `Example.html` resides) of the webapp as you like.

We'll take the following steps to write a web application in Sitebricks:
  * Create a Guice injector, configuring Sitebricks and Guice Servlet
  * Create a page object in `Example.java` to back an HTML template called `Example.html`
  * Customize the page to give it some dynamic behavior

### Configuring Sitebricks
First let's create and configure our Guice injector. This is done via a `ServletContextListener` that runs once right after the webapp is deployed. Let's call this `MyGuiceCreator` and place it in the `org.example.web` package:


    package org.sitebricks.example;

    public class AppConfig extends GuiceServletContextListener {

        @Override
        public Injector getInjector() {
            return Guice.createInjector(new SitebricksModule());
        }
    }


This tells Guice to route all incoming requests to Sitebricks (if Sitebricks cannot handle them,
 they will be handed back to the normal servlet pipeline as per web.xml). This also lets us take
 advantage of Guice's powerful web-scopes functionality.

OK, so far so good. Now we need to tell Sitebricks what packages to scan for pages. This is done
by adding another step to `AppConfig`:


    @Override
    public Injector getInjector() {
        return Guice.createInjector(new SitebricksModule() {
            @Override
            protected void configureSitebricks() {
                // scan class Example's package and all descendants
                scan(Example.class.getPackage());
            }
        });
    }


Now register this and `GuiceFilter` in your web.xml. It should look as follows:


    <filter>
        <filter-name>webFilter</filter-name>
        <filter-class>com.google.inject.servlet.GuiceFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>webFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <listener>
        <listener-class>org.sitebricks.example.AppConfig</listener-class>
    </listener>


### My First Web Page
Now let's create class `Example` that we just talked about:


    @At("/")
    public class Example {
      private String message = "Hello";

      public String getMessage() { return message; }
    }


The `@At` annotation tells Sitebricks to expose this web page at url `"/"`. So if you deploy to localhost at port 8080 and visit URL `http://localhost:8080/` in a browser, page `Example` will appear.

_Note: This annotation is detected by scanning packages. If you don't like this, you can use the alternate [ModularConfig modular configuration approach]_

The HTML template for Example was already sitting the zip archive root. This looked as follows:


    <html>
    <body>
      @ShowIf(true)
      <p>${message} from Sitebricks!</p>
    </body>
    </html>


This is a fairly simple template that renders some text inside a `<p>` (paragraph) tag. The expression `${message}` is evaluated at runtime against an instance of Example. In our case, this evaluates to the string: `"Hello"`.

The other interesting part about this template is a _brick annotation_, named `@ShowIf`. This tells Sitebricks to convert the `<p>` tag into a brick with some dynamic behavior (in this case, shown if an expression evaluates to _true_).  The expression passed to `@ShowIf(true)` is always true (!), so the `<p>` tag and its contents are always rendered.

### Adding Some Behavior

Let's make this example a bit more interesting. First, let's make `@ShowIf` take a boolean variable read from the page object:


    @ShowIf(appear)
    <p>${message} from Sitebricks!</p>

    ...

And add it as a field to class `Example`:

    @At("/")
    public class Example {
      private boolean appear = true;
      private String message = "Hello";

      public boolean getAppear() { return appear; }
      public String getMessage() { return message; }
    }

_Note: getters for each field are needed if reading them from the template_ (Alternatively, you could make them public).

Now, the page still looks the same but the behavior is more dynamic.

### Even more behavior ;)
Now let's make this user-controllable by placing a link on the page:

    <a href="?appear=${!appear}">show/hide</a>

    @ShowIf(appear)
    <p>${message} from Sitebricks!</p>

    ...

The link *show/hide* causes a browser to request the same page but with a parameter `appear`. By placing the expression `${!appear}` next to it, we toggle the boolean value of appear in the link. Now each time the page is requested, Sitebricks will bind the value in the query string to the field `appear` in `Example`. This requires that either `appear` is public or that a setter is exposed.

    @At("/")
    public class Example {
      // ... details elided
      public void setAppear(boolean appear) { this.appear = appear; }
    }

Now run your app and try clicking the link.

That's it! Try the [5 Minute Tutorial](#5mintutorial) to see how to create your own custom bricks and handle HTTP events.