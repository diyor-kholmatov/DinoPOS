package uz.dinopos.landing.content;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Lob;

@Embeddable
public class ShiftEventContent {
    private String eventTime;
    private String label;
    private String title;
    @Lob
    private String description;
    private String tone;

    protected ShiftEventContent() {}

    ShiftEventContent(ShiftEventDto dto) {
        this.eventTime = dto.time();
        this.label = dto.label();
        this.title = dto.title();
        this.description = dto.description();
        this.tone = dto.tone();
    }

    ShiftEventDto toDto() { return new ShiftEventDto(eventTime, label, title, description, tone); }
}
