package com.healthmoney.healthmoney.controller;

import com.google.api.services.calendar.model.Event;
import com.healthmoney.healthmoney.dto.EventoDTO;
import com.healthmoney.healthmoney.service.GoogleAgendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agenda")
public class CalendarController {

    @Autowired
    private GoogleAgendaService agendaService;

    @Autowired
    private OAuth2AuthorizedClientService clientService; // Esse cara recupera o token

    // ROTA PARA CRIAR EVENTO
    @PostMapping("/criar")
    public String criarEvento(@RequestBody EventoDTO dto, OAuth2AuthenticationToken authentication) {
        // BLINDAGEM: Verifica se o usuário realmente está logado
        if (authentication == null) {
            return "⛔ ERRO: Você não está logado ou seu Cookie expirou. Faça login novamente no navegador.";
        }

        try {
            String accessToken = getAccessToken(authentication);
            Event eventoCriado = agendaService.criarEvento(accessToken, dto);
            return "✅ Evento criado com sucesso! ID: " + eventoCriado.getId();

        } catch (Exception e) {
            e.printStackTrace(); // Mostra o erro real no console
            return "Erro ao criar evento: " + e.getMessage();
        }
    }

    // ROTA PARA DELETAR EVENTO
    @DeleteMapping("/deletar/{id}")
    public String deletarEvento(@PathVariable String id, OAuth2AuthenticationToken authentication) {
        try {
            String accessToken = getAccessToken(authentication);
            agendaService.deletarEvento(accessToken, id);
            return "Evento " + id + " removido com sucesso.";
        } catch (Exception e) {
            return "Erro ao remover evento: " + e.getMessage();
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarEventos(OAuth2AuthenticationToken authentication) {

        // BLINDAGEM 🛡️: Se o usuário não estiver logado, para aqui!
        if (authentication == null) {
            // Retorna 401 (Unauthorized). Isso avisa o React que a sessão caiu.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Sessão expirada ou usuário não autenticado.");
        }

        try {
            String accessToken = getAccessToken(authentication);
            List<Event> eventosGoogle = agendaService.listarProximosEventos(accessToken);

            // ... (seu código de mapeamento dos eventos continua igual) ...
            List<Map<String, String>> listaSimplificada = new ArrayList<>();

            if (eventosGoogle != null) {
                for (Event event : eventosGoogle) {
                    if (event.getSummary() != null) {
                        Map<String, String> resumo = new HashMap<>();
                        resumo.put("id", event.getId());
                        resumo.put("titulo", event.getSummary());

                        // Tratamento Inicio
                        if (event.getStart().getDateTime() != null) {
                            resumo.put("inicio", event.getStart().getDateTime().toString());
                        } else {
                            resumo.put("inicio", event.getStart().getDate().toString());
                        }

                        // Tratamento Fim
                        if (event.getEnd().getDateTime() != null) {
                            resumo.put("fim", event.getEnd().getDateTime().toString());
                        } else {
                            resumo.put("fim", event.getEnd().getDate().toString());
                        }

                        listaSimplificada.add(resumo);
                    }
                }
            }

            return ResponseEntity.ok(listaSimplificada);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao buscar agenda: " + e.getMessage());
        }
    }

    // Método auxiliar para extrair o token da sessão
    private String getAccessToken(OAuth2AuthenticationToken authentication) {
        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName());
        return client.getAccessToken().getTokenValue();
    }
}