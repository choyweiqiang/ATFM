import os

os.system("./network.sh up createChannel -ca")
os.system("./network.sh deployCC -ccn atfm -ccp ../atfm-network/chaincode-javascript/ -ccl javascript")