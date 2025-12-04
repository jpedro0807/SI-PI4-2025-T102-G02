package com.healthmoney.healthmoney.controller;

import com.healthmoney.healthmoney.dto.DashboardDTO;
import com.healthmoney.healthmoney.repository.NotaFiscalRepository;
import com.healthmoney.healthmoney.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @GetMapping
    public DashboardDTO getDadosDashboard() {
        LocalDate hoje = LocalDate.now();
        int anoAtual = hoje.getYear();
        int mesAtual = hoje.getMonthValue();

        // 1. CARDS DO TOPO (Dados Reais)
        long totalPacientes = pacienteRepository.count(); // Conta linhas da tb_pacientes

        BigDecimal receitaMes = notaFiscalRepository.somaReceitaNoMes(anoAtual, mesAtual);
        if (receitaMes == null) receitaMes = BigDecimal.ZERO;

        long atendimentosMes = notaFiscalRepository.contarNotasNoMes(anoAtual, mesAtual);

        // Como ainda não temos módulo de Despesas, o Saldo é igual à Receita
        BigDecimal saldoMes = receitaMes;

        // 2. DADOS PARA O GRÁFICO (Últimos 6 meses)
        List<DashboardDTO.DadosGrafico> historico = new ArrayList<>();

        // Loop reverso: do mês atual para trás (5 meses)
        for (int i = 5; i >= 0; i--) {
            LocalDate data = hoje.minusMonths(i);
            BigDecimal valor = notaFiscalRepository.somaReceitaNoMes(data.getYear(), data.getMonthValue());

            if (valor == null) valor = BigDecimal.ZERO;

            // Pega o nome do mês abreviado (Ex: "Dez", "Jan")
            String nomeMes = data.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));

            historico.add(new DashboardDTO.DadosGrafico(nomeMes, valor));
        }

        return new DashboardDTO(totalPacientes, atendimentosMes, receitaMes, saldoMes, historico);
    }
}