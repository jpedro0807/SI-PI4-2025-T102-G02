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

@RestController // Indica que esta classe expõe endpoints REST
@RequestMapping("/api/nfe") // Prefixo padrão para todas as rotas deste controller
public class NfeController {

    @Autowired
    private NfeService nfeService; // Serviço responsável pela lógica de emissão/geração de NFs

    // INJEÇÃO NOVA: Precisamos disso para buscar o histórico no banco
    @Autowired
    private NotaFiscalRepository notaFiscalRepository; // Repository JPA para acessar a tabela de NotaFiscal

    // 1. ROTA PARA LISTAR O HISTÓRICO NA TABELA
    @GetMapping
    public List<NotaFiscal> listar() {
        // Retorna todas as notas fiscais salvas no banco
        return notaFiscalRepository.findAll();
    }

    // 2. ROTA PARA BAIXAR UMA NOTA ANTIGA (Re-impressão)
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> baixarNovamente(@PathVariable Long id) {
        // A. Busca a nota no banco pelo ID informado
        NotaFiscal nota = notaFiscalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        // B. Reconstrói o DTO (DadosNotaFiscal) a partir do Banco
        // Precisamos converter a lista de Itens do Banco para a lista de Itens do DTO
        List<DadosNotaFiscal.ItemNota> itensDto = new ArrayList<>();

        // Se a nota tiver itens associados, converte cada ItemNotaFiscal para o tipo ItemNota (DTO)
        if (nota.getItens() != null) {
            for (ItemNotaFiscal itemBanco : nota.getItens()) {
                itensDto.add(new DadosNotaFiscal.ItemNota(
                        itemBanco.getCodigo(),                               // Código do item
                        itemBanco.getDescricao(),                            // Descrição do serviço/produto
                        String.valueOf(itemBanco.getQuantidade()),           // Quantidade em String
                        itemBanco.getValorUnitario().toString(),             // Valor unitário em String
                        itemBanco.getValorTotalItem().toString()             // Valor total do item em String
                ));
            }
        }

        // Monta o DTO usando os dados da NotaFiscal do banco
        DadosNotaFiscal dadosParaPdf = new DadosNotaFiscal(
                nota.getNomeCliente(),
                nota.getCpfCnpj(),
                nota.getEnderecoCompleto(),
                nota.getBairro(),
                nota.getMunicipioUf(),
                nota.getValorTotal().toString(),
                itensDto
        );

        // C. Gera o PDF usando o serviço existente (reaproveita mesma lógica de emissão)
        byte[] pdfBytes = nfeService.gerarNotaFiscalPdf(dadosParaPdf);

        // D. Retorna o arquivo PDF como resposta HTTP (download)
		// Content-Disposition: attachment => navegador baixa o arquivo em vez de abrir como página
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=nota_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // 3. ROTA PARA EMITIR NOVA (JÁ EXISTENTE)
    @PostMapping("/emitir")
    public ResponseEntity<byte[]> emitirNota(@RequestBody DadosNotaFiscal dados) {

        try {
            // Salva os dados da nota fiscal no banco (histórico)
            nfeService.salvarNotaFiscal(dados);
        } catch (Exception e) {
            // Caso ocorra algum erro na persistência, apenas loga (não quebra a geração do PDF)
            System.err.println("Erro de banco: " + e.getMessage());
        }

        // Gera o PDF da nota fiscal com base nos dados recebidos
        byte[] pdfBytes = nfeService.gerarNotaFiscalPdf(dados);

        // Se o PDF foi gerado corretamente, devolve o arquivo
        if (pdfBytes != null) {
            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=nota_fiscal_" + dados.nomeCliente().replace(" ", "_") + ".pdf"
                    ) // Nome do arquivo inclui o nome do cliente
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } else {
            // Em caso de falha na geração do PDF, retorna 500
            return ResponseEntity.internalServerError().build();
        }
    }
}
