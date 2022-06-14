# Truffle & CI/CD

**Branche Master**: Projet Vote contenant la prise en compte du vote blanc
**Branche FeatureExAequo**: Projet non terminé pour prendre en compte le vote ex aequo

## Assumptions

- L'ID des proposals est défini par l'index du mapping "__proposals".

- Je suis parti du principe que le vote n'était pas obligatoire.
Sinon j'aurai établi deux variables d'état comptabilisant les votes et les registered voters
et mis une condition d'égalité dessus dans la fonction de comptage des votes.

- Vote blanc : Vu l'implémentation du vote blanc, pour le cas ou plusieurs personnes votent blanc et aucun
participant ne vote pour une proposal, alors on a une nécessité de refaire le vote, et donc de
réinitialiser le booleen "hasVoted" de chaque participant.