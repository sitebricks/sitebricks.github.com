<meta noindex>

# Template API

The Sitebricks Template API provides the ability to render easily any template (understand any class annotated with a @Show annotation) at any moment.

### How to use it ?

Inject a Templates instance in the class you want to use Template API.

    @Inject
    Templates templates;
	
Then call the render method

    String rendered = templates.render(TClass.class, instance);

The TClass is ANY class in the path that has an @Show annotation pointing to a template file. It's not necessary that this be a real registered page class. The instance is the context you want the template to use for filling in its expressions, typically it's an instance of the backing class for that template, but again you're free to use any object or a Map of key/value pairs too.

This API also supports any Sitebricks template type: HTML, XML, MVEL, Freemarker (.fml) and flat UTF-8 files with mvel expressions in them, based on extension.

### Using Template API with Reply API

In a @Service class, you maybe want to use Template API with [Reply API](#requestreply).

    @Get
    Reply<?> getPersons() {
        return Reply.with(persons).template(Persons.class);
    }

The argument passed to with() will be used as the backing context for the template.