package uz.dinopos.landing.lead;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LeadRepositoryFacade {
    private final LeadRepository repository;

    public LeadRepositoryFacade(LeadRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Lead create(LeadCreateRequest request) {
        return repository.save(new Lead(request));
    }

    @Transactional(readOnly = true)
    public List<Lead> findAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Lead updateStatus(Long id, LeadStatus status) {
        Lead lead = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found"));
        lead.setStatus(status);
        return lead;
    }
}
