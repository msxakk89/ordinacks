# Ordinacks: Avataring Bitcoin Ordinals

_This software comes with no warranty WHATSOEVER_

_Extra caution needs to be taken when sending Ordinals due to the risk losing of inscriptions. User takes full risk with sending Ordinal inscriptions_

## Background

Can you imagine [Ordinals](https://github.com/casey/ord) giving birth to Ordinacks? In 1837, Charles Darwin thought of a tree of life where leafs and branches represent species and nodes of the tree represent a point in the past where a _common ancestor_ has been split into two groups that then evolve independently.  

![Darwin's first tree of life](https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2008/04/17/DarwinSketch.article.jpg?width=620&quality=45&dpr=2&s=none)

The way it roughly works in evolution is that _entire population_ is split geographically (or otherwise) in a way that prevents breeding between the two separated groups. These gene pools then evolve independently due to differences in natural selection pressures leading to emergence of distinct, yet closely related, species.

A similar idea was recently used in movie [Avatar: The Way of Water](https://en.wikipedia.org/wiki/Avatar:_The_Way_of_Water). Colones Miles Quaritch has already died, but somehow, his psyche has been embedded in new Miles Quaritch avatar.

![Colones Miles Quaritch](https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/12/why-avatar-2-s-quaritch-is-more-dangerous-than-the-original.jpg)

Now it is important to note that an avatar of Miles Quaritch does not capture a true evolutionary process because evolution works on groups, not individuals. However, there are some notable similarities, especially the below _logical facts_. Pay attention to these as logic described in them will form the basis of __Ordinacks smart contract build on top of Stacks blockchain__:

- The avatar is directly _derived_ from the original human. This relationship is direct and provable. In some sense the human is the "mother" of the avatar.
- The avatar is _NOT a copy_ of the original human, despite obvious resemblances.
- The avatar and the human are _distinct_ and _independent_ from each other, therefore they can evolve in their own way regardless of what is going on with the other. However there is still a possibility of them influencing each other. Although this was not the case for Miles Quaritch as he was dead while his avatar was alive!

### OK but why all this fuss about humans and their avatars in the context of Ordinacks?

Ordinacks are related to Ordinals in the same way that avatars are related to humans:

- The Ordinack is derived from Ordinal via a cryptographic proof of ownership. In other words, Ordinal can give birth to Ordinacks if and only if such a cryptographic proof has been presented. Therefore, a Ordinack represents a certificate _certifying that the FIRST holder of the Stackdinal was in possession of private keys that controlled the bitcoin address holding given Ordinal inscription_.
- The Ordinack is not Ordinal and Ordinal is not Ordinacks but there is resemblance through cryptography.
- Ordinacks and Ordinals are independent. The Ordinal can change hands, and so does the Ordinacks. Therefore the only thing we can be sure of is that the first owner of Ordinacks (when it was minted) was in possession of a given Ordinals.

## Problems

What problems do Ordinacks solve?

- __Problem 1__: since Ordinals exist on L1 bitcoin chain, they cannot partake in fully expressive contracts and therefore royalties understood in the traditional sense are not possible
- __Solution__: Ordinacks can then be part of Stacks ecosystem, engage in smart contracts and be traded on secondary markets with royalties

- __Problem 2__: Ordinal inscriptions are immutable - what you write on bitcoin L1 blockchain will stay there forever
- __Solution__: NFTs point to potentially mutable data.  In case of Ordinacks, they point to definitely immutable data. If there is an error in original inscription, Ordinack that points to that inscription can be used to correct an error

- __Problem 3__: Bitcoin block space is limited. As adoption for inscriptions increases, it could drive pressure on fees  pushing up the floor on transaction costs for Ordinals
- __Solution__: Ordinacks have the potential to provide a more cost-effective and efficient way to mint and store Bitcoin-based NFTs while also helping to address some of the scalability issues.

## High-level overview of the implementation

What we are proposing here can be thought of as a "bridge" between bitcoin and stacks blockchains - a user who owns an Ordinal has a provenance to mint an Ordinack that corresponds to a particular Ordinal only if a cryptographic proof of ownership of the bitcoin address that holds the Ordinal is presented. Once this happens the Ordinack is minted together with a pointer that links it to Ordinal. This "link" between Ordinack and Ordinal is robust because (1) inscription data is immutable and exists on the most decentralised chain (Bitcoin), (2) Ordinack is created only when a proof of ownership is presented.

 _It is worth noting here that while Ordinacks can be thought of as a "bridge" from bitcoin, this is just an allegory because no burn or MultiSig custody based freezing of native bitcoin is implied at all! An Ordinack is just an "avatar" of the ordinal (an extension so to speak) and lives independently from it._  

## Practical aspects of the implementation

### Design choice

We have decided to use Clarity programming language. It is the computing engine utilised by the Stacks blockchain. The reason for this choice is that Stacks is anchored on bitcoin, making it the best choice for an Ordinals-based project. Smart contracts were developed using [Clarinet environment](https://github.com/hirosystems/clarinet).   

### Project organisation
```
├── ordinacks  
    ├── contracts
        ├── `ordinacks.clar`
        ├── `utils.clar`
    ├── settings
        ├── `Devnet.toml`
    ├── tests
        ├── `ordinacks_test.ts`
        ├── `utils_test.ts`
    ├── ``.gitignore`
    ├── `Clarinet.toml`
├── `README.md`   

```

### Using Ordinacks locally on simulated Stacks blockchain

While smart contracts have not been deployed to the main or test net yet, you can start playing around on your local simulated Stacks chain. To do this successfully you will need the following installed:

- __1__ [clarinet-cli](https://github.com/hirosystems/clarinet) (version 1.3.0)
- __2__ [stacks-gen](https://www.npmjs.com/package/stacks-gen) (version 0.8.0)
- __3__ [secp256k1](https://pypi.org/project/secp256k1/) python package (version 0.14.0)

We will use __clarinet-cli__ in order to run a blockchain simulation and deploy our _ordinacks_ and _utils_ smart contracts and we will use __stacks-gen__ to generate our private-public key pair and associated stx/btc addresses.

If you want to follow this tutorial to the full extend you will also need to own [Ordinal](https://github.com/casey/ord) and be able to __safely__ move it from one address to another. Currently the best option in terms of UTXO control are [ord](https://github.com/casey/ord) and [Sparrow](https://github.com/sparrowwallet/sparrow) wallets. You need to be careful when moving your Ordinals around because standard wallets can send them to miners as a transaction fee! It is also crucial that if you want to follow this tutorial any funds left on addresses generated with provided commands are __moved to safe storage__ when you finish as we will be generating visible and un-encrypted private keys.

Let us create mock ordinacks using the simulated Stacks blockchain:

#### Step 1: Generate a private-public key pair and associated BTC address

```
npx -q stacks-gen sk  
```

This will generate an output like this:

```
{
  "phrase": "body earn ridge deliver must uncover debate wink office chase label mean quiz gorilla wrap festival spell open you accuse siren kick perfect deer",
  "private": "2ae513b1323ad4c21711e6b81425b30ba58f461bc142f931f37cae9a563cde8201",
  "public": "03ebdb9dea05bfe35ea2b62e8dff94a9b9b47b41484977c54dedcbc28b4976267d",
  "public_uncompressed": "04ebdb9dea05bfe35ea2b62e8dff94a9b9b47b41484977c54dedcbc28b4976267d96c16d78d1f6a4415370d0b9768679727da0790fd66faaa1fe97d6f546ce3ce9",
  "stacks": "SP1ZTRV1XDHCQ99A1TPKSDXBQF5REHZ6HR6GFGQQJ",
  "stacking": "{ hashbytes: 0x7fac6c3d6c5974a541d5a796f5777970e8fcd1c1, version: 0x00 }",
  "btc": "1Ce5NWYuTuCXFVbrufzySTcphz54r5a4GH",
  "wif": "Kxf6LXgxSqqmAvL6CcR3o5KfLKB4TXAPkuDeaoFxqz1HUJKSug3j"
}
```

This command gave a lot of information but we only need:
- private key, i.e. `2ae513b1323ad4c21711e6b81425b30ba58f461bc142f931f37cae9a563cde82`
- corresponding public key in compressed format, i.e. `03ebdb9dea05bfe35ea2b62e8dff94a9b9b47b41484977c54dedcbc28b4976267d`
- btc address, i.e. `1Ce5NWYuTuCXFVbrufzySTcphz54r5a4GH`

Have you noticed something about the private key? I have purposefully excluded the `-01` appendix because it is not part of private key and will cause us trouble if we sign a message with it.

Also notice that we will only be able to generate legacy P2PKH address, so if you do send and Ordinal to this address you will pay more in fees then either SegWit or Taproot address.

#### Step 2: Send your Ordinal inscription to the BTC address generated at step 1

This depends on which wallet you use. The safest option is `ord` wallet:
```
ord wallet send --fee-rate <FEE_RATE> <ADDRESS> <INSCRIPTION_ID>
```

Make sure to use a reasonable fee as using 1sat/vB may not confirm in foreseeable future! Once transaction is confirmed you can type the generated transaction id in [mempool site](https://mempool.space/).

#### Step 3: Generate digital signature upon a string representing the Ordinal genesis transaction

This you can achieved with python `secp256k1` module:
```
python  -m secp256k1 signrec \
        -k 2ae513b1323ad4c21711e6b81425b30ba58f461bc142f931f37cae9a563cde82 \
        -m b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029
```

This will generate the signature (ignore the `1` at the end)
```
2445b9960c89bda3a6b7f48703a2eb79fb36a54da7ba19f1b166c8822c6793114710a6a12c0814e632e963c95da5cd8c53a0f3b00adb86c59112f75efd42c305 1
```

#### Step 4: Launch clarinet console to simulate Stacks blockchain
```
clarinet console
```

#### Step 5: Change yourself to non-deployer (deployer or contract owner cannot make avataring requests)
```
::set_tx_sender ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0
```

#### Step 6: Submit avataring requests
```
(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ordinacks submit-avataring-request "b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029" 0x2445b9960c89bda3a6b7f48703a2eb79fb36a54da7ba19f1b166c8822c6793114710a6a12c0814e632e963c95da5cd8c53a0f3b00adb86c59112f75efd42c305 0x03ebdb9dea05bfe35ea2b62e8dff94a9b9b47b41484977c54dedcbc28b4976267d)
```

#### Step 7: Change yourself to deployer again
```
::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

#### Step 8: Inspect submission and mint ordinack
```
(contract-call? .ordinacks inspect-request u1)
(contract-call? .ordinacks approve-submission u1)
```

### Unit tests

You can check all unit tests are O.K. with the command:

```
clarinet test
```

## Future work: how could this project be expanded in the future?

The current smart contract solution is only partly decentralised. It involves contract deployer or owner to approve ordinack avataring request. So while only users with valid signatures can submit the request, and would hold Ordinacks on decentralised chain, the issuing of avatars with the existing implementation requires a central authority to do so. The authoriser is there to check that Ordinal exists at the bitcoin address indicated by the digital signature. Therefore the solution is not fully trustless. However this is not necessary as smart contract can be developed such that it reads bitcoin chain state. Future versions of this project ought to involve changing the smart contract architecture to allow for reading of bitcoin states to circumvent the need for central approval.
