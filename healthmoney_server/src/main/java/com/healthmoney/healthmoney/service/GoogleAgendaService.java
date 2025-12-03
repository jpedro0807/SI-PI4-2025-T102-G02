package com.healthmoney.healthmoney.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.healthmoney.healthmoney.dto.EventoDTO;
import org.springframework.stereotype.Service;
import java.util.List;
import java.io.IOException;
import java.security.GeneralSecurityException;
import com.google.api.services.calendar.model.Events;
import com.google.api.services.calendar.model.EventAttendee;
import java.util.Collections;

@Service
public class GoogleAgendaService {

    private static final String APPLICATION_NAME = "HealthMoney";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    // Método auxiliar para criar o cliente da API autenticado
    private Calendar criarClienteGoogle(String accessToken) throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        // Monta a credencial usando apenas o Token que o Spring Security já pegou
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, request -> request.getHeaders().setAuthorization("Bearer " + accessToken))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public Event criarEvento(String accessToken, EventoDTO dto) throws GeneralSecurityException, IOException {
        Calendar service = criarClienteGoogle(accessToken);

        Event event = new Event()
                .setSummary(dto.titulo())
                .setDescription(dto.descricao());

        // LÓGICA DE DATAS (Mantenha igual ao que já estava)
        DateTime startDateTime = new DateTime(dto.dataInicio() + "-03:00");
        EventDateTime start = new EventDateTime()
                .setDateTime(startDateTime)
                .setTimeZone("America/Sao_Paulo");
        event.setStart(start);

        DateTime endDateTime = new DateTime(dto.dataFim() + "-03:00");
        EventDateTime end = new EventDateTime()
                .setDateTime(endDateTime)
                .setTimeZone("America/Sao_Paulo");
        event.setEnd(end);

        // --- LÓGICA NOVA: ADICIONAR CONVIDADO (PACIENTE) ---
        if (dto.emailPaciente() != null && !dto.emailPaciente().isEmpty()) {
            EventAttendee convidado = new EventAttendee();
            convidado.setEmail(dto.emailPaciente());

            // Adiciona à lista de participantes
            event.setAttendees(Collections.singletonList(convidado));
        }
        // ---------------------------------------------------

        // O parâmetro 'sendUpdates=all' força o envio do e-mail de convite na hora
        return service.events().insert("primary", event)
                .setSendUpdates("all")
                .execute();
    }

    public void deletarEvento(String accessToken, String eventId) throws GeneralSecurityException, IOException {
        Calendar service = criarClienteGoogle(accessToken);
        service.events().delete("primary", eventId).execute();
    }

// No arquivo GoogleAgendaService.java

    public List<Event> listarProximosEventos(String accessToken) throws GeneralSecurityException, IOException {
        Calendar service = criarClienteGoogle(accessToken);

        // DateTime do Google Client
        DateTime agora = new DateTime(System.currentTimeMillis());

        Events events = service.events().list("primary")
                .setTimeMin(agora) // Só eventos futuros
                .setOrderBy("startTime") // Ordenar por data
                .setSingleEvents(true) // Expande eventos recorrentes (importante!)
                .execute();

        return events.getItems();
    }



}