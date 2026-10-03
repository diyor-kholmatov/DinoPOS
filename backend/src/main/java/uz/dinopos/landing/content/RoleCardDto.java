package uz.dinopos.landing.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoleCardDto(
    @NotBlank @Size(max = 80) String role,
    @NotBlank @Size(max = 240) String title,
    @NotBlank @Size(max = 700) String description
) {}
