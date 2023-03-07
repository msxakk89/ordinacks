
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.3.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "utils :: asci2buff -> can convert ascii to buffer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        
        const deployer = accounts.get('wallet_1')!.address;
        const expected_buffer = "0x3134507857567a48704b33774a64427348594d595952457041626344796741707442"
        let block = chain.mineBlock([
            Tx.contractCall(
                'utils',
                'asci2buff',
                [types.ascii("14PxWVzHpK3wJdBsHYMYYREpAbcDygAptB")],
                deployer
            )
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        assertEquals(block.receipts[0].result, expected_buffer)
    },
});


Clarinet.test({
    name: "utils :: to-p2pkh -> can convert buffer of secp256k1 pub key to btc address",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!.address;
        const inbuff = new Uint8Array('028ba67a0bdd0a9f657d5dcb4d97cf24ed8bfdb1c6b304301fc656da0e30dcc0fb'.match(/../g).map(h=>parseInt(h,16))).buffer
        const expected = '(ok "1CBq2cQY2yX64bXDxKWxCj6z8jsyFkmLSs")'
        let block = chain.mineBlock([
            Tx.contractCall(
                'utils',
                'to-p2pkh',
                [types.buff(inbuff)],
                deployer
            )
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        //console.log(block.receipts[0])
        assertEquals(block.receipts[0].result, expected)
    },
});