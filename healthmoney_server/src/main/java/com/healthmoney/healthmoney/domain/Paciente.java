package com.healthmoney.healthmoney.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate; // Importante para datas

@Data
@Entity
@Table(name = "pacientes")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String cpf;

    @Column(name = "data_nascimento") // Mapeia para sua coluna data_nascimento
    private LocalDate dataNascimento;

    private String email;
    private String telefone;
    private String endereco;
}