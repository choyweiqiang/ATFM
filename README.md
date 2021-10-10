### ATFM
Sample blockchain network for Air Traffic Flow Management

### Featured Technology
• Hyperledger Fabric
• Node.js
• Express.js

### Running the application locally

## Prerequisites
Ensure that all the prerequisites of Hyperledger Fabric are installed on your local machine.
• Homebrew
o /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
o brew --version
• Git
o brew install git
o git --version
• cURL
o brew install curl
o curl --version
• Docker
o brew install --cask --appdir="/Applications" docker
o docker --version
o docker-compose --version

## Steps
# Docker
Ensure that your Docker is launched

# Install Fabric and Fabric Samples
Create a working directory, change directory (cd) into it, and execute a bash script on the terminal:
• mkdir workingdir
• cd workingdir
• curl -sSL https://bit.ly/2ysbOFE | bash -s

** Ensure that a 'fabric-samples' folder have been created

# Clone the atfm repo
In the same working directory, clone the repository into the folder:
• git clone .

# Set up sample network
In the working directory, change directory into atfm
• cd atfm

Add the app.py file into 'fabric-samples/test-network' sub-directory
• sudo mv app.py ../fabric-samples/test-network

Add the folder 'atfm-network' into the root folder of 'fabric-samples' directory
• sudo mv atfm-network ../fabric-samples

# Run the application
In the atfm repo directory, change directory into 'fabric-samples/test-network' sub-directory, and run the file
• cd ../fabric-samples/test-network
• python3 app.py OR python app.py

Change directory into the application-javascript directory in 'fabric-samples/atfm-network'
• cd ../atfm-network/application-javascript

Install the dependencies for the application and ExpressJS
• npm install
• npm install express

Run the application
• node app.js

If successful, you should see the following:
Successfully enrolled admin user and imported it into the wallet
Successfully registered and enrolled user appUser and imported it into the wallet

Else, delete the wallet folder in the 'atfm-network/application-javascript' folder and re-run the application.

# Endpoints
• http://localhost:3000/ 
o (Hello World)
• http://localhost:3000/airflow/ 
o (GET REQUEST: Send an evaluate transaction (query) to one peer and retrieve all the current assets on the ledger)
• http://localhost:3000/test/
o (GET REQUEST: Send a submit transaction sample request to both peers, and if both peers endorse the transaction, the endorsed proposal will be sent to the orderer to be committed by each of the peer's channel ledger)

# Clean Up
After using the sample network, bring down the test network using network.sh script
• cd ../../test-network
• ./network.sh down