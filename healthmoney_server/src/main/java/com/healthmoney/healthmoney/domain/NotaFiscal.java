package com.healthmoney.healthmoney.domain;

import com.healthmoney.healthmoney.domain.Paciente;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "notas_fiscais")
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    // --- AQUI ESTÃO OS CAMPOS COM OS MESMOS NOMES DO DTO ---

    @Column(name = "nome_cliente") // Mapeia para a coluna do banco
    private String nomeCliente;

    @Column(name = "cpf_cnpj")
    private String cpfCnpj;

    @Column(name = "endereco_completo")
    private String enderecoCompleto;

    private String bairro; // O banco provavelmente é 'bairro' mesmo

    @Column(name = "municipio_uf")
    private String municipioUf;

    @Column(name = "valor_total")
    private BigDecimal valorTotal;

    @Column(name = "data_emissao")
    private LocalDateTime dataEmissao = LocalDateTime.now();

    @OneToMany(mappedBy = "notaFiscal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemNotaFiscal> itens = new ArrayList<>();
}