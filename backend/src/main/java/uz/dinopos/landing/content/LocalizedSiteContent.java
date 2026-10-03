package uz.dinopos.landing.content;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "localized_site_content")
public class LocalizedSiteContent {
    @Id
    @Column(length = 5)
    private String locale;

    private String eyebrow;
    @Lob private String heroTitle;
    @Lob private String heroDescription;
    private String primaryCta;
    private String secondaryCta;
    private String storyKicker;
    @Lob private String storyTitle;
    @Lob private String storyDescription;
    @Lob private String rolesTitle;
    @Lob private String rolesIntro;
    private String founderKicker;
    @Lob private String founderQuote;
    private String founderName;
    @Lob private String pilotTitle;
    @Lob private String pilotDescription;

    @ElementCollection
    @CollectionTable(name = "localized_shift_events", joinColumns = @JoinColumn(name = "locale"))
    @OrderColumn(name = "sort_order")
    private List<ShiftEventContent> shiftEvents = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "localized_role_cards", joinColumns = @JoinColumn(name = "locale"))
    @OrderColumn(name = "sort_order")
    private List<RoleCardContent> roleCards = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "localized_pilot_features", joinColumns = @JoinColumn(name = "locale"))
    @OrderColumn(name = "sort_order")
    @Column(name = "feature", length = 240)
    private List<String> pilotFeatures = new ArrayList<>();

    protected LocalizedSiteContent() {}

    public LocalizedSiteContent(String locale, LocalizedContentDto content) {
        this.locale = locale;
        update(content);
    }

    public void update(LocalizedContentDto content) {
        eyebrow = content.eyebrow();
        heroTitle = content.heroTitle();
        heroDescription = content.heroDescription();
        primaryCta = content.primaryCta();
        secondaryCta = content.secondaryCta();
        storyKicker = content.storyKicker();
        storyTitle = content.storyTitle();
        storyDescription = content.storyDescription();
        rolesTitle = content.rolesTitle();
        rolesIntro = content.rolesIntro();
        founderKicker = content.founderKicker();
        founderQuote = content.founderQuote();
        founderName = content.founderName();
        pilotTitle = content.pilotTitle();
        pilotDescription = content.pilotDescription();
        shiftEvents.clear();
        shiftEvents.addAll(content.shiftEvents().stream().map(ShiftEventContent::new).toList());
        roleCards.clear();
        roleCards.addAll(content.roleCards().stream().map(RoleCardContent::new).toList());
        pilotFeatures.clear();
        pilotFeatures.addAll(content.pilotFeatures());
    }

    public String getLocale() { return locale; }

    public LocalizedContentDto toDto() {
        return new LocalizedContentDto(
            eyebrow, heroTitle, heroDescription, primaryCta, secondaryCta,
            storyKicker, storyTitle, storyDescription,
            shiftEvents.stream().map(ShiftEventContent::toDto).toList(),
            rolesTitle, rolesIntro,
            roleCards.stream().map(RoleCardContent::toDto).toList(),
            founderKicker, founderQuote, founderName,
            pilotTitle, pilotDescription, List.copyOf(pilotFeatures)
        );
    }
}
