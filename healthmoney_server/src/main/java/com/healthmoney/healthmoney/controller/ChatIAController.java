package com.healthmoney.healthmoney.controller;

import com.healthmoney.healthmoney.domain.Paciente;
import com.healthmoney.healthmoney.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import java.util.HashMap;
import java.util.List;
import java.util.Map;




@RestController
@RequestMapping("/api/chat")
public class ChatIAController {

    private String getAccessToken(OAuth2AuthenticationToken authentication) {
        if (authentication == null) return null;
        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName());
        return client != null ? client.getAccessToken().getTokenValue() : null;
    }


    private final String PYTHON_API_URL = "http://localhost:8000/api/gerar-resposta";

    // 1. Injetamos o seu repositório real de Pacientes
    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private com.healthmoney.healthmoney.service.GoogleAgendaService googleAgendaService;

    @Autowired
    private OAuth2AuthorizedClientService clientService;


    @PostMapping
    public ResponseEntity<Map<String, String>> conversarComIA(
            @RequestBody Map<String, String> payloadFront,
            OAuth2AuthenticationToken authentication) {
        String mensagemPaciente = payloadFront.get("pergunta");
        String historico = payloadFront.getOrDefault("historico", "");

        // 2. BUSCA NO BANCO DE DADOS REAL
        // Vamos buscar todos os pacientes e criar uma lista em texto para a IA ler
        List<Paciente> pacientes = pacienteRepository.findAll();
        StringBuilder contextoBanco = new StringBuilder();
        contextoBanco.append("LISTA DE PACIENTES CADASTRADOS NO SISTEMA:\n");

        if (pacientes.isEmpty()) {
            contextoBanco.append("- Nenhum paciente cadastrado ainda.\n");
        } else {
            for (Paciente p : pacientes) {
                contextoBanco.append(String.format("- Nome: %s | CPF: %s | Telefone: %s\n",
                        p.getNome(), p.getCpf(), p.getTelefone()));
            }
        }

        // Futuramente, adicionaremos os horários da tabela 'atendimento' aqui também!
        contextoBanco.append("\nRegra: Se o paciente no chat informar um nome ou CPF que está na lista acima, trate-o como cliente cadastrado. Se não, diga que ele precisa fazer o cadastro primeiro.");

        // 3. Monta o pacote para enviar ao Python (Microserviço da IA)
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestPython = new HashMap<>();
        requestPython.put("pergunta", mensagemPaciente);
        requestPython.put("historico", historico);
        requestPython.put("contexto_banco", contextoBanco.toString()); // Enviando os dados do Postgres!

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestPython, headers);

        try {
            // Chama a API Python
            ResponseEntity<Map> responsePython = restTemplate.postForEntity(PYTHON_API_URL, request, Map.class);
            String respostaIA = (String) responsePython.getBody().get("resposta");

            // ==========================================
            // INTERCEPTADOR DE COMANDOS DA IA
            // ==========================================
            // ==========================================
            // INTERCEPTADOR DE COMANDOS DA IA (AGORA REAL)
            // ==========================================
            // ==========================================
            // INTERCEPTADOR DE COMANDOS DA IA (5 DADOS)
            // ==========================================
            if (respostaIA.contains("[AGENDAR]")) {
                try {
                    String dadosLimpos = respostaIA.replace("[AGENDAR]", "").replace("[/INST]", "").trim();
                    String[] partes = dadosLimpos.split("\\|");

                    if(partes.length >= 5) {
                        String nome = partes[0].trim();
                        String data = partes[1].trim();
                        String hora = partes[2].trim();
                        String email = partes[3].trim();
                        String descricao = partes[4].trim();

                        // TRAVA DE SEGURANÇA: Impede que o Java quebre se a IA mandar a palavra "Data" ou "Nome"
                        if (nome.equalsIgnoreCase("Nome") || !data.contains("/")) {
                            respostaIA = "❌ Entendido! Mas faltaram dados para o agendamento. Por favor, forneça todos os 5 dados: Nome, Data (DD/MM), Horário, Email e Descrição.";
                        } else {
                            // Formatação de data ISO e Correção de Segundos
                            int anoAtual = java.time.LocalDate.now().getYear();
                            String[] diaMes = data.split("/");

                            if (hora.length() <= 2) {
                                hora = hora + ":00";
                            }

                            String dataInicioStr = anoAtual + "-" + diaMes[1] + "-" + diaMes[0] + "T" + hora + ":00";
                            java.time.LocalDateTime inicioLdt = java.time.LocalDateTime.parse(dataInicioStr);

                            java.time.format.DateTimeFormatter formatador = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

                            String dataInicioIso = inicioLdt.format(formatador);
                            String dataFimIso = inicioLdt.plusHours(1).format(formatador);

                            // Montando o DTO
                            com.healthmoney.healthmoney.dto.EventoDTO evento = new com.healthmoney.healthmoney.dto.EventoDTO(
                                    "Consulta: " + nome,   // 1. titulo
                                    dataInicioIso,         // 2. dataInicio
                                    dataFimIso,            // 3. dataFim
                                    descricao,             // 4. descricao
                                    email                  // 5. emailPaciente
                            );
                            String accessToken = getAccessToken(authentication);

                            if (accessToken == null) {
                                respostaIA = "❌ Acesso Negado: O seu token do Google não foi encontrado. Você está logado no sistema?";
                            } else {
                                googleAgendaService.criarEvento(accessToken, evento);
                                respostaIA = "✅ Agendamento Realizado! A consulta de **" + nome + "** (" + descricao + ") está no Google Calendar e o convite foi enviado para o email: " + email;
                            }
                        }
                    } else {
                        respostaIA = "❌ A IA tentou agendar, mas faltaram parâmetros. Envie todos os dados necessários.";
                    }
                } catch (Exception e) {
                    respostaIA = "❌ Ocorreu um erro interno ao salvar no Google Calendar: " + e.getMessage();
                }
            }
            // ==========================================

            Map<String, String> respostaParaReact = new HashMap<>();
            respostaParaReact.put("resposta", respostaIA);

            return ResponseEntity.ok(respostaParaReact);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("resposta", "A secretária está offline no momento. Erro: " + e.getMessage()));
        }
    }
}

