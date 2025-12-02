# projetoIntegrador04

## projetoIntegrador04

##########################################################################

### Insert calendario

## http://localhost:8080/agenda/criar POST

# Headers

Key = Cookie
Value = JSESSIONID=token pega no > f12 > apllication > Cookies

# Body

{
"titulo": "Aniversario Hector",
"dataInicio": "2025-01-27T15:00:00",
"dataFim": "2025-01-27T18:00:00",
"descricao": "Teste"
}

##########################################################################

### Delete calendario

## http://localhost:8080/agenda/deletar/{id} DELETE

# Headers

Key = Cookie
Value = JSESSIONID=token pega no > f12 > apllication > Cookies

##########################################################################

### Listar dados do calendario

## http://localhost:8080/agenda/listar GET

# Headers

Key = Cookie
Value = JSESSIONID=token pega no > f12 > apllication > Cookies

##########################################################################

#### Gerar nota fiscal

## http://localhost:8080/nfe/baixar-pdf

# Body

{
"nomeCliente": "Maria da Silva",
"cpfCnpj": "123.456.789-00",
"enderecoCompleto": "Av. Paulista, 1000 - Apto 54",
"bairro": "Bela Vista",
"municipioUf": "São Paulo - SP",
"valorTotal": "450,00",
"itens": [
{
"codigo": "001",
"descricao": "Sessão de Fisioterapia",
"qtd": "2",
"valorUnitario": "150,00",
"valorTotal": "300,00"
},
{
"codigo": "002",
"descricao": "Taxa de Avaliação",
"qtd": "1",
"valorUnitario": "150,00",
"valorTotal": "150,00"
}
]
}
