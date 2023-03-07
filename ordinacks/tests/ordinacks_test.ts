
import { Clarinet, Tx, Chain, Account, types, Buffer } from "https://deno.land/x/clarinet@v1.3.0/index.ts";
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "ordinacks :: change-contract-owner -> initially deployer can change contract owner and subsequently only contract owner can change contract owner",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!.address;
        const new_owner = accounts.get('wallet_3')!.address;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'change-contract-owner',
                [types.principal(new_owner)],
                deployer
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true)

        let block2 = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'change-contract-owner',
                [types.principal(new_owner)],
                deployer
            )
        ]);
        assertEquals(block2.height, 3);
        assertEquals(block2.receipts.length, 1);
        block2.receipts[0].result.expectErr().expectUint(105)

        let block3 = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'change-contract-owner',
                [types.principal(deployer)],
                new_owner
            )
        ]);
        assertEquals(block3.height, 4);
        assertEquals(block3.receipts.length, 1);
        block3.receipts[0].result.expectOk().expectBool(true)


    },
});

Clarinet.test({
    name: "ordinacks :: submit-avataring-request -> contract owner (whether deployer or new owner) cannot submit avataring request",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const contract_owner = accounts.get('deployer')!.address;
        const pkey = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig),
                types.buff(pkey)],
                contract_owner
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr().expectUint(2)

        const new_owner = accounts.get('wallet_5')!.address;
        let block2 = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'change-contract-owner',
                [types.principal(new_owner)],
                contract_owner
            ),
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig),
                types.buff(pkey)],
                new_owner
            )
        ]);
        assertEquals(block2.height, 3);
        assertEquals(block2.receipts.length, 2);
        block2.receipts[1].result.expectErr().expectUint(2)
    },
});

Clarinet.test({
    name: "ordinacks :: submit-avataring-request -> customer can submit avataring request when valid sig presented",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const customer = accounts.get('wallet_6')!.address;
        const pkey = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig),
                types.buff(pkey)],
                customer
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true)
    },
});

Clarinet.test({
    name: "ordinacks :: submit-avataring-request -> customer cannot submit avataring request when invalid sig presented",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const customer = accounts.get('wallet_6')!.address;
        const pkey = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig = new Uint8Array('f7e668bc3062b819ddee9fac2c2ae3bb179b8ab383bdab55b76fce9f1c22d72d2f416a956c0882fdacd1298d84089eac4ecf5343358c1ebf34d2525430f8ebc9'.match(/../g).map(h=>parseInt(h,16))).buffer
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig),
                types.buff(pkey)],
                customer
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr().expectUint(102)
    },
});

Clarinet.test({
    name: "ordinacks :: submit-avataring-request -> customer cannot submit avataring request with wrong genesis",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const customer = accounts.get('wallet_6')!.address;
        const pkey = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("1HvHPSgx51LdTAWEfey5spfYMGhTjutJuX"),
                types.buff(sig),
                types.buff(pkey)],
                customer
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr().expectUint(102)
    },
});

Clarinet.test({
    name: "ordinacks :: how-many-pending -> user can check how many avataring request are pending",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const contract_owner = accounts.get('deployer')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        const pkey2 = new Uint8Array('031c3abdea22773824ee180e0c2f03e6c813443f5ef97756d5a61a7182d6e65474'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig2 = new Uint8Array('8bfa1d9c83174c69c33d58ac0cff6ebd466b804f4821b410970b6405625f53cd038c8714c4ef3df4a44c3a1f589fa57e2490366195931b955af61fd3db8b2e53'.match(/../g).map(h=>parseInt(h,16))).buffer

        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("a9690b0944792c3dcc9fae7a8d7aaf972214af0dbc54ddb783f812562cd0becf"),
                types.buff(sig2),
                types.buff(pkey2)],
                customer2
            ),
            Tx.contractCall(
                'ordinacks',
                'how-many-pending',
                [],
                contract_owner
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 3);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectUint(2)
    },
});

Clarinet.test({
    name: "ordinacks :: check-last-request-id-reviewed -> user can check id of last reviewed request",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const contract_owner = accounts.get('deployer')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        const pkey2 = new Uint8Array('031c3abdea22773824ee180e0c2f03e6c813443f5ef97756d5a61a7182d6e65474'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig2 = new Uint8Array('8bfa1d9c83174c69c33d58ac0cff6ebd466b804f4821b410970b6405625f53cd038c8714c4ef3df4a44c3a1f589fa57e2490366195931b955af61fd3db8b2e53'.match(/../g).map(h=>parseInt(h,16))).buffer

        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("a9690b0944792c3dcc9fae7a8d7aaf972214af0dbc54ddb783f812562cd0becf"),
                types.buff(sig2),
                types.buff(pkey2)],
                customer2
            ),
            Tx.contractCall(
                'ordinacks',
                'check-last-request-id-reviewed',
                [],
                contract_owner
            ),
            Tx.contractCall(
                'ordinacks',
                'check-last-request-id',
                [],
                contract_owner
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 4);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectUint(0)
        block.receipts[3].result.expectUint(2)
    },
});

Clarinet.test({
    name: "ordinacks :: check-last-request-id-reviewed -> user can review submission",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const contract_owner = accounts.get('deployer')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        const pkey2 = new Uint8Array('031c3abdea22773824ee180e0c2f03e6c813443f5ef97756d5a61a7182d6e65474'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig2 = new Uint8Array('8bfa1d9c83174c69c33d58ac0cff6ebd466b804f4821b410970b6405625f53cd038c8714c4ef3df4a44c3a1f589fa57e2490366195931b955af61fd3db8b2e53'.match(/../g).map(h=>parseInt(h,16))).buffer

        const expected = '{approved: false, btc_address: "13f46KjSr44yLsNkbxaPFnEcHtwEyU9k3u", genesis: "b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029", pub_key: 0x02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079, requester: ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0, sig: 0x9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67}'
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("a9690b0944792c3dcc9fae7a8d7aaf972214af0dbc54ddb783f812562cd0becf"),
                types.buff(sig2),
                types.buff(pkey2)],
                customer2
            ),
            Tx.contractCall(
                'ordinacks',
                'inspect-request',
                [types.uint(1)],
                contract_owner
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 3);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        // console.log(block.receipts[2].result)
        assertEquals(block.receipts[2].result, types.some(expected))
    },
});


Clarinet.test({
    name: "ordinacks :: check-price -> customer can check avataring request submission price",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const customer = accounts.get('wallet_6')!.address;
         let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'check-price',
                [],
                customer
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectUint(5000000)
    },
});

Clarinet.test({
    name: "ordinacks :: approve-submission -> deployer or contract owner can approve submission submission",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const deployer = accounts.get('deployer')!.address;
        const owner =  accounts.get('wallet_4')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        const pkey2 = new Uint8Array('031c3abdea22773824ee180e0c2f03e6c813443f5ef97756d5a61a7182d6e65474'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig2 = new Uint8Array('8bfa1d9c83174c69c33d58ac0cff6ebd466b804f4821b410970b6405625f53cd038c8714c4ef3df4a44c3a1f589fa57e2490366195931b955af61fd3db8b2e53'.match(/../g).map(h=>parseInt(h,16))).buffer

        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("a9690b0944792c3dcc9fae7a8d7aaf972214af0dbc54ddb783f812562cd0becf"),
                types.buff(sig2),
                types.buff(pkey2)],
                customer2
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'change-contract-owner',
                [types.principal(owner)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(2)],
                owner
            ),
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 5);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectOk().expectBool(true)
        block.receipts[3].result.expectOk().expectBool(true)
        block.receipts[4].result.expectOk().expectBool(true)
    },
});

Clarinet.test({
    name: "ordinacks :: approve-submission -> random user cannot approve submission",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const random_usr = accounts.get('wallet_8')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        const pkey2 = new Uint8Array('031c3abdea22773824ee180e0c2f03e6c813443f5ef97756d5a61a7182d6e65474'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig2 = new Uint8Array('8bfa1d9c83174c69c33d58ac0cff6ebd466b804f4821b410970b6405625f53cd038c8714c4ef3df4a44c3a1f589fa57e2490366195931b955af61fd3db8b2e53'.match(/../g).map(h=>parseInt(h,16))).buffer

        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("a9690b0944792c3dcc9fae7a8d7aaf972214af0dbc54ddb783f812562cd0becf"),
                types.buff(sig2),
                types.buff(pkey2)],
                customer2
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(1)],
                random_usr
            ),
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 3);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectErr().expectUint(105)
    },
});

Clarinet.test({
    name: "ordinacks :: mint-ordinack -> deployer or owner can mint ordinacks",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const deployer = accounts.get('deployer')!.address;
        const owner =  accounts.get('wallet_4')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        const pkey2 = new Uint8Array('031c3abdea22773824ee180e0c2f03e6c813443f5ef97756d5a61a7182d6e65474'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig2 = new Uint8Array('8bfa1d9c83174c69c33d58ac0cff6ebd466b804f4821b410970b6405625f53cd038c8714c4ef3df4a44c3a1f589fa57e2490366195931b955af61fd3db8b2e53'.match(/../g).map(h=>parseInt(h,16))).buffer

        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("a9690b0944792c3dcc9fae7a8d7aaf972214af0dbc54ddb783f812562cd0becf"),
                types.buff(sig2),
                types.buff(pkey2)],
                customer2
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(2)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'mint-ordinack',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'change-contract-owner',
                [types.principal(owner)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'mint-ordinack',
                [types.uint(2)],
                owner
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 7);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectOk().expectBool(true)
        block.receipts[3].result.expectOk().expectBool(true)
        block.receipts[4].result.expectOk().expectBool(true)
        block.receipts[5].result.expectOk().expectBool(true)
        block.receipts[6].result.expectOk().expectBool(true)
        // console.log(block.receipts[0].result)
    },
});

Clarinet.test({
    name: "ordinacks :: mint-ordinack -> random user cannot mint ordinacks",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const deployer = accounts.get('deployer')!.address;
        const random_usr =  accounts.get('wallet_4')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        const pkey2 = new Uint8Array('031c3abdea22773824ee180e0c2f03e6c813443f5ef97756d5a61a7182d6e65474'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig2 = new Uint8Array('8bfa1d9c83174c69c33d58ac0cff6ebd466b804f4821b410970b6405625f53cd038c8714c4ef3df4a44c3a1f589fa57e2490366195931b955af61fd3db8b2e53'.match(/../g).map(h=>parseInt(h,16))).buffer

        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("a9690b0944792c3dcc9fae7a8d7aaf972214af0dbc54ddb783f812562cd0becf"),
                types.buff(sig2),
                types.buff(pkey2)],
                customer2
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(1)],
                random_usr
            ),
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 3);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectErr().expectUint(105)
    },
});

Clarinet.test({
    name: "ordinacks :: mint-ordinack -> ordinacks owner can trasfer ordinack to another user",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const deployer = accounts.get('deployer')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'mint-ordinack',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'transfer',
                [types.uint(1),
                types.principal(customer1),
                types.principal(customer2)],
                customer1
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 4);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectOk().expectBool(true)
        block.receipts[3].result.expectOk().expectBool(true)
        // console.log(block.receipts[0].result)
    },
});

Clarinet.test({
    name: "ordinacks :: mint-ordinack -> random user cannot trasfer ordinack belonging to another user",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const deployer = accounts.get('deployer')!.address;
        const random_usr = accounts.get('wallet_3')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'mint-ordinack',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'transfer',
                [types.uint(1),
                types.principal(customer1),
                types.principal(customer2)],
                random_usr
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 4);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectOk().expectBool(true)
        block.receipts[3].result.expectErr().expectUint(105)
        // console.log(block.receipts[0].result)
    },
});

Clarinet.test({
    name: "ordinacks :: submit-avataring-request -> customer w/o sufficiebt funds cannot submit avataring request even when valid sig presented",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const customer = accounts.get('faucet')!.address;
        const pkey = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig),
                types.buff(pkey)],
                customer
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 1);
        // console.log(block.receipts[0].result)
        block.receipts[0].result.expectErr().expectUint(1)
    },
});

Clarinet.test({
    name: "ordinacks :: standard sip009 function -> user can check owner, url, last token id",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const deployer = accounts.get('deployer')!.address;

        const customer1 = accounts.get('wallet_6')!.address;
        const pkey1 = new Uint8Array('02b5ec4495d890dc21ac98791d0d70e012c1d8e53f3a05dfe27c2732c595bd2079'.match(/../g).map(h=>parseInt(h,16))).buffer
        const sig1 = new Uint8Array('9a767ac8e410af613a7064a1eaceb67a0510916cdbb3da4dbacfaa660719e410450e55426eba067e02fc44d50af1cabf1ad2bc3f00572cf31827f544d22c6d67'.match(/../g).map(h=>parseInt(h,16))).buffer
        
        const customer2 = accounts.get('wallet_7')!.address;
        const expected_owner = "(ok (some ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0))"
        const expected_url = '(ok (some "https://ordinals.com/tx/b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"))'
        const expected_id = "(ok u1)"
        let block = chain.mineBlock([
            Tx.contractCall(
                'ordinacks',
                'submit-avataring-request',
                [types.ascii("b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029"),
                types.buff(sig1),
                types.buff(pkey1)],
                customer1
            ),
            Tx.contractCall(
                'ordinacks',
                'approve-submission',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'mint-ordinack',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'get-owner',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'get-token-uri',
                [types.uint(1)],
                deployer
            ),
            Tx.contractCall(
                'ordinacks',
                'get-last-token-id',
                [],
                deployer
            )
        ]);
        assertEquals(block.height, 2);
        assertEquals(block.receipts.length, 6);
        block.receipts[0].result.expectOk().expectBool(true)
        block.receipts[1].result.expectOk().expectBool(true)
        block.receipts[2].result.expectOk().expectBool(true)
        block.receipts[3].result.expectOk()
        block.receipts[4].result.expectOk()
        block.receipts[5].result.expectOk()
        assertEquals(block.receipts[3].result, expected_owner)
        assertEquals(block.receipts[4].result, expected_url)
        assertEquals(block.receipts[5].result, expected_id)
    },
});