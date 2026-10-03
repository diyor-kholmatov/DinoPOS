package uz.dinopos.landing.content;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Lob;

@Embeddable
public class RoleCardContent {
    private String roleName;
    private String title;
    @Lob
    private String description;

    protected RoleCardContent() {}

    RoleCardContent(RoleCardDto dto) {
        this.roleName = dto.role();
        this.title = dto.title();
        this.description = dto.description();
    }

    RoleCardDto toDto() { return new RoleCardDto(roleName, title, description); }
}
