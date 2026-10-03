package uz.dinopos.landing.content;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class ContentSeedConfig {
    @Bean
    CommandLineRunner seedContent(SiteContentService service) {
        return args -> service.seedIfEmpty();
    }
}
