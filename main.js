const SHA256 = require('crypto-js/sha256');

// Simple blockchain with validation
// Limitations: 
// - no mechanism to fix any broken blocks
// - no p2p aspect
// - no proof-of-work
// - doesn't check funds before transaction

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = '';
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let chrisCoin = new Blockchain();
chrisCoin.addBlock(new Block(1, "25/1/2018", { amount: 5 }));
chrisCoin.addBlock(new Block(1, "26/1/2018", { amount: 10 }));

console.log(JSON.stringify(chrisCoin, null, 4));

console.log('Is blockchain valid? ' + chrisCoin.isChainValid())

chrisCoin.chain[1].data = {amount: 100};
chrisCoin.chain[1].hash = chrisCoin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + chrisCoin.isChainValid())