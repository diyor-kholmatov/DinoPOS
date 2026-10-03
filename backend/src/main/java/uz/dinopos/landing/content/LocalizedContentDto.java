package uz.dinopos.landing.content;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LocalizedContentDto(
    @NotBlank @Size(max = 180) String eyebrow,
    @NotBlank @Size(max = 500) String heroTitle,
    @NotBlank @Size(max = 1200) String heroDescription,
    @NotBlank @Size(max = 120) String primaryCta,
    @NotBlank @Size(max = 120) String secondaryCta,
    @NotBlank @Size(max = 180) String storyKicker,
    @NotBlank @Size(max = 500) String storyTitle,
    @NotBlank @Size(max = 1200) String storyDescription,
    @NotNull @Size(min = 5, max = 5) List<@Valid ShiftEventDto> shiftEvents,
    @NotBlank @Size(max = 500) String rolesTitle,
    @NotBlank @Size(max = 900) String rolesIntro,
    @NotNull @Size(min = 3, max = 3) List<@Valid RoleCardDto> roleCards,
    @NotBlank @Size(max = 180) String founderKicker,
    @NotBlank @Size(max = 1200) String founderQuote,
    @NotBlank @Size(max = 180) String founderName,
    @NotBlank @Size(max = 500) String pilotTitle,
    @NotBlank @Size(max = 1200) String pilotDescription,
    @NotNull @Size(min = 3, max = 3) List<@NotBlank @Size(max = 240) String> pilotFeatures
) {}
