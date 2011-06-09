<meta noindex>

# 5 Minute Tutorial

Get a feel for Sitebricks Sitebricks if you have 5 minutes to spare!

### Responding to HTTP events

When a request comes in, you generally want to do some preparing in code before rendering a response. For example, you may retrieve information stored in a database. If we were trying to display a list of movies, this is exactly what we would want:
  
    <body>
      <ul>
         @Repeat(items=movies, var="movie")
         <li>${movie.name}</li>
      </ul>
    </body>

This template simply renders from a collection `movies` to an unordered html list (`<ul>`). On any HTTP GET (most requests are these), let's say you want to load the list of movies from a data store:

    @At("/movies")
    public class MovieList {
      private List<Movie> movies;
   
      @Get
      public void get() {
          this.movies = ... ;   //load from db
      }
  
      // getter for movies
    }

Method annotation `@Get` tells Sitebricks to use this method as an event handler for all HTTP GET requests to the `/movies` page. The method `get()` is called prior to any rendering being done, so you have the opportunity to prepare the list of of movies.

### Mapping to pretty URLs

Sometimes called "restful" URLs, the practice of constructing a resource name with everything as a path item is increasingly very popular. For example, rather than `/app/movieList.html?name=Godfather` you would use `/movie/Godfather` and specify the content type (HTML) in subsumed headers.

Sitebricks supports and encourages this scheme, not the least because it is more readable and concise:

    @At("/movie/:name")
    public class MovieDetails { .. }

The colon-prefixed part of a path will be treated as dynamic and any value is accepted. All of:

  * `/movie/Godfather`
  * `/movie/AClockworkOrange`
  * `/movie/Superman`

...will be dispatched to the `MovieDetails` page (shown above). Now if you want to do any preparing before rendering the movie's details (like fetching it from a data store) you can do it with a restful event handler:

    @At("/movie/:name")
    public class MovieDetails { 
      private Movie movie;
  
      @Get
      public void get(@Named("name") String movieTitle) { 
          this.movie = ... ;    //fetch based on 'movieTitle'
      }
    }

The portion of the URI after `/movie/` is extracted and provided as a parameter to method `get()`. Use Guice's `@Named` annotation to indicate which URI-part you are interested in.

You can, of course map multiple parts this way:

    @At("/music/:artist/songs/:song")
    public class SongsPage { 
  
      @Get
      public void get(@Named("song") String song, @Named("artist") String artist) { .. }
      ...
    }

And this would match any of:
  * `/music/nirvana/songs/teen-spirit`
  * `/music/pearljam/songs/even-flow`  
  * `/music/muse/songs/newborn`

### Responding to Form POSTs

Reading resources (like movies or song details) over HTTP typically happens with the GET request. The converse of GET, writing resources, happens using the POST request. This is typically triggered when an HTML form is filled out and _submitted_. Let's say we wanted to do just that with a blog entry:

*NewBlog.html*

    <html>
    <body>
      <form action="/blogs" method="post">
          <input name="newBlog.subject" type="text"/>
          <textarea name="newBlog.text" rows="10" cols="40"/>
   
          <input type="submit" value="post entry"/>
      </form>
    </body>
    </html>

This is a normal HTML form and has three interesting characteristics:

  * We send the data via a POST (`method="post"`) to page `/blogs`, which represents the collection of blogs
  * We have two fields named `newBlog.subject` and `newBlog.text` respectively
  * These fields will map to properties on our page class as shown below

    @At("/blogs")
    public class Blogs {
      private Blog newBlog = new Blog();
  
      @Post
      public void postEntry() {
          ...save(newBlog);      //save 'newBlog' to some data store
      }
  
      // get + set method for newBlog
    }

That's it! The fact that you specified the property paths in the form (`newBlog.subject` and `newBlog.text`) means that when method `postEntry()` is called (due to the `@Post` annotation), the values from the form fields are already bound to the `newBlog` object.

You can also have a _normal_ action for `/blogs` backed by a GET method which simply displays the list of blogs, this can coexist with the POST handler we just added:

    @At("/blogs")
    public class Blogs {
      private Blog newBlog = new Blog();
      private List<Blog> blogs;
  
      @Post
      public void postEntry() { .. }
  
      @Get
      public void listBlogs() {
          this.blogs = .. ;     //fetch from store
      }
  
      // get + set methods
    }

And `Blog` is a simple data model object with two fields:

    public class Blog {
      private String subject;
      private String text;
  
      //get + set methods
    }

Now, POSTing will result in nothing being displayed, since the `List<Blog> blogs` is only loaded in the GET handler method `listBlogs()`. One way to mitigate this is to add the same functionality in `postEntry()` (or simply invoke `listBlogs()` from it). 

However, this is a bit clunky and may not always suit your intention. For example, you may wish to redirect to another page (as per the post-and-redirect pattern) after posting an entry. This is easy to do from the POST handler (or any handler) by returning a `String`:

    @At("/blogs")
    public class Blogs {
      ...
  
      @Post
      public String postEntry() { 
           ...save(newBlog);
  
           return "/blogs";     //redirect to '/blogs' as a GET
      }
  
      @Get 
      public void listBlogs() { .. }
    }

You may return any string so long as it can be sent as a valid URI redirect. For example:

  * `/movies/clerks`
  * `http://wideplay.com`
  * `12`

.. are all valid redirections (assuming of course, that they are valid destinations).