<meta noindex>

# Web Client

Sitebricks provides a really simple and effective API for writing HTTP clients in Java. It supports
writing in both synchronous and asynchronous (non-blocking) styles. The latter form can be extremely
useful for high-performance IO. Scroll down to see examples of the Sitebricks Async web client.
 Here is an
 example of fetching the Google home page:

    Web web = Guice.createInjector().getInstance(Web.class);

    WebResponse response = web.clientOf("http://google.com")
        .transportsText()
        .get();

    System.out.println(response.toString());

To add this library to your Maven project, add the following dependency:

    <dependency>
      <groupId>com.google.sitebricks</groupId>
      <artifactId>sitebricks-client</artifactId>
      <version>0.8.7-SNAPSHOT</version>
    </dependency>

### Fetching resources

Sitebricks Client supports the common set of HTTP methods. To send a post, use the following code:

    WebResponse response = web.clientOf("http://google.com")
        .transports(String.class)
        .over(Text.class)
        .post("q=sitebricks");

Here I've posted a string containing `q=sitebricks` to the Google search page. This code can also
be written more succinctly if only transporting strings:

    WebResponse response = web.clientOf("http://google.com")
        .transportsText()
        .post("q=sitebricks");

Using the various
 transports you can post other kinds of data (like JSON or XML) marshalled from simple Java objects.
 Reading the response back is similarly trivial:

     String url = "http://api.twitter.com/version/statuses/public_timeline.json";
     WebResponse response = web.clientOf(url)
         .transportsText()
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

You can similarly add

### Advanced

Sitebricks Client is powered by AHC web client and Netty and is designed to be fast and performant,
in addition to being simple and type-safe.

### Asynchronous (Non-blocking) IO

Using non-blocking IO, Sitebricks can fetch resources in the background freeing up user threads to
do other important tasks. The fetching is performed at the hardware level and thus CPU threads do
not block while resources are being up- or down- loaded.

    ExecutorService executor = Executors.newSingleThreadExecutor();
    ListenableFuture<WebResponse> future = web.clientOf("http://sitebricks.org")
        .transportsText()
        .get(executor);

    String response = future.get().toString();

Notice that in this example, we pass in a threadpool (in the form of an `executor`) to the `get()`
 method. When the request completes, Sitebricks will populate the future with the server's response.
A future in this case is a _promise_ to return the value at some point in the future. If you call
`future.get()` as we have done in the above example, the current thread will block until the promise
is fulfilled. Here, the IO is happening asynchronously, but we're still blocking the current thread
until it completes by waiting on the future.

Instead, you may elect to be notified when the IO completes by adding a listener:

    ExecutorService executor = Executors.newSingleThreadExecutor();
    ListenableFuture<WebResponse> future = web.clientOf("http://sitebricks.org")
        .transportsText()
        .get(executor);

    future.addListener(new Runnable() {
      public void run() {
        String response = future.get().toString();
      }
    }, executor);

In this example the current thread will return immediately and be available for performing other
tasks. When the response arrives, Sitebricks will call your listener on a thread backed by the
provided executor. Inside this listener, calling `future.get()` is guaranteed not to block.