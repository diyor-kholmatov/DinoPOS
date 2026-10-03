package uz.dinopos.landing.content;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "localized_site_content")
public class LocalizedSiteContent {
    @Id
    @Column(length = 5)
    private String locale;

    private String eyebrow;

    @Lob
    private String heroTitle;

    @Lob
    private String heroDescription;

    private String primaryCta;
    private String secondaryCta;

    @Lob
    private String problemTitle;

    @Lob
    private String solutionTitle;

    @Lob
    private String finalCtaTitle;

    @Lob
    private String finalCtaDescription;

    protected LocalizedSiteContent() {}

    public LocalizedSiteContent(String locale, LocalizedContentDto content) {
        this.locale = locale;
        update(content);
    }

    public void update(LocalizedContentDto content) {
        this.eyebrow = content.eyebrow();
        this.heroTitle = content.heroTitle();
        this.heroDescription = content.heroDescription();
        this.primaryCta = content.primaryCta();
        this.secondaryCta = content.secondaryCta();
        this.problemTitle = content.problemTitle();
        this.solutionTitle = content.solutionTitle();
        this.finalCtaTitle = content.finalCtaTitle();
        this.finalCtaDescription = content.finalCtaDescription();
    }

    public String getLocale() { return locale; }
    public LocalizedContentDto toDto() {
        return new LocalizedContentDto(eyebrow, heroTitle, heroDescription, primaryCta, secondaryCta, problemTitle, solutionTitle, finalCtaTitle, finalCtaDescription);
    }
}
