package com.healthmoney.healthmoney.repository;

import com.healthmoney.healthmoney.domain.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    @Query(value = """
        SELECT COALESCE(SUM(valor), 0) 
        FROM public.despesas  -- ADICIONEI O 'public.'
        WHERE EXTRACT(YEAR FROM data_pagamento) = :ano 
        AND EXTRACT(MONTH FROM data_pagamento) = :mes
    """, nativeQuery = true)
    BigDecimal somaDespesasNoMes(@Param("ano") int ano, @Param("mes") int mes);
}