package com.healthmoney.healthmoney.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDTO(
        long totalPacientes,
        long atendimentosMes,
        BigDecimal receitaMes,
        BigDecimal saldoMes,
        List<DadosGrafico> fluxoCaixa
) {
    // Objeto interno para montar o gráfico de linha
    public record DadosGrafico(String mes, BigDecimal valor) {}
}