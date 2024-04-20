# Nodeapp pipeline CICD AWS test #
![image](https://github.com/asapcal/hellonodeapp/assets/44505131/d57558ab-4918-46a6-bfbe-3d7176cba87e)

- **1 - Arquitetura AWS**
  
Diagrama da Arquitetura:
- **Amazon Internet Gateway (IGW)**: Será usado para expor o app para acesso publico.
- **Amazon Virtual Private Cloud (VPC)**: Criar uma **VPC** para isolar sua aplicação. Ela deve ter sub-redes públicas e privadas.
- **OBS: Alguns dos passos abaixo só serão necessários se for usado o ECS do tipo EC2 em vez do Fargate.**
Zonas de disponibilidade: O ideal é que seja um publica e outra privada e cada qual com sua subnet.
Security Groups: Para garantir que nosso aplicativo esteja devidamente protegido, precisamos configurar algum grupo de segurança
Amazon Load Balancer: Um ALB é necessário para testar nossa implementação no final. De certa forma, é opcional no que diz respeito à discussão desta postagem do blog, mas não há graça em fazer o trabalho duro e não poder testemunhar isso no mundo real.
Amazon Auto Scaling Groups: Criar um ASG e associe-o ao template de lançamento criado na última etapa. O ASG gerencia automaticamente o escalonamento horizontal de instâncias EC2 conforme exigido pelo serviço ECS, mas dentro dos limites definidos neste bloco de recursos. 
- **ECS Cluster**: Configurar um cluster do Amazon Elastic Container Service (ECS) para gerenciar seus contêineres.
- **ECS Fargate**: Usar o serviço ECS Fargate para executar seus contêineres sem a necessidade de gerenciar servidores EC2.
- **AWS Identity and Access Management (IAM) Role**: Criar uma função IAM para que o ECS possa inicializar os contêineres (conhecida como “Task Execution Role”).
- **Amazon Elastic Container Registry (ECR)**: Armazenar suas imagens de contêiner no ECR.
- **Contêiner da Aplicação(Task)**: Implantar sua aplicação NodeJS em um contêiner, como o Docker.
- **Elastic Load Balancer (ELB)**: Configurar um balanceador de carga para distribuir o tráfego entre os contêineres.
- (Se aplicavel) **Amazon RDS** (Relational Database Service): Se a aplicação requerer um banco de dados, criar uma instância do RDS para armazenar os dados.
- (Se aplicavél) Amazon **S3**: Usar o **S3** para armazenar arquivos estáticos, como imagens ou arquivos CSS.

E oque devo fazer para implementar as melhores Práticas de **Segurança** e **FinOps**?
- **Criptografia de Armazenamento Efêmero:** Use o AWS Key Management Service (KMS) para criptografar o armazenamento efêmero usado pelos contêineres.
- **Capacidade SYS_PTRACE:** Os contêineres no Fargate suportam apenas a capacidade SYS_PTRACE para rastreamento de chamadas de sistema. Isso ajuda na depuração e segurança.
- **Grupos de Segurança:** Restrinja o tráfego de entrada e saída dos contêineres usando grupos de segurança.
- **Tokens de Autenticação:** Use tokens de autenticação para autenticar solicitações ao Fargate.
- **Monitoramento e Otimização de Recursos:** Use o CloudWatch para monitorar o uso de recursos e otimizar os custos.
- **Defina Limites de Recursos:** Defina limites de recursos para evitar gastos excessivos.
- **Automatize Escalabilidade:** Configure regras de escalabilidade automática para dimensionar os contêineres conforme necessário.
Lembre-se de ajustar essa arquitetura de acordo com os requisitos específicos da sua aplicação e considerar outras melhores práticas de segurança e FinOps.
- **Uso de IaC:** Pa um melhor controle e gerenciamento, o uso de ferramentas como Terraform ou OpenTofu para implementação desta etapa

- **2 Fluxo CI/CD:** 
Segue no repo em, **.github/workflows/cicdaws-workflow.yml**

- **3 Monitoramento do Ambiente:**
- **Amazon CloudWatch:** é uma ferramenta de monitoramento nativa da AWS que coleta e processa dados brutos do ECS em métricas legíveis e quase em tempo real.
Podemos configurar **alarmes do CloudWatch** para observar métricas específicas e executar ações com base nos valores dessas métricas em relação a limites definidos. Por exemplo, você pode receber notificações por email ou SMS quando a utilização de CPU ou memória ultrapassar um determinado limite.
Para tarefas que usam o tipo de inicialização **Fargate**, pode-se usar **CloudWatch alarmes** para ampliar e reduzir as tarefas com base em métricas como utilização de CPU e memória. Para clusters com tarefas ou serviços usando o tipo de inicialização **EC2**, podemos usar **CloudWatch alarmes** para aumentar e reduzir as instâncias do contêiner com base em métricas como reserva de memória do cluster.
Além disso, se as instâncias de contêiner foram lançadas com o **Amazon Linux AMI otimizado para Amazon ECS**, pode-se usar o **CloudWatch Logs** para visualizar os logs das instâncias de contêiner em um único local conveniente.
- **Site24x7:** oferece um **agente Docker** que se pode executar como um contêiner para detectar e rastrear automaticamente as métricas de desempenho de todos os outros contêineres em execução em sua instância EC2. Isso pode ser útil para monitorar o ECS e garantir que tudo esteja funcionando conforme o esperado.
- **AWS Management Console:** é uma interface baseada em navegador que permite gerenciar recursos do ECS dentro dos recursos da AWS. Pode-se usar o console para visualizar métricas, logs e outras informações relevantes sobre seus contêineres e tarefas.

Pode-se usar tambem o Prometheus e Grafana, precisamos fazer o seguinte:
- **Implantação do Prometheus**: Primeiro, você precisa implantar o **Prometheus** em seu cluster ECS. Você pode fazer isso criando um serviço ECS para executar o contêiner Prometheus. O Prometheus coletará métricas dos contêineres em execução no ECS, como uso de CPU, memória e outras estatísticas relevantes.
- **Configuração de metas de coleta**: No arquivo de configuração do Prometheus, defina as metas de coleta para apontar para os endpoints dos contêineres ECS que você deseja monitorar. Isso geralmente envolve especificar os endereços IP e portas dos contêineres.
- **Implantação do Grafana**: Em seguida, implante o **Grafana** em outro serviço ECS ou em uma instância EC2 separada. O Grafana é uma ferramenta de visualização que permite criar painéis personalizados para exibir métricas coletadas pelo Prometheus.
Configure o Grafana para se conectar ao Prometheus como uma fonte de dados.
- **Criação de painéis no Grafana**: No Grafana, crie painéis para exibir as métricas que você deseja monitorar. Você pode criar gráficos, tabelas e outros elementos visuais para acompanhar o desempenho do ECS. Personalize os painéis conforme necessário para atender às suas necessidades específicas.
- **Configuração de alertas**: O Grafana também permite configurar alertas com base nas métricas coletadas. Por exemplo, você pode definir alertas para notificá-lo por email ou Slack quando a utilização de CPU ou memória ultrapassar um limite específico.
- **Teste e otimização contínuos**: Após a configuração inicial, teste o monitoramento para garantir que as métricas estejam sendo coletadas corretamente e que os alertas estejam funcionando conforme esperado. Faça ajustes conforme necessário para otimizar o desempenho e a eficácia do monitoramento.

A configuração pode variar com base na sua arquitetura e nos requisitos. Precisaremos escolher a ferramenta que melhor atenda às necessidades específicas do app e automatizar o máximo possível para facilitar o monitoramento contínuo do app no ECS. 🚀


Algumas Referencias:
- https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-amazon-elastic-container-service
- https://spacelift.io/blog/terraform-ecs
- https://medium.com/@olayinkasamuel44/using-terraform-and-fargate-to-create-amazons-ecs-e3308c1b9166
- https://docs.aws.amazon.com/pt_br/AmazonECS/latest/developerguide/monitoring-automated-manual.html
- https://www.site24x7.com/pt/amazon-ecs-monitoring.html
- https://blog.betrybe.com/tecnologia/ecs-amazon-como-funciona/
- https://docs.aws.amazon.com/pt_br/AmazonECS/latest/developerguide/ecs_monitoring.html
- docs.aws.amazon.com.
- https://docs.aws.amazon.com/pt_br/AmazonECS/latest/userguide/ecs_monitoring.html

e outros..

Ainda existem muitos fatores que por falta de tempo ainda estão em refinamento como os manifestos do terraform que usei para criar a infra requerida pela pipeline, mas espero que esta solução demostre um pouco do que sei e de como posso contribuir.

Att, 

ACA
