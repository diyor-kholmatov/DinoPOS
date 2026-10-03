package uz.dinopos.landing.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "site_settings")
public class SiteSettings {
    @Id
    private Long id;
    private String contactEmail;
    private String contactPhone;
    private String contactTelegram;
    private Integer contentVersion;

    protected SiteSettings() {}

    public SiteSettings(Long id, String contactEmail, String contactPhone, String contactTelegram) {
        this.id = id;
        update(contactEmail, contactPhone, contactTelegram);
    }

    public void update(String contactEmail, String contactPhone, String contactTelegram) {
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.contactTelegram = contactTelegram;
        this.contentVersion = 2;
    }

    public String getContactEmail() { return contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public String getContactTelegram() { return contactTelegram; }
    public Integer getContentVersion() { return contentVersion; }
}
