package uz.dinopos.landing;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import uz.dinopos.landing.content.SiteContentService;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:dinopos-test;DB_CLOSE_DELAY=-1",
    "app.admin.password=test-password"
})
class LandingAdminApplicationTests {
    @Autowired
    private SiteContentService contentService;

    @Test
    void contextLoads() {}

    @Test
    void editableStoryKeepsItsRequiredStructure() {
        var content = contentService.get();

        assertThat(content.locales()).containsOnlyKeys("ru", "uz", "en");
        content.locales().values().forEach(locale -> {
            assertThat(locale.shiftEvents()).hasSize(5);
            assertThat(locale.roleCards()).hasSize(3);
            assertThat(locale.pilotFeatures()).hasSize(3);
        });
    }
}
