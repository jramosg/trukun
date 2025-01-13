# Trukun

## Overview

Trukun is a modern application designed with a robust server-client architecture. This README provides instructions for setting up and running the server and client components, as well as generating the application JAR file.

## Server

### Starting the Server

To start the server, ensure you have a running REPL in your editor or terminal. Then, execute the following commands:

```clojure
(go)
```

Once started, the API will be available at: `http://localhost:3000/api`

#### Configuration

The system configuration for the server is located in the resources/system.edn file. Ensure the configuration is properly set up before running the server.

#### Reloading Changes

To reload changes without restarting the server, use:

(reset)

## Client

Before running the client, install dependencies using:

```bash
pnpm i
```
To initialize and run the client, use the following command:

```bash
ionic serve
```
Ensure the client is connected to the server for seamless operation.

## Building the Application JAR

To generate a JAR file for the application, use the following command:

```bash
clj -Sforce -T:build all
```

This will produce a deployable JAR file, ready for production use.

## Additional Notes

Make sure all dependencies are installed and up-to-date.

Use the appropriate environment variables for production and development environments.

