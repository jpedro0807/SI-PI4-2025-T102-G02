package com.healthmoney.healthmoney.controller;

import com.healthmoney.healthmoney.domain.ItemNotaFiscal;
import com.healthmoney.healthmoney.domain.NotaFiscal;
import com.healthmoney.healthmoney.dto.DadosNotaFiscal;
import com.healthmoney.healthmoney.repository.NotaFiscalRepository;
import com.healthmoney.healthmoney.service.NfeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/nfe")
public class NfeController {

    @Autowired
    private NfeService nfeService;

    // INJEÇÃO NOVA: Precisamos disso para buscar o histórico no banco
    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    // 1. ROTA PARA LISTAR O HISTÓRICO NA TABELA
    @GetMapping
    public List<NotaFiscal> listar() {
        return notaFiscalRepository.findAll();
    }

    // 2. ROTA PARA BAIXAR UMA NOTA ANTIGA (Re-impressão)
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> baixarNovamente(@PathVariable Long id) {
        // A. Busca a nota no banco
        NotaFiscal nota = notaFiscalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        // B. Reconstrói o DTO (DadosNotaFiscal) a partir do Banco
        // Precisamos converter a lista de Itens do Banco para a lista de Itens do DTO
        List<DadosNotaFiscal.ItemNota> itensDto = new ArrayList<>();

        if (nota.getItens() != null) {
            for (ItemNotaFiscal itemBanco : nota.getItens()) {
                itensDto.add(new DadosNotaFiscal.ItemNota(
                        itemBanco.getCodigo(),
                        itemBanco.getDescricao(),
                        String.valueOf(itemBanco.getQuantidade()),
                        itemBanco.getValorUnitario().toString(),
                        itemBanco.getValorTotalItem().toString()
                ));
            }
        }

        DadosNotaFiscal dadosParaPdf = new DadosNotaFiscal(
                nota.getNomeCliente(),
                nota.getCpfCnpj(),
                nota.getEnderecoCompleto(),
                nota.getBairro(),
                nota.getMunicipioUf(),
                nota.getValorTotal().toString(),
                itensDto
        );

        // C. Gera o PDF usando o serviço existente
        byte[] pdfBytes = nfeService.gerarNotaFiscalPdf(dadosParaPdf);

        // D. Retorna o arquivo
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=nota_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // 3. ROTA PARA EMITIR NOVA (JÁ EXISTENTE)
    @PostMapping("/emitir")
    public ResponseEntity<byte[]> emitirNota(@RequestBody DadosNotaFiscal dados) {

        try {

            nfeService.salvarNotaFiscal(dados);
        } catch (Exception e) {
            System.err.println("Erro de banco: " + e.getMessage());
        }

        byte[] pdfBytes = nfeService.gerarNotaFiscalPdf(dados);

        if (pdfBytes != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=nota_fiscal_" + dados.nomeCliente().replace(" ", "_") + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }
}