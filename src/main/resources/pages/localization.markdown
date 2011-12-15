<meta noindex>

# Localization

Sitebricks provides i18n using an interface declaring a method (annotated with @Message) for each message to use.

    public interface UIMessages {
	
        @Message("Hello")
		String hello();
		
		@Message("Good Bye ${name}")
		String bye(@Named("name") String name);
		
    }

Note the use of ${name} to parameterize your messages.
	
The interface is to be declared in the Sitebricks Module using :

	// binds to text in @Message and Locale.getDefault()
    localize(UIMessages.class).usingDefault();  
	
Then you can simply @Inject UIMessages anywhere and start using it (directly in your template if you like).

	@At("/hello")
	@Service
	public class HelloPage {
	
		@Inject
		UIMessages messages;
	
		public Reply<String> get() {
			return messages.hello();
		}
	
	}

To declare more supported languages :

    localize(UIMessages.class).using(Locale.CANADA_FRENCH, ResourceBundle.getBundle(...));
    localize(UIMessages.class).using(Locale.SPANISH, ResourceBundle.getBundle(...));

And Sitebricks detects the preferred locale from the browser header "Accept-Language" and returns the appropriate instance of the UIMessages.
	
The resource bundles are just Maps and you can pass any kind of string/string map in so long as the key/value pairs correspond to : method_name=text (where method_name is the name of the interface method name, like hello() in UIMessages).



