# Chat simples com Sockets
## Exemplo de uso
Instale as dependências

```bash
npm i
```

### TCP
Inicie o servidor

```bash
node tcpServer.js
```

Inicie o cliente

```bash
node tcpClient.js
```

### UDP
Inicie o servidor

```bash
node udpServer.js
```

Inicie o cliente

```bash
node udpClient.js
```

No cliente você irá precisar apenas definir um nome de usuário e pode começar a enviar mensagens.

## Comandos suportados
* sum (ou +) - Realiza a soma dos números na sequência. Exemplo: "+ 10 2"
* subtraction (ou -) - Realiza a subtração dos números na sequência. Exemplo: "- 10 2"
* multiply (ou *) - Realiza a multiplicação dos números na sequência. Exemplo: "* 10 2"
* division (ou /) - Realiza a di8visão dos números na sequência. Exemplo: "/ 10 2"

## Configurações
No arquivo configuration.js você pode modificar as seguintes variáveis:
* PORT - Porta em que o servidor estara escutando
* HOST - Host do servidor
* DEBUG - Flag de debug, utilizada para verificação de erros ou informações adicionais