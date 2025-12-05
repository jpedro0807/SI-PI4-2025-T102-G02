package com.healthmoney.healthmoney.dto;

public record EventoDTO(
        String titulo,
        String dataInicio,
        String dataFim,
        String descricao,
        String emailPaciente
) {}