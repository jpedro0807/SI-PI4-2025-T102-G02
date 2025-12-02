package com.healthmoney.healthmoney.service;

import com.healthmoney.healthmoney.dto.DadosNotaFiscal;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class NfeService {

    // 🔴 IMPORTANTE: COLOCAR SUA CHAVE REAL AQUI
    private static final String API_KEY = "sk_f3084e3aa2aaf5554be643f0b29dec8fc3e92330";

    private static final String URL_CONVERSAO = "https://api.pdfshift.io/v3/convert/pdf";

    public byte[] gerarNotaFiscalPdf(DadosNotaFiscal dados) {
        RestTemplate restTemplate = new RestTemplate();

        // 1. GERAR LINHAS DA TABELA DINAMICAMENTE (LOOP)
        StringBuilder linhasDaTabela = new StringBuilder();

        // Verifica se a lista não é nula para evitar erro
        if (dados.itens() != null) {
            for (DadosNotaFiscal.ItemNota item : dados.itens()) {
                linhasDaTabela.append("""
                    <tr>
                        <td class="center">%s</td>
                        <td>%s</td>
                        <td class="center">UN</td>
                        <td class="center">%s</td>
                        <td class="right">%s</td>
                        <td class="right">%s</td>
                    </tr>
                """.formatted(
                        item.codigo(),
                        item.descricao(),
                        item.qtd(),
                        item.valorUnitario(),
                        item.valorTotal()
                ));
            }
        }

        // Dados fixos para simulação
        String dataHoje = java.time.LocalDate.now().toString();
        String chaveFake = "3523 1200 0000 0000 0000 5500 1000 0000 0112 3456 7890";
        String protocoloFake = "1352300000" + System.currentTimeMillis();

        // 2. HTML DA NOTA (DANFE)
        String htmlDaNota = """
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Times New Roman', Times, serif; font-size: 10px; margin: 0; padding: 20px; }
                    .container { width: 100%%; max-width: 800px; margin: 0 auto; border: 1px solid black; position: relative; }
                    .row { display: flex; border-bottom: 1px solid black; }
                    .col { border-right: 1px solid black; padding: 2px 5px; display: flex; flex-direction: column; justify-content: center; }
                    .col:last-child { border-right: none; }
                    .label { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #333; margin-bottom: 2px; }
                    .value { font-size: 11px; font-weight: bold; color: #000; min-height: 12px; }
                    .center { text-align: center; align-items: center; }
                    .right { text-align: right; align-items: flex-end; }
                    h1 { margin: 0; font-size: 18px; }
                    table { width: 100%%; border-collapse: collapse; margin-top: 5px; font-size: 10px; }
                    th { border: 1px solid black; padding: 3px; background-color: #eee; font-size: 9px; }
                    td { border: 1px solid black; padding: 3px; }
                    .watermark {
                        position: absolute; top: 40%%; left: 50%%; transform: translate(-50%%, -50%%) rotate(-45deg);
                        font-size: 60px; color: rgba(0, 0, 0, 0.1); z-index: 0; white-space: nowrap; pointer-events: none;
                    }
                    .w-10 { width: 10%%; } .w-20 { width: 20%%; } .w-30 { width: 30%%; } 
                    .w-40 { width: 40%%; } .w-50 { width: 50%%; } .w-60 { width: 60%%; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="watermark">SEM VALOR FISCAL<br>HOMOLOGAÇÃO</div>
                
                    <div class="row" style="height: 100px;">
                        <div class="col w-40">
                            <div class="value center" style="font-size: 14px;">HEALTHMONEY CLÍNICA</div>
                            <div class="center" style="font-size: 9px;">Av. da Universidade, 123 - Campinas - SP</div>
                        </div>
                        <div class="col w-15 center">
                            <h1 style="font-family: Arial Black;">DANFE</h1>
                            <span class="label">SAÍDA - Nº 001</span>
                        </div>
                        <div class="col w-45">
                            <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=%s&scale=1&height=10" style="width: 100%%; height: 35px;">
                            <span class="label">CHAVE DE ACESSO</span>
                            <span class="value" style="font-size: 9px;">%s</span>
                        </div>
                    </div>

                    <div style="background-color: #ddd; padding: 2px; font-weight: bold; border-bottom: 1px solid black; font-size: 9px;">DESTINATÁRIO / REMETENTE</div>
                    <div class="row">
                        <div class="col w-60"><span class="label">NOME / RAZÃO SOCIAL</span><span class="value">%s</span></div>
                        <div class="col w-30"><span class="label">CNPJ / CPF</span><span class="value">%s</span></div>
                        <div class="col w-10"><span class="label">EMISSÃO</span><span class="value center">%s</span></div>
                    </div>
                    <div class="row">
                        <div class="col w-50"><span class="label">ENDEREÇO</span><span class="value">%s</span></div>
                        <div class="col w-30"><span class="label">BAIRRO / DISTRITO</span><span class="value">%s</span></div>
                        <div class="col w-20"><span class="label">MUNICÍPIO / UF</span><span class="value center">%s</span></div>
                    </div>

                    <div style="background-color: #ddd; padding: 2px; font-weight: bold; border-bottom: 1px solid black; font-size: 9px; border-top: 1px solid black;">CÁLCULO DO IMPOSTO</div>
                    <div class="row">
                        <div class="col w-20"><span class="label">BASE CÁLC. ICMS</span><span class="value right">0,00</span></div>
                        <div class="col w-20"><span class="label">VALOR FRETE</span><span class="value right">0,00</span></div>
                        <div class="col w-20"><span class="label">DESCONTO</span><span class="value right">0,00</span></div>
                        <div class="col w-20"><span class="label">OUTRAS DESP</span><span class="value right">0,00</span></div>
                        <div class="col w-20"><span class="label">TOTAL NOTA</span><span class="value right">%s</span></div>
                    </div>

                    <div style="background-color: #ddd; padding: 2px; font-weight: bold; font-size: 9px; border-top: 1px solid black; margin-top: 5px;">DADOS DO PRODUTO / SERVIÇO</div>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 10%%;">CÓD</th>
                                <th style="width: 40%%;">DESCRIÇÃO</th>
                                <th style="width: 5%%;">UN</th>
                                <th style="width: 5%%;">QTD</th>
                                <th style="width: 15%%;">VLR. UNIT</th>
                                <th style="width: 15%%;">VLR. TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            %s 
                            <tr style="height: 100px;"><td colspan="6">&nbsp;</td></tr>
                        </tbody>
                    </table>
                    
                    <div style="border: 1px solid black; margin-top: 5px; padding: 5px;">
                        <span class="label">INFORMAÇÕES COMPLEMENTARES</span><br>
                        Protocolo: %s
                    </div>
                </div>
            </body>
            </html>
        """.formatted(
                chaveFake,
                chaveFake,
                dados.nomeCliente(),
                dados.cpfCnpj(),
                dataHoje,
                dados.enderecoCompleto(),
                dados.bairro(),
                dados.municipioUf(),
                dados.valorTotal(),
                linhasDaTabela.toString(),
                protocoloFake
        );

        // --- AUTENTICAÇÃO SIMPLIFICADA (CORREÇÃO DO ERRO 401) ---
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Aqui usamos o Header direto 'x-api-key', sem complicação de Base64
        headers.set("x-api-key", API_KEY);
        // --------------------------------------------------------

        Map<String, Object> body = new HashMap<>();
        body.put("source", htmlDaNota);
        body.put("landscape", false);
        body.put("use_print", false);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<byte[]> response = restTemplate.postForEntity(URL_CONVERSAO, request, byte[].class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Dica: coloque um breakpoint aqui se der erro de novo
        }
    }
}