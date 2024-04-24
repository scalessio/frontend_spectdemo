## Requirements
Install npm and docker engine. 
To install npm and Docker Engine, follow these steps:

1) npm:

    Visit the official npm website at https://www.npmjs.com/get-npm.
    Follow the instructions provided to download and install npm for your operating system.
2) Docker Engine:

    Visit the official Docker website at https://docs.docker.com/get-docker/.
    Choose the appropriate installation method for your operating system (e.g., Docker Desktop for Windows/Mac, Docker Engine for Linux).
    Follow the instructions provided to download and install Docker Engine.

# Getting Started, run the React App
Once you have successfully installed npm and Docker Engine, you can proceed with running the React app.

To run the React app, navigate to the project directory in your terminal and execute the following command:

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser the interface of the specturm anomaly detection.


# Run backend

To run the backend, follow these steps:

1. Download the Docker container from the Docker Hub by running the following command in your terminal:

    ```bash
    docker pull scalassio/spec_monitorin
    ```

2. Once the container is downloaded, you can start it by running the following command:

    ```bash
    docker run -d scalassio/spec_monitoring
    ```

    This will start the backend container in detached mode.

Now you have successfully started the backend. You can proceed with interact with the frontend.