package com.healthmoney.healthmoney.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity

@Table(name = "itens_nota")
public class ItemNotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "nota_fiscal_id")
    private NotaFiscal notaFiscal;

    private String codigo;

    private String descricao;

    private Integer quantidade;


    @Column(name = "valor_unitario")
    private BigDecimal valorUnitario;

    @Column(name = "valor_total_item")
    private BigDecimal valorTotalItem;
}