<meta noindex>

# Web Client

### Getting a web page

Sitebricks provides a really simple and effective API for writing HTTP clients in Java. Here is an
 example of fetching the Google home page:

    Web web = Guice.createInjector().getInstance(Web.class);

    WebResponse response = web.clientOf("http://google.com")
        .transports(String.class)
        .over(Text.class)
        .get();

    System.out.println(response.toString());

To add this library to your Maven project, add the following dependency:

    <dependency>
      <groupId>com.google.sitebricks</groupId>
      <artifactId>sitebricks</artifactId>
      <version>0.8.6-SNAPSHOT</version>
    </dependency>

### More on fetching resources

Sitebricks Client supports the common set of HTTP methods. To send a post, use the following code:

    WebResponse response = web.clientOf("http://google.com")
        .transports(String.class)
        .over(Text.class)
        .post("q=sitebricks");

Here I've posted a string containing `q=sitebricks` to the Google search page. Using the various
 transports you can post other kinds of data (like JSON or XML) marshalled from simple Java objects.
 Reading the response back is similarly trivial:

     WebResponse response = web.clientOf("http://api.twitter.com/version/statuses/public_timeline.json")
         .transports(String.class)
         .over(Text.class)
         .get();

     Tweets tweets = response.to(Tweets.class).using(Json.class);
     //...

In this example, I fetch the Twitter public timeline in JSON format. An existing Java class named
`Tweets` is populated with the data from Twitter's JSON feed. The class `Json` is a Sitebricks
 `Transport` and is bundled with the library. Sitebricks also bundles XML and Raw (byte-buffer)
transports.

  * Json.class - Backed by Jackson JSON library
  * Xml.class - Backed by XStream XML parsing library
  * Text.class - Simple `toString()`
  * Raw.class - Uses a byte-buffer to send data such as binary files

### Advanced

Sitebricks Client is powered by AHC web client and Netty and is designed to be fast and performant,
in addition to being simple and type-safe.
