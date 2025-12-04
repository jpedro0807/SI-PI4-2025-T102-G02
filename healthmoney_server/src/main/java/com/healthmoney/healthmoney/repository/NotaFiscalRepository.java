package com.healthmoney.healthmoney.repository;

import com.healthmoney.healthmoney.domain.NotaFiscal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, Long> {

    // 1. Soma o valor total das notas de um mês/ano específico
    @Query("SELECT SUM(n.valorTotal) FROM NotaFiscal n WHERE YEAR(n.dataEmissao) = :ano AND MONTH(n.dataEmissao) = :mes")
    BigDecimal somaReceitaNoMes(@Param("ano") int ano, @Param("mes") int mes);

    // 2. Conta quantas notas foram emitidas no mês (Representa atendimentos)
    @Query("SELECT COUNT(n) FROM NotaFiscal n WHERE YEAR(n.dataEmissao) = :ano AND MONTH(n.dataEmissao) = :mes")
    long contarNotasNoMes(@Param("ano") int ano, @Param("mes") int mes);
}