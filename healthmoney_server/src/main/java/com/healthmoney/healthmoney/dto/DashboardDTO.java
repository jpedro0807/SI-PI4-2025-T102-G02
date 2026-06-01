package com.healthmoney.healthmoney.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDTO(
        long totalPacientes,
        long atendimentosMes,
        BigDecimal receitaMes,
        BigDecimal saldoMes,
        List<DadosGrafico> fluxoCaixa,
        List<AtendimentoTipo> atendimentosPorTipo
) {
    public record DadosGrafico(String mes, BigDecimal valor) {}
    public record AtendimentoTipo(String tipo, long quantidade) {}
}