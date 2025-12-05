package com.healthmoney.healthmoney.dto;

import java.math.BigDecimal;
import java.util.List;

public record RelatorioFinanceiroDTO(
        BigDecimal receitaTotal,
        BigDecimal despesasTotais,
        BigDecimal saldo,
        BigDecimal aReceber,
        List<CategoriaValor> receitasPorCategoria,
        List<CategoriaValor> despesasPorCategoria
) {
    public record CategoriaValor(String nome, BigDecimal valor) {}
}