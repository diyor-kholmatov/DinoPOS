package uz.dinopos.landing.content;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteContentService {
    private static final Long SETTINGS_ID = 1L;
    private static final int CONTENT_VERSION = 2;
    private static final Set<String> REQUIRED_LOCALES = Set.of("ru", "uz", "en");

    private final LocalizedSiteContentRepository contentRepository;
    private final SiteSettingsRepository settingsRepository;

    public SiteContentService(LocalizedSiteContentRepository contentRepository, SiteSettingsRepository settingsRepository) {
        this.contentRepository = contentRepository;
        this.settingsRepository = settingsRepository;
    }

    @Transactional(readOnly = true)
    public SiteContentDto get() {
        Map<String, LocalizedContentDto> locales = new LinkedHashMap<>();
        contentRepository.findAll().forEach(content -> locales.put(content.getLocale(), content.toDto()));
        SiteSettings settings = settingsRepository.findById(SETTINGS_ID).orElseThrow(() -> new IllegalStateException("Site settings were not initialized"));
        return new SiteContentDto(locales, settings.getContactEmail(), settings.getContactPhone(), settings.getContactTelegram());
    }

    @Transactional
    public SiteContentDto update(SiteContentDto request) {
        if (!request.locales().keySet().equals(REQUIRED_LOCALES)) throw new IllegalArgumentException("Exactly ru, uz and en locales are required");
        request.locales().forEach((locale, dto) -> {
            LocalizedSiteContent content = contentRepository.findById(locale).orElseGet(() -> new LocalizedSiteContent(locale, dto));
            content.update(dto);
            contentRepository.save(content);
        });
        SiteSettings settings = settingsRepository.findById(SETTINGS_ID).orElseGet(() -> new SiteSettings(SETTINGS_ID, request.contactEmail(), request.contactPhone(), request.contactTelegram()));
        settings.update(request.contactEmail(), request.contactPhone(), request.contactTelegram());
        settingsRepository.save(settings);
        return get();
    }

    @Transactional
    public void seedIfEmpty() {
        SiteSettings settings = settingsRepository.findById(SETTINGS_ID).orElse(null);
        if (settings != null && Integer.valueOf(CONTENT_VERSION).equals(settings.getContentVersion()) && contentRepository.count() == 3) return;
        update(DefaultContent.value());
    }
}
