# ATFM
Sample blockchain network for Air Traffic Flow Management

# Featured Technology
- Hyperledger Fabric
- Node.js
- Express.js

# Running the application locally

## Prerequisites
Ensure that all the prerequisites of Hyperledger Fabric are installed on your local machine.

Homebrew
- /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
- brew --version

Git
- brew install git
- git --version

cURL
- brew install curl
- curl --version

Docker
- brew install --cask --appdir="/Applications" docker
- docker --version
- docker-compose --version

## Steps
### Docker
Ensure that your Docker is launched

### Install Fabric and Fabric Samples
Create a working directory, change directory (cd) into it, and execute a bash script on the terminal:
- mkdir workingdir
- cd workingdir
- curl -sSL https://bit.ly/2ysbOFE | bash -s

** Ensure that a 'fabric-samples' folder have been created

### Clone the atfm repo
In the same working directory, clone the repository into the folder:
- git clone https://github.com/choyweiqiang/ATFM.git

### Set up sample network
In the working directory, change directory into atfm
- cd atfm

Add the app.py file into 'fabric-samples/test-network' sub-directory
- sudo mv app.py ../fabric-samples/test-network

Add the folder 'atfm-network' into the root folder of 'fabric-samples' directory
- sudo mv atfm-network ../fabric-samples

### Run the application
In the atfm repo directory, change directory into 'fabric-samples/test-network' sub-directory, and run the file
- cd ../fabric-samples/test-network
- python3 app.py OR python app.py

Change directory into the application-javascript directory in 'fabric-samples/atfm-network'
- cd ../atfm-network/application-javascript

Install the dependencies for the application and ExpressJS
- npm install
- npm install express

Run the application
- node app.js

If successful, you should see the following:
- Successfully enrolled admin user and imported it into the wallet
- Successfully registered and enrolled user appUser and imported it into the wallet

Else, delete the wallet folder in the 'atfm-network/application-javascript' folder and re-run the application.

### Endpoints
1. http://localhost:3000/ 
- (Hello World)
2. http://localhost:3000/airflow/ 
- (GET REQUEST: Send an evaluate transaction (query) to one peer and retrieve all the current assets on the ledger)
3. http://localhost:3000/test/
- (GET REQUEST: Send a submit transaction sample request to both peers, and if both peers endorse the transaction, the endorsed proposal will be sent to the orderer to be committed by each of the peer's channel ledger)
4. http://localhost:3000/newflight
- (POST REQUEST: Send a submit transaction request to both peers, and if both peers endorse the transaction, the endorsed proposal will be sent to the orderer to be committed by each of the peer's channel ledger)
- You can use Postman or any other clients to perform this POST request.
- JSON Content: 
- {
    "id": "",
    "fromcountry": "",
    "tocountry": "",
    "airline": "",
    "plane": "",
    "route": ""
  }

### Clean Up
Exit the app.js node.js application
- Ctrl + c

** this command only works if you’re using macOS

After using the sample network, bring down the test network using network.sh script
- cd ../../test-network
- ./network.sh down
