<meta noindex>

# Maven Usage

Sitebricks can easily be integrated into any maven project with a single dependency. Add this to
your maven `pom.xml` file:

    <dependency>
      <groupId>com.google.sitebricks</groupId>
      <artifactId>sitebricks</artifactId>
      <version>0.8.6-SNAPSHOT</version>
    </dependency>

Please note the [latest released version](http://github.com/dhanji/sitebricks) of Sitebricks, which may be
 later than the one shown above.

To use just the client, add the following dependency instead:

    <dependency>
      <groupId>com.google.sitebricks</groupId>
      <artifactId>sitebricks-client</artifactId>
      <version>0.8.6-SNAPSHOT</version>
    </dependency>

### Maven n00bs

If you've no idea how to create a Maven pom or want a quickly baked example instead. Start with the
following steps:

    mkdir myproj
    cd myproj
    curl http://sitebricks.org/example-pom.xml > pom.xml
    mvn package

This will grab our example pom and download all the required dependencies for you. If you are using
IntelliJ IDEA, Maven can create a project for you with a simple command:

    mvn idea:idea

This will create `example.ipr`, open your IDE and navigate to the `myproj` directory. You should see
it there. Eclipse users should use this command instead:

    mvn eclipse:eclipse
