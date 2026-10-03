package uz.dinopos.landing.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ShiftEventDto(
    @NotBlank @Size(max = 20) String time,
    @NotBlank @Size(max = 80) String label,
    @NotBlank @Size(max = 300) String title,
    @NotBlank @Size(max = 900) String description,
    @NotBlank @Pattern(regexp = "opening|rush|offline|inventory|closing") String tone
) {}
