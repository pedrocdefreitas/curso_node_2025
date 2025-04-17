import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";

function operacoesBancarias() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "operacao_atual",
        message: chalk.white.bgBlueBright.bold(
          "Olá, Bem-vindo!. Qual operação deseja realizar hoje?"
        ),
        choices: [
          "Criar conta",
          "Depositar",
          "Sacar",
          "Consultar saldo",
          "Quem é o DEV?",
          "Sair",
        ],
      },
    ])
    .then((dados) => {
      if (dados.operacao_atual == "Criar conta") {
        criarContaUser();
        return;
      } else if (dados.operacao_atual == "Depositar") {
        realizarDeposito();
        return;
      } else if (dados.operacao_atual == "Consultar saldo") {
        consultaSaldo();
        return;
      } else if (dados.operacao_atual == "Sacar") {
        sacarValores();
        return;
      } else if (dados.operacao_atual == "Quem é o DEV?") {
         inforDev();
      } else {
        sairSistema();
      }
    })
    .catch((err) => {
      console.log(err);
      throw "Deu um erro por aqui.";
    });
}

function criarContaUser() {
  console.log("Criando conta agora...");
  inquirer
    .prompt([
      {
        type: "input",
        name: "nomeConta",
        message: "Qual nome deseja para sua conta?",
      },
    ])
    .then((resposta) => {
      const nomeDaConta = resposta["nomeConta"];

      if (!fs.existsSync("./conta")) fs.mkdirSync("./conta");

      let dados = {
        saldo: 0,
      };

      if (fs.existsSync(`./conta/${nomeDaConta}.json`))
        return console.log(
          chalk.bgRed.white.bold("Conta com esse nome já existe.")
        );

      fs.writeFile(
        "./conta/" + nomeDaConta + ".json",
        JSON.stringify(dados),
        function (err) {
          if (err) {
            console.log(
              chalk.bgRed.white.bold(
                "Erro ao criar sua conta, tente novamente mais tarde!"
              )
            );
            return;
          }

          console.log(
            chalk.bgGreen.white.bold(
              `Sua conta com o nome: ${nomeDaConta}, foi criado com sucesso.`
            )
          );
          operacoesBancarias();
        }
      );
    })
    .catch((err) => {
      console.log(
        chalk.bgRed.white.bold("Deu um erro aqui, Tente novamente mais tarde.")
      );
    });
}

function realizarDeposito() {
  //Perguntar qual conta deseja depositar o valor.

  inquirer
    .prompt([
      {
        type: "input",
        name: "nomeConta",
        message: "Qual conta deseja depositar?",
      },
    ])
    .then((res) => {
      let contaInformada = res.nomeConta;

      if (fs.existsSync("./conta/" + contaInformada + ".json")) {
        inquirer
          .prompt([
            {
              type: "input",
              name: "valor_deposito",
              message: "Qual valor você deseja depositar?",
            },
          ])
          .then((valorAdepositar) => {
            let conta = JSON.parse(
              fs.readFileSync(`./conta/${contaInformada}.json`)
            );

            let novoSaldo =
              parseFloat(valorAdepositar.valor_deposito) +
              parseFloat(conta.saldo);

            conta["saldo"] = novoSaldo;

            fs.writeFileSync(
              `./conta/${contaInformada}.json`,
              JSON.stringify(conta),
              function (err) {
                if (err) return console.log(chalk.bgRed("Erro ao depositar."));
              }
            );

            console.log(
              chalk.bgGreen.bold(
                "Saldo adicionado com sucesso. Seu novo saldo é: R$" +
                  conta["saldo"]
              )
            );

            operacoesBancarias();
          });
      } else {
        console.log(chalk.bgRed("Essa conta não existe..."));
        operacoesBancarias();
      }
    });
}

function consultaSaldo() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "nomeConta",
        message: "Deseja saber o saldo de qual conta?",
      },
    ])
    .then((conta) => {
      let saldo = JSON.parse(
        fs.readFileSync(`./conta/${conta.nomeConta}.json`)
      );
      console.log(chalk.bgBlue.bold("Seu saldo é: R$ " + saldo.saldo));
      operacoesBancarias();
    });
}

function sairSistema() {
  process.exit();
}

function sacarValores() {

  inquirer.prompt([{
   type: 'input',
   name: 'nomeConta',
   message:'De qual conta você gostaria de efetuar o saque?'
  }]).then( (res)=>{

   const contaEscolhida = res['nomeConta']
   
   if ( fs.existsSync(`./conta/${contaEscolhida}.json`) ){
      let inforConta = JSON.parse(fs.readFileSync(`./conta/${contaEscolhida}.json`))
      console.dir( inforConta.saldo )

         inquirer.prompt([{
            type: 'input',
            name: 'valorDeSaque',
            message: 'Qual valor você deseja sacar?'

         }]).then( (res)=>{

            if( inforConta.saldo < parseFloat(res.valorDeSaque) ){
                console.log(chalk.bgYellow.bold('Saldo insuficiente.'))
                return

            }else{
               console.log(chalk.bgBlue.bold('Vamos realizar seu saque em alguns minutos...'))

                  setTimeout( ()=>{

                     let conta = JSON.parse(fs.readFileSync(`./conta/${contaEscolhida}.json`))

                     let saldoAtualizado = parseFloat(conta['saldo']) - parseFloat(res.valorDeSaque)

                     conta['saldo'] = saldoAtualizado

                     console.log( conta )
                  
                     fs.writeFileSync(`./conta/${contaEscolhida}.json`, JSON.stringify(conta))
                     
                     console.log(chalk.bgGreen.bold('Saque realizado com sucesso!'))

                     return operacoesBancarias()

                  }, 2000)
            } 
         })

   }else{
      console.log(chalk.bgRed.bold('Essa conta não existe, tente novamente.'))
      return operacoesBancarias()
   }

  })
}

function inforDev() {

   console.log('Pedro César de Freitas')
   console.log("Dev Node.js | JavaScript | MySQL | de Paulista/PE.")
   console.log(chalk.bgBlueBright.bold('https://api.whatsapp.com/send/?phone=5581999954962&text&type=phone_number&app_absent=0'));

}

operacoesBancarias();
