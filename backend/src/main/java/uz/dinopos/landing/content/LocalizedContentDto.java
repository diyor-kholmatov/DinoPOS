package uz.dinopos.landing.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LocalizedContentDto(
    @NotBlank @Size(max = 180) String eyebrow,
    @NotBlank @Size(max = 500) String heroTitle,
    @NotBlank @Size(max = 1200) String heroDescription,
    @NotBlank @Size(max = 120) String primaryCta,
    @NotBlank @Size(max = 120) String secondaryCta,
    @NotBlank @Size(max = 500) String problemTitle,
    @NotBlank @Size(max = 500) String solutionTitle,
    @NotBlank @Size(max = 500) String finalCtaTitle,
    @NotBlank @Size(max = 1200) String finalCtaDescription
) {}
