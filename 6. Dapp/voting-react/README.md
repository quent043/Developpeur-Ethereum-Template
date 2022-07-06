# Dapp Voting Project

Projet d'application décentralisée de vote utilisant la box React de Truffle, devant permettre:

- l’enregistrement d’une liste blanche d'électeurs.
- à l'administrateur de commencer la session d'enregistrement de la proposition.
- aux électeurs inscrits d’enregistrer leurs propositions.
- à l'administrateur de mettre fin à la session d'enregistrement des propositions.
- à l'administrateur de commencer la session de vote.
- aux électeurs inscrits de voter pour leurs propositions préférées.
- à l'administrateur de mettre fin à la session de vote.
- à l'administrateur de comptabiliser les votes.
- à tout le monde de consulter le résultat.

## sécurité

Pour garantir la sécurité du smart contract contre les éventuelles attaques, les mesures suivantes ont été prises:

- Pas de boucle for pour la comptabilisation des votes des proposals afin d'éviter une attaque DoS. 
l'enregistrement de proposals par les voters n'êtant pas capée. La proposition gagnante est mise à jour à chaque vote via les variables "winningProposalID" et "maxVotes" (ex-aequo non pris en compte).
- La variable "winningProposalID" n'est plus "public" afin d'en permettre la consultation qu'à la fin du vote.

## Optimisation

Afin de réduire au maximum la consommation en gas, les aménagements suivants ont été faits:

- Groupement des Variables d'état "winningProposalID" et "maxVotes" en uint64, autorisant un nombre maximal de votes ou de proposals de (2**64) - 1, jugé suffisant.
- Utilisation de "calldata" dans les arguments de fonctions
- Changement de la variable "voteCount" du struct "Proposal" de uint256 = uint64, pour rester cohérent avec "maxVotes"

