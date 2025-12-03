package com.healthmoney.healthmoney.controller;

import com.healthmoney.healthmoney.domain.Paciente;
import com.healthmoney.healthmoney.dto.PacienteDTO;
import com.healthmoney.healthmoney.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService service;

    @GetMapping
    public List<Paciente> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Paciente> cadastrar(@RequestBody PacienteDTO dados) {
        Paciente novo = service.cadastrar(dados);
        return ResponseEntity.ok(novo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
    // Adicione este método na classe PacienteController
    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Long id, @RequestBody PacienteDTO dados) {
        Paciente atualizado = service.atualizar(id, dados);
        return ResponseEntity.ok(atualizado);
    }

}