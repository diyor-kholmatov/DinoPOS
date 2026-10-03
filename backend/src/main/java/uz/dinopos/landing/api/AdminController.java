package uz.dinopos.landing.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import uz.dinopos.landing.content.SiteContentDto;
import uz.dinopos.landing.content.SiteContentService;
import uz.dinopos.landing.lead.Lead;
import uz.dinopos.landing.lead.LeadRepositoryFacade;
import uz.dinopos.landing.lead.LeadStatusRequest;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final SiteContentService contentService;
    private final LeadRepositoryFacade leadService;

    public AdminController(SiteContentService contentService, LeadRepositoryFacade leadService) {
        this.contentService = contentService;
        this.leadService = leadService;
    }

    @GetMapping("/leads")
    public List<Lead> leads() {
        return leadService.findAll();
    }

    @PatchMapping("/leads/{id}/status")
    public Lead updateLeadStatus(@PathVariable Long id, @Valid @RequestBody LeadStatusRequest request) {
        return leadService.updateStatus(id, request.status());
    }

    @GetMapping("/content")
    public SiteContentDto content() {
        return contentService.get();
    }

    @PutMapping("/content")
    public SiteContentDto updateContent(@Valid @RequestBody SiteContentDto request) {
        return contentService.update(request);
    }
}
