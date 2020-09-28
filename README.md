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

### Metodologia de avaliação de modelos de treinamento utilizada neste trabalho

Neste trabalho, a metodologia utilizada para avaliar quais modelos de treinamento obtiveram os melhores resultados se baseou na metodologia de avaliação utilizada no artigo científico, mas com algumas alterações.

Em primeiro lugar, 100 inteiros de 32 bits sem sinal foram gerados e armazenados no arquivo `results/seeds.csv` para serem utilizados como sementes na aleatoriedade inerente à divisão do conjunto de dados, de forma que todos os modelos agora utilizam as mesmas divisões do conjunto de dados para realizarem seu treinamento e obterem seus resultados de validação e testes. Essa mudança foi feita com o intuito de permitir a replicação dos resultados obtidos, diminuir a aleatoriedade dos resultados e permitir uma forma mais justa de comparação entre diferentes modelos com diferentes hiper-parâmetros. Além disso, como o tempo de treinamento de alguns modelos pode ser consideravelmente longo, esse técnica permite que a obtenção de um resultado de validação ou teste para um mesmo modelo seja dividida em mais de uma execução, dado que um subconjunto de dados de validação e teste é fixo para uma dada semente escolhida.

Em segundo lugar, a otimização de hiper-parâmetros não pôde ser feita da mesma forma que o artigo científico, pois a quantidade de combinações de hiper-parâmetros existente não permitiria que todas as variações de hiper-parâmetros fossem testadas para um dado modelo e uma dada divisão do conjunto de dados. Dessa forma, decidiu-se que a única otimização de hiper-parâmetros feita seria na quantidade de épocas de treinamento para modelos de perceptron multicamada \(o número de épocas escolhido para treinamento na obtenção dos resultados de teste será equivalente à época em que o modelo teve a menor perda nos dados de validação\). Para os demais parâmetros, decidiu-se adotar o seguinte procedimento: várias variações de hiper-parâmetros seriam utilizadas para se obter o resultado de predição sobre os subconjuntos de validação da *primeira metade* das divisões de dados disponíveis \(50\), e as combinações de hiper-parâmetros com os resultados mais promissores em relação ao subconjunto de validação seriam testadas sobre *todos* os subconjuntos de teste disponíveis \(100\) com o intuito de se calcular os seus resultados de predição. Isso permitiria que uma gigantesca quantidade de variações de hiper-parâmetros fosse experimentada para cada modelo, com apenas as variações de hiper-parâmetros mais promissoras sendo realmente testados em todas as 100 possíveis divisões do conjunto de dados disponível. Além disso, como o escopo desse trabalho envolve menos a comparação de diferentes modelos e mais a busca por um único conjunto de hiper-parâmetros que forneça bons resultados, acreditamos que esse formato de análise seria mais adequado que àquele utilizado no artigo científico em que diferentes combinações de hiper-parâmetros poderiam ser utilizadas em diferentes divisões de dados no cálculo do resultado de teste de um modelo.

A medida utilizada para medir o desempenho de um modelo \(nos resultados de validação e teste\) foi a média dos coeficientes de correlação de Matthews \(MCC\) obtidos em cada divisão do conjunto de dados, em semelhança ao que foi feito no artigo científico.

Portanto, podemos resumir o procedimento adotado neste trabalho como sendo, para um dado conjunto de modelos com diferentes hiper-parâmetros, a obtenção dos resultados de validação para a primeira metade das sementes disponíveis e o cálculo subsequente dos resultados de teste com todas as sementes disponíveis para os modelos com as melhores médias de coeficientes de correlação de Matthews \(MCC\) para os dados de validação. Os resultados de validação influenciariam na escolha de quais modelos seriam utilizados para o cálculo de resultados de teste e também, no caso de modelos do tipo perceptron multicamada, na escolha do número de épocas de treinamento para a obtenção de resultados de teste.
