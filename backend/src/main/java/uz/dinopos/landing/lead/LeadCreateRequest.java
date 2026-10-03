package uz.dinopos.landing.lead;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LeadCreateRequest(
    @NotBlank @Size(max = 120) String name,
    @NotBlank @Size(max = 60) String phone,
    @NotBlank @Size(max = 180) String businessName,
    @Size(max = 120) String city,
    @Min(1) Integer storeCount,
    @Pattern(regexp = "PHONE|TELEGRAM|EMAIL") String contactMethod,
    @Size(max = 2000) String message,
    @Pattern(regexp = "ru|uz|en") String locale
) {}
