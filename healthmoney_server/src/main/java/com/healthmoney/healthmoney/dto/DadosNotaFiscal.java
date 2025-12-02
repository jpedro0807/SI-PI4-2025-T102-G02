package com.healthmoney.healthmoney.dto;

import java.util.List;

public record DadosNotaFiscal(
        String nomeCliente,
        String cpfCnpj,
        String enderecoCompleto,
        String bairro,
        String municipioUf,
        String valorTotal,
        List<ItemNota> itens // <--- Agora é uma lista!
) {
    // Record interno para os itens da lista
    public record ItemNota(
            String codigo,
            String descricao,
            String qtd,
            String valorUnitario,
            String valorTotal
    ) {}
}