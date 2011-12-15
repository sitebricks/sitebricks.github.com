<meta noindex>

# Request and Reply

Sitebricks provides Request and Reply 

### Request

The Request object is an abstract of a request (HTTP request, a tunneled Sitebricks RPC-over-, ...). It can be automaticly injected in a @Service or a @Show class.

	@At("/person")
	@Service
	public class PersonPage {
	
		@Get
		public Reply<?> get(Request request) {
			...
		}
	
	}

The Request can directly unmarshal an object with a specified transport.

    Person p = request.read(Person.class).as(Json.class);

Or read the request stream.
	
	OutputStream out = tmpFileOutputStream();
	req.readTo(out);
	
#### Handling Post and Get parameters

To get the values of Post and Get Parameters, the target class should declare setters for each excepted parameter.

	@At("/person")
	@Service
	public class PersonPage {
	
		private Integer id;
		
		public void setId(Integer id) {
			this.id = id;
		}
	
		@Get
		public Reply<?> get(Request request) {
			// this.id is set !
			...
		}
	
	}
	
### Reply

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

#### Response Headers

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

#### Statuses

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


#### Templates

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

See also [Template API](#template)