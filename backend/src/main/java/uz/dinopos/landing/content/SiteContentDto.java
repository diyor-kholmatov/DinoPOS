package uz.dinopos.landing.content;

import java.util.Map;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SiteContentDto(
    @NotNull @Size(min = 3, max = 3) Map<String, @Valid LocalizedContentDto> locales,
    @NotBlank @Email @Size(max = 180) String contactEmail,
    @NotBlank @Size(max = 80) String contactPhone,
    @NotBlank @Size(max = 80) String contactTelegram
) {}
