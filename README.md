# Ordinacks

## Background

Can you imagine an [Ordinal](https://github.com/casey/ord) giving birth to Ordinacks? In 1837, Charles Darwin thought of a tree of life where leafs and branches represent species and nodes of the tree represent a point in the past where a _common ancestor_ has been split into two groups that then evolve independently.  

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

## Problem

We can rightly ask, what problem do Ordinacks solve?

If you are in a situation where you've got to prove the ownership of Ordinal, one option is to send the Ordinal to another address controlled by the same wallet. If no one knows that it will move to the new address and announcement is made by the owner beforehand (that Ordinal will move to a given address) then this proves the ownership. However this method is not recommended as it is likely to cost substantial amounts, as bitcoin network congestion increases with time. Moreover, if someone else knows about the destination address, and makes an announcement it is possible that ownership assignment becomes compromised.    

The second option is to apply digital signature upon some arbitrary message, together with the corresponding public address. This is a cost effective way to prove the ownership of Ordinal, once it is confirmed that the Ordinal exists at the address. However, this method lacks traceability and confirmation. Moreover, since Ordinals exist on L1 bitcoin chain, they cannot partake in fully expressive contracts and therefore royalties understood in the traditional sense (as they have been proposed and implemented in Solidity) are not possible as well. Last but not least Ordinal inscriptions are immutable - what you write on bitcoin L1 blockchain will stay there forever! This could be a shortcoming if an author of inscription wants to alter his or her creation, or else needs to be mindful of inscription content.

## Solution

What we are proposing here can be thought of as a "bridge" between bitcoin and stacks blockchains - a user who also owns Ordinal has a provenance to mint an Ordinack that corresponds to a particular Ordinal only if a cryptographic proof of ownership of the bitcoin address that holds the Ordinal is presented. Once this happens the Ordinack is minted together with a pointer that links it to Ordinal. This "link" between Ordinack and Ordinal is robust because (1) inscription data is immutable and exists on most decentralised chain, (2) Ordinack is created only when a proof of ownership is presented. Ordinacks can then be part of Stacks ecosystem, engage in smart contracts and be traded on secondary markets.

 It is worth noting here that while Ordinacks can be thought of as a "bridge" from bitcoin, this is just an allegory because no burn or MultiSig custody based freezing of native bitcoin is implied at all! An Ordinack is just an "avatar" of ordinal (an extension so to speak) and lives independently from it.   

_explain solution in more detail here_

## Business model

Whenever a proud owner of Ordinal mints an Ordinack, a fee of 25 STX is payable to contract owner. The fee can be changed by the contract owner at any time and contract owner can also bestow contract ownership to another principal.  

## Future work: how could this project be expanded in the future?

 _to be continued_

_consider these extra sections:_

`## Inspiration

## What it does

## How we built it

## Challenges we ran into

## Accomplishments that we're proud of

## What we learned

## What's next for Ordinacks`
