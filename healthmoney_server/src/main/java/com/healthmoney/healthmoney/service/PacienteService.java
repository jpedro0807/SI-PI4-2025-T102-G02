package com.healthmoney.healthmoney.service;

import com.healthmoney.healthmoney.domain.Paciente;
import com.healthmoney.healthmoney.dto.PacienteDTO;
import com.healthmoney.healthmoney.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository repository;

    // LISTAR TODOS
    public List<Paciente> listarTodos() {
        return repository.findAll();
    }

    public Paciente cadastrar(PacienteDTO dados) {
        Paciente paciente = new Paciente();
        paciente.setNome(dados.nome());
        paciente.setCpf(dados.cpf());


        paciente.setDataNascimento(dados.dataNascimento());
        paciente.setEmail(dados.email());
        paciente.setTelefone(dados.telefone());
        paciente.setEndereco(dados.endereco());

        return repository.save(paciente);
    }

    // Adicione este método na classe PacienteService
    public Paciente atualizar(Long id, PacienteDTO dados) {
        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        paciente.setNome(dados.nome());
        paciente.setCpf(dados.cpf()); // Cuidado: CPF geralmente não se muda, mas deixarei aqui
        paciente.setDataNascimento(dados.dataNascimento()); // Importante atualizar data também
        paciente.setEmail(dados.email());
        paciente.setTelefone(dados.telefone());
        paciente.setEndereco(dados.endereco());

        return repository.save(paciente);
    }

    // DELETAR
    public void excluir(Long id) {
        repository.deleteById(id);
    }
}