<meta noindex>

# RESTful Web Services

This guides shows you how to build web services over HTTP.

If you followed the getting started guide, then you know how to map pages to URLs and if you did the five minute tutorial, you know how to create Java methods that handle incoming HTTP requests like GET and POST. For standard HTML use cases this is plenty. Sitebricks also allows you to serve arbitrary types of content via the same mechanism. These may be images, json objects, XML or just about anything else you might want to expose via an API.

If this is served or constructed dynamically, this kind of resource is called a web service.

### No templates

The syntax for configuring web services is very similar to web pages, the exception being that you do not have an accompanying HTML template:

    @At("/cart") @Service
    public class ShoppingService {

      @Get
      Reply<String> hello() {
        return Reply.with("hello there!");
      }
    }

Note the use of the `@Service` annotation. This tells Sitebricks not to look for a corresponding template. The other difference is that we are now required to implement an event handler for HTTP GET requests:

    @Get
    Reply<String> hello() {
      return Reply.with("hello there!");
    }

This is also fairly straightforward: you return a `Reply<String>` object with the string `"hello there!"`. By default Sitebricks is set up to serve this as a `text/plain` content type.

### Replies

The `Reply<E>` object is typed with the class of the _entity_ you want to respond with. In HTTP terms, an entity is an instance of a resource that you want to serve. For example, a shopping cart or a product item. The reply then serves as a wrapper API that generates the relevant HTTP response with the provided entity.

If I wanted to send an entity as json rather than a plain text string, I can do so by configuring the reply appropriately:

    @Get
    Reply<Product> view() {
      return Reply.with(new Product("Anti-ageing cure"))
                  .as(Json.class);
    }

In this case, the `as()` rule is given a class that implements the `Transport` interface. You can create your own transports that generate content in whatever format you like (be it JPEG or ZIP or SOAP) or you can use one of the provided transports for convenience:

  * `Xml.class` - XStream based XML transport
  * `Json.class` - Jackson based Json transport
  * `Text.class` - Calls toString() on the entity and writes a UTF-8 String


### Response Headers

Replies also allow you to set commonly used headers (such as content type) with a simple API step:

    @Get
    Reply<Product> view() {
      return Reply.with(product)
                  .as(Json.class)
                  .type("application/json+product_viewer");
    }

This overrides the default content type set by the `Json.class` transport (text/json).

Of course, you can also specify exactly what headers you want directly, with a map:

    @Get
    Reply<Product> view() {
      Map<String, String> headers = new HashMap<String, String>();
      headers.put("Content-Type", "application/json");
      headers.put("X-Shopcart-Product-ID", "123456");

      return Reply.with(product)
                  .as(Json.class)
                  .headers(headers);
    }

### Statuses

Replies allow you to set the status of a response too. If you don't set one, the status code for `OK` (200) is set by default. Otherwise you can use one of the convenience methods to both set a status and perform an action.

This sends a permanent redirect (301):

    @Get
    Reply<?> moved() {
      return Reply.saying()
                  .seeOther("http://moved.permanently.com/other");
    }

This shows resource not found error (404):

    @Get
    Reply<?> err() {
      return Reply.saying()
                  .notFound();
    }

... and so on. You can also explicitly set a status code of your own choice:

    @Get
    Reply<?> something() {
      return Reply.with("some message")
                  .status(900);
    }


### Yes templates!

If you wish, you can render templates from these web services too. Here is the syntax:

    @At("/person") @Service
    public class PersonService {

      @Get
      Reply<Person> hello() {
        return Reply.with(new Person(..))
                    .template(Person.class);
      }
    }

Here, the class `Person` is used as the template indicator. Sitebricks expects that your data model
object to be backed by a template:

    @Show("PersonTemplate.html")
    class Person {
      ...
    }

This way, we cleanly separate model/view and control logic in our web services, in a concise and
type-safe manner.
