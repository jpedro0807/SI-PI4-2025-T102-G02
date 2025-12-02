package com.healthmoney.healthmoney.controller;

import com.healthmoney.healthmoney.dto.DadosNotaFiscal;
import com.healthmoney.healthmoney.service.NfeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nfe")
public class NfeController {

    @Autowired
    private NfeService nfeService;

    // Mudamos para POST pois agora recebemos um objeto complexo (JSON)
    @PostMapping("/baixar-pdf")
    public ResponseEntity<byte[]> baixarNota(@RequestBody DadosNotaFiscal dados) {

        byte[] pdfBytes = nfeService.gerarNotaFiscalPdf(dados);

        if (pdfBytes != null) {
            return ResponseEntity.ok()
                    // O nome do arquivo será dinâmico: nota_fiscal_Joao.pdf
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=nota_fiscal_" + dados.nomeCliente().replace(" ", "_") + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }
}