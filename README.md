# Machine learning - Heart failure

## Descrição

Esse projeto constitui meu Trabalho de Conclusão de Curso \(TCC\) do curso de Engenharia de computação da Universidade de Brasília. Ele consiste em um programa de aprendizado de máquina com o objetivo de prever insuficiência cardíaca com base em dados do paciente e de um website para permitir a um profissional médico cadastrar os dados do paciente e utilizar o programa de aprendizado de máquinas.

O projeto foi dividido em pastas com o intuito de facilitar a navegação. Cada pasta contém uma parte lógica do projeto, conforme a descrição abaixo:
  * `AI`: Programa de aprendizado de máquina com o intuito de prever insuficiência cardíaca.
  * `backend`: Backend do website auxiliar utilizado para cadastrar os dados de pacientes.
  * `frontend`: Frontend do website auxiliar utilizado para cadastrar os dados de pacientes.

## Integrantes

* Aluno orientando: André Filipe Caldas Laranjeira
* Professor orientador: Alexandre Ricardo Soares Romariz  

## AI

Programa em Python de aprendizado de máquina com o intuito de prever insuficiência cardíaca.

### Conjunto de dados \(*dataset*\)

O conjunto de dados \(ou *dataset*\) utilizado \(`data/data.csv`\), não é de minha autoria. Seguem, abaixo, os créditos e atribuições referentes ao conjunto de dados utilizado.

  * Dono do conjunto de dados: [Larxel](https://www.kaggle.com/andrewmvd)
  * Link para o conjunto de dados: https://www.kaggle.com/andrewmvd/heart-failure-clinical-data
  * Licença de uso do conjunto de dados: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
  * Citação ao uso original do conjunto de dados: [Davide Chicco, Giuseppe Jurman: Machine learning can predict survival of patients with heart failure from serum creatinine and ejection fraction alone. BMC Medical Informatics and Decision Making 20, 16 \(2020\).](https://bmcmedinformdecismak.biomedcentral.com/articles/10.1186/s12911-020-1023-5)
  * Aviso legal: Não foram feitas mudanças no conjunto de dados utilizado.

### Metodologia de avaliação de modelos de treinamento utilizada no artigo científico

O [artigo científico](https://bmcmedinformdecismak.biomedcentral.com/articles/10.1186/s12911-020-1023-5) em que o conjunto de dados foi primeiramente apresentado e que buscou estudar vários aspectos do aprendizado de máquinas aplicado ao conjunto de dados utilizou uma metodologia específica para avaliar quais foram os melhores modelos de aprendizado de máquinas. Essa metodologia consistiu em dois métodos diferentes para modelos com otimização de hiper-parâmetros e para modelos sem otimização de hiper-parâmetros.

Para tipos de modelos com otimização de hiper-parâmetros, o conjunto de dados foi dividido em 60% de dados para treinamento, 20% de dados para validação e 20% de dados para teste. Primeiramente, vários modelos com diferentes hiper-parâmetros foram treinados com o subconjunto de dados de treinamento com o intuito de encontrar o conjunto de hiper-parâmetros que gerasse o melhor coeficiente de correlação de Matthews \(MCC\) relativo à previsão feita sobre o subconjunto de dados de validação. Esse conjunto de hiper-parâmetros então foi utilizado em um novo modelo, treinado com o subconjunto de dados de treinamento, para obter o coeficiente de correlação de Matthews \(MCC\) relativo à previsão feita sobre o subconjunto de dados de teste. Esse procedimento foi realizado sobre 100 diferentes partições do conjunto de dados, para que a média e mediana dos 100 resultados de coeficiente de correlação de Matthews \(MCC\) relativos às previsões feitas sobre os subconjuntos de dados de teste com aquele tipo de modelo fossem calculados.

Para tipos de modelos sem otimização de hiper-parâmetros, o conjunto de dados foi dividido em 80% de dados para treinamento e 20% de dados para teste. Um modelo foi treinado com o subconjunto de dados de treinamento para obter o coeficiente de correlação de Matthews \(MCC\) relativo à previsão feita sobre o subconjunto de dados de teste. Esse procedimento foi realizado sobre 100 diferentes partições do conjunto de dados, para que a média e mediana dos 100 resultados de coeficiente de correlação de Matthews \(MCC\) relativos às previsões feitas sobre os subconjuntos de dados de teste com aquele tipo de modelo fossem calculados.

