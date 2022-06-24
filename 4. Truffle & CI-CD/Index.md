#Smart contract Solidity & bonnes pratiques de sécurité

##Hypothèses

J'ai choisi de tester chaque fonction du contract et les ai organisé de cette manière:
- Un test regroupant toutes les assertions pour un cas nominal
- Un test indépendant pour chaque cas déclenchant un "revert"

Pour les cas nominaux, j'ai fait plusieurs "expect" dans chaque test, je n'ai pas fait un test par porpriété par soucis de concision.

