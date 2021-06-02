# Machine learning - Heart failure - AI

Programa de aprendizado de máquina escrito em Python com o intuito de prever sobrevivência à insuficiência cardíaca.

## Pacotes utilizados

Para escrever os módulos contidos nessa parte do projeto, alguns pacotes da linguagem de programação Python foram utilizados, os quais foram instalados ou por meio do gerenciador de pacotes Pip ou já vieram na biblioteca padrão da versão de Python utilizada \(**Python 3.8.6**\). Os pacotes, bem como as versões exatas utilizadas neste projeto, estão listados abaixo.

### Pacotes da biblioteca padrão do Python 3.8.6

* `abc`;
* `argparse`;
* `ast`;
* `datetime`;
* `enum`;
* `pickle`;
* `time`;

### Pacotes instalados com o pip

* `keras`: 2.4.3;
  * `tensorflow-cpu` (backend do `keras`): 2.4.0;
* `matplotlib`: 3.3.4;
* `numpy`: 1.19.4;
* `pandas`: 1.0.1;
* `scikit-learn`: 0.23.1;

## Conjunto de dados \(*dataset*\)

O conjunto de dados \(ou *dataset*\) utilizado \(`data/data.csv`\), não é de minha autoria. Seguem, abaixo, os créditos e atribuições referentes ao conjunto de dados utilizado.

  * Nome original do conjunto de dados: `heart_failure_clinical_records_dataset.csv`
  * Dono do conjunto de dados: [Larxel](https://www.kaggle.com/andrewmvd)
  * Link para o conjunto de dados: https://www.kaggle.com/andrewmvd/heart-failure-clinical-data
  * Licença de uso do conjunto de dados: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
  * Citação ao uso original do conjunto de dados: [Davide Chicco, Giuseppe Jurman: Machine learning can predict survival of patients with heart failure from serum creatinine and ejection fraction alone. BMC Medical Informatics and Decision Making 20, 16 \(2020\).](https://bmcmedinformdecismak.biomedcentral.com/articles/10.1186/s12911-020-1023-5)
  * Aviso legal: Não foram feitas mudanças no conjunto de dados utilizado.

## Método de avaliação de modelos de treinamento utilizado no artigo científico

O [artigo científico](https://bmcmedinformdecismak.biomedcentral.com/articles/10.1186/s12911-020-1023-5) em que o conjunto de dados foi primeiramente apresentado e que buscou estudar vários aspectos do aprendizado de máquinas aplicado ao conjunto de dados utilizou um método específico para avaliar quais foram os melhores modelos de aprendizado de máquinas. Esse método consistiu em dois submétodos diferentes para modelos com otimização de hiper-parâmetros e para modelos sem otimização de hiper-parâmetros.

Para tipos de modelos com otimização de hiper-parâmetros, o conjunto de dados foi dividido em 60% de dados para treinamento, 20% de dados para validação e 20% de dados para teste. Primeiramente, vários modelos com diferentes hiper-parâmetros foram treinados com o subconjunto de dados de treinamento com o intuito de encontrar o conjunto de hiper-parâmetros que gerasse o melhor coeficiente de correlação de Matthews \(MCC\) relativo à previsão feita sobre o subconjunto de dados de validação. Esse conjunto de hiper-parâmetros então foi utilizado em um novo modelo, treinado com o subconjunto de dados de treinamento, para obter o coeficiente de correlação de Matthews \(MCC\) relativo à previsão feita sobre o subconjunto de dados de teste. Esse procedimento foi realizado sobre 100 diferentes partições do conjunto de dados, para que a média e mediana dos 100 resultados de coeficiente de correlação de Matthews \(MCC\) relativos às previsões feitas sobre os subconjuntos de dados de teste com aquele tipo de modelo fossem calculados.

Para tipos de modelos sem otimização de hiper-parâmetros, o conjunto de dados foi dividido em 80% de dados para treinamento e 20% de dados para teste. Um modelo foi treinado com o subconjunto de dados de treinamento para obter o coeficiente de correlação de Matthews \(MCC\) relativo à previsão feita sobre o subconjunto de dados de teste. Esse procedimento foi realizado sobre 100 diferentes partições do conjunto de dados, para que a média e mediana dos 100 resultados de coeficiente de correlação de Matthews \(MCC\) relativos às previsões feitas sobre os subconjuntos de dados de teste com aquele tipo de modelo fossem calculados.

## Método de avaliação de modelos de treinamento utilizado neste trabalho

Neste trabalho, o método utilizado para avaliar quais modelos de treinamento obtiveram os melhores resultados se baseou no método de avaliação utilizado no artigo científico, mas com algumas alterações.

Em primeiro lugar, 100 inteiros de 32 bits sem sinal foram gerados e armazenados no arquivo `data/seeds.csv` para serem utilizados como sementes na aleatoriedade inerente ao particionamento do conjunto de dados, de forma que todos os modelos agora utilizam as mesmas partições do conjunto de dados para realizarem seu treinamento e obterem seus resultados de validação e teste. Essa mudança foi feita com o intuito de permitir a replicação dos resultados obtidos e proporcionar uma forma mais justa de comparação entre diferentes modelos com diferentes hiper-parâmetros. Além disso, como o tempo de treinamento de alguns modelos pode ser consideravelmente longo, esse técnica permite que a obtenção de um resultado de validação ou teste para um mesmo modelo seja dividida em mais de uma execução, dado que um subconjunto de dados de validação e teste é fixo para uma dada semente escolhida.

Em segundo lugar, a otimização de hiper-parâmetros não pôde ser feita da mesma forma que o artigo científico, pois a quantidade de combinações de hiper-parâmetros existente não permitiria que todas as variações de hiper-parâmetros fossem testadas para um dado modelo e uma dada partição do conjunto de dados. Dessa forma, decidiu-se que a única otimização de hiper-parâmetros feita seria na quantidade de épocas de treinamento para modelos de perceptron multicamada. O número de épocas escolhido para treinamento na obtenção dos resultados de teste será equivalente à época em que o modelo teve a menor perda nos dados de validação \(*early stopping*\). Para os demais parâmetros, decidiu-se adotar o seguinte procedimento: várias variações de hiper-parâmetros seriam utilizadas para se obter o resultado de predição sobre os subconjuntos de validação do *primeiro quinto* das partições de dados disponíveis \(20\), e as combinações de hiper-parâmetros com os resultados mais promissores \(mais especificamente, os modelos que estiveram entre os melhores 20%\) em relação ao subconjunto de validação seriam testadas sobre *todos* os subconjuntos de teste disponíveis \(100\) com o intuito de se calcular os seus resultados de predição. Isso permitiria que uma gigantesca quantidade de variações de hiper-parâmetros fosse experimentada para cada modelo, com apenas as variações de hiper-parâmetros mais promissoras sendo realmente testadas em todas as 100 possíveis partições do conjunto de dados disponível. Além disso, como o escopo desse trabalho envolve menos a comparação de diferentes modelos e mais a busca por um único conjunto de hiper-parâmetros que forneça bons resultados, acreditamos que esse formato de análise seria mais adequado que aquele utilizado no artigo científico em que diferentes combinações de hiper-parâmetros poderiam ser utilizadas em diferentes partições de dados no cálculo do resultado de teste de um modelo.

A medida utilizada para medir o desempenho de um modelo \(nos resultados de validação e teste\) foi a média da acurácia \(*accuracy*\) obtida em cada particionamento do conjunto de dados, em oposição ao uso do coeficiente de correlação de Matthews \(MCC\) utilizado no artigo científico.

Portanto, podemos resumir o procedimento adotado neste trabalho como sendo, para um dado conjunto de modelos com diferentes hiper-parâmetros, a obtenção dos resultados de validação para o primeiro quinto das sementes disponíveis e o cálculo subsequente dos resultados de teste com todas as sementes disponíveis para os modelos entre os melhores 20% no quesito melhor média de acurácia para os dados de validação. Os resultados de validação influenciariam na escolha de quais modelos seriam utilizados para o cálculo de resultados de teste e também, no caso de modelos do tipo perceptron multicamada, na escolha do número de épocas de treinamento \(early stopping\) para a obtenção de resultados de teste.

## Hiper-parâmetros avaliados e seus resultados

Os hiper-parâmetros avaliados em cada execução foram detalhados no arquivo `results/index.txt`. Os resultados obtidos em cada execução \(salvos no formato `.csv`\) podem ser encontrados no pasta `results`.
