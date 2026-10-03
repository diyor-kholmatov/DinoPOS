package uz.dinopos.landing.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import uz.dinopos.landing.content.SiteContentDto;
import uz.dinopos.landing.content.SiteContentService;
import uz.dinopos.landing.lead.Lead;
import uz.dinopos.landing.lead.LeadCreateRequest;
import uz.dinopos.landing.lead.LeadRepositoryFacade;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final SiteContentService contentService;
    private final LeadRepositoryFacade leadService;

    public PublicController(SiteContentService contentService, LeadRepositoryFacade leadService) {
        this.contentService = contentService;
        this.leadService = leadService;
    }

    @GetMapping("/content")
    public SiteContentDto content() {
        return contentService.get();
    }

    @PostMapping("/leads")
    @ResponseStatus(HttpStatus.CREATED)
    public Lead createLead(@Valid @RequestBody LeadCreateRequest request) {
        return leadService.create(request);
    }
}
