package com.healthmoney.healthmoney.repository;

import com.healthmoney.healthmoney.domain.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

}