package uz.dinopos.landing.lead;

import jakarta.validation.constraints.NotNull;

public record LeadStatusRequest(@NotNull LeadStatus status) {}
