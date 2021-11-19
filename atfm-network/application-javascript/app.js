/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'atfm';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const port = 3000;

var contract;

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */
async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			contract = network.getContract(chaincodeName);

			// console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, country, and airflow arguments');
			// let result = await contract.submitTransaction('CreateAsset', 'flight3', 'Singapore', 'Flying to Bali');
			// console.log('*** Result: committed');
			// if (`${result}` !== '') {
			// 	console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			// }

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();

let core = async function (req, res, next) {
	try {
		console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
		await contract.submitTransaction('InitLedger');
		console.log('*** Result: committed');
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	} next();
};

app.use(core);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/airflow', async function (req, res, next) {
	try {
		console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
		let result = await contract.evaluateTransaction('GetAllAssets');
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		// res.status(200).json({response: prettyJSONString(result.toString())});
		res.status(200).json(JSON.parse(result));
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	} next();
});

app.use('/test', async function (req, res, next) {
	try {
		console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, country, and airflow arguments');
		let result = await contract.submitTransaction('CreateAsset', 'flight99', 'Singapore', 'Bali', 'SG Airlines', 'SG678', 'DWRP12');
		console.log('*** Result: committed');
		if (`${result}` !== '') {
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			res.status(200).json({response: prettyJSONString(result.toString())});
		}
	} catch (error) {
		console.error(`Failed to submit transaction: ${error}`);
	} next();
});

app.use('/newflight', async function (req, res, next) {
	try {
		console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, country, and airflow arguments');
		let result = await contract.submitTransaction('CreateAsset', req.body.id, req.body.fromcountry, req.body.tocountry, req.body.airline, req.body.plane, req.body.route);
		console.log('*** Result: committed');
		if (`${result}` !== '') {
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			res.status(200).json(JSON.parse(result.toString()));
		}
	} catch (error) {
		console.error(`Failed to submit transaction: ${error}`);
	} next();
});


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});