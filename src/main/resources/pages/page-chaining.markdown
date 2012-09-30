<meta noindex>

# Page Chaining

### The Problem

This is a common problem, where some state reached in one page, needs to be sent to the next page that the user is being redirected to. For example, in page 1 you gather some form data, and need to send that form data to page 2.

The traditional solution to this is to encode the data in the URL sent as a redirect to page 2. For example:

Page 1 returns a redirect to `/page2/?message=validation+failed`, and page2 can display this message as appropriate. However, this is not always suitable for several reasons:

  * It leaks information to the user
  * It adds a lot of gunk to the query string
  * Not all state may be easily encoded as a short string

So what we need is a way to do this, per-user, on the server-side. And something that is not as heavyweight as going to a persistent datastore.

### The Solution

Page chaining is Sitebricks's idiomatic support for the post-and-redirect design pattern. Of course, you don't have to use it with the POST method, alone. Let's say PizzaPage and OrderPage are two pages in a workflow:

  1. `PizzaPage` - Choose a topping
  2. `OrderPage` - Place an order for pizza

In the first page, the user chooses their toppings:

    @At("/pizza")
    public class PizzaPage {
      private Topping topping;

      @Post
      public OrderPage post() {
        return new OrderPage(topping);
      }

      ...
    }

Notice that I am returning a value from the `@Post` handler. The returned value is the target page that we want the user to be redirected to. This is type-safe and clear. Furthermore, I can return the instance of the page itself that I want Sitebricks to use to serve the request.

The `OrderPage`, when displayed to the user on redirect, will contain the topping value given to it in the `PizzaPage#post()` method:

    @At("/order")
    public class OrderPage {
      private final Topping topping;

      public OrderPage(Topping topping) {
        this.topping = topping;
      }

      @Get void order() { .. }
    }


The next time this same workflow is encountered (or if done so by another user), Sitebricks is smart enough not to use the chained value.

### Other Features

There is no requirement that the chained page needs to be created by Guice. It may or may not be. You can even return a subclass of the target page if that is useful to you (for example, an anonymous inner class).

### Limitations

This is a simple enough API, but there are some caveats to keep in mind:

  * You can only chain to pages that are mapped to a static URI, this is because Sitebricks does not know how to direct users to pages with a dynamic URI.
  * If you want to return redirects to more than one page based on a condition, then you can return `Object` (or the nearest supertype of all those pages). However, the static analyzer may warn that you're not redirecting to a valid page.
  * Page chaining requires that Sitebricks be configured with a working `FlashCache` by modifying your `AppConfig`:

        @Override
        public Injector getInjector() {
            return Guice.createInjector(new SitebricksModule() {
                @Override
                protected void configureSitebricks() {
                    // ...
                    bind(FlashCache.class).to(HttpSessionFlashCache.class)
                        .in(Singleton.class);
                    // ...
                }
            });
        }

    Here we are configuring Sitebricks to store pages between requests on the Http Session. This may be problematic for session clustering, and may increase memory usage when not serving requests.

