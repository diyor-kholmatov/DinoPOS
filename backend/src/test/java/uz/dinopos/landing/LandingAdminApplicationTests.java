package uz.dinopos.landing;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:dinopos-test;DB_CLOSE_DELAY=-1",
    "app.admin.password=test-password"
})
class LandingAdminApplicationTests {
    @Test
    void contextLoads() {}
}
