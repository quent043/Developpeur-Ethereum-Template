Truffle & CI/CD

L'ID des proposals est défini par l'index du mapping "_voters".

Je suis parti du principe que le vote n'était pas obligatoire.
Sinon j'aurai établi deux variables d'état comptabilisant les votes et les registered voters
et mis une condition dessu dans la fonction de comptage des votes.

Vote blanc : Vu l'implémentation du vote blanc, le cas ou plusieurs personnes votent blanc et aucun
participant ne vote pour une proposal, alors on a une nécessité de refaire le vote, et donc de
réinitialiser le booleen "hasVoted" de chaque participant.