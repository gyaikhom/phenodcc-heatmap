# Production deployment of **PhenoDCC Heatmap**

The following are guidelines for production deployment of **PhenoDCC Heatmap**.
While the debug enabled Javascripts are appropriate for development, they
*must not* be used for production deployment. Furthermore, we optimise the
deployment package and server configuration to reduce data transfer and
processing latency.


## Packaging the web application

Here are the steps to generate a deployment package:

1. Either clone the Git project, or download the source code.
   Let us assume that the source code is now in `/home/user/phenodcc-heatmap/`

2. Alter the `live` Maven profile inside the `pom.xml` document to the required
   target database host and supply the necessary credential.

3. Create a temporary deployment directory where we will do the packaging.

        $ whoami
        user

        $ cd
        $ pwd
        /home/user

        $ mkdir deployment_dir
        $ cd deployment_dir
   
4. Run the bash script `how-to-deploy/package.sh` found at project source root.
   This will create a `war` file named `phenodcc-heatmap-<VERSION>.war`. Note
   that `<VERSION>` is the version specified in `pom.xml`.

        $ pwd
        /home/user/deployment_dir

        $ /home/user/phenodcc-heatmap/how-to-deploy/package.sh \
          /home/user/phenodcc-heatmap/ live

   Please note that the `live` option above is a Maven profile inside the
   `pom.xml` document. For further details on how the package is generated,
    see `how-to-deploy/package.sh` script. 


## Optimising the deployment

We are using Apache Tomcat to deploy the application. It is advisable to
improve the application load time by using gzip compression while transferring
data between server and client browser. The following options may be set in
the connector section of `conf/server.xml`:

    compression="on"
    compressionMinSize="2048"
    noCompressionUserAgents="gozilla, traviata"
    compressableMimeType="text/html,text/xml,text/css,application/javascript,application/json"


For instance, the following is a sample configuration.

    <Connector port="8080" protocol="HTTP/1.1"
        connectionTimeout="20000"
        redirectPort="8443"
        compression="on"
        compressionMinSize="2048"
        noCompressionUserAgents="gozilla, traviata"
        compressableMimeType="text/html,text/xml,text/css,application/javascript,application/json"
    />


