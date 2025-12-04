package com.healthmoney.healthmoney.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "despesas") // <--- CORRIGIDO: Nome exato da sua tabela no Neon
public class Despesa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;
    private String categoria;
    private BigDecimal valor;

    @Column(name = "data_pagamento") // Mapeia o snake_case do banco
    private LocalDate dataPagamento;
}