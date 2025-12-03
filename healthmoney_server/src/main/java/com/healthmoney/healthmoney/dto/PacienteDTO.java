package com.healthmoney.healthmoney.dto;

import java.time.LocalDate;

public record PacienteDTO(
        String nome,
        String cpf,
        LocalDate dataNascimento, // Novo campo
        String email,
        String telefone,
        String endereco
) {}