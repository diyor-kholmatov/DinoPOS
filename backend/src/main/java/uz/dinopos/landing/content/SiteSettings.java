package uz.dinopos.landing.content;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "site_settings")
public class SiteSettings {
    @Id
    private Long id;
    private String starterPrice;
    private String standardPrice;
    private String proPrice;
    private String contactEmail;

    protected SiteSettings() {}

    public SiteSettings(Long id, String starterPrice, String standardPrice, String proPrice, String contactEmail) {
        this.id = id;
        update(starterPrice, standardPrice, proPrice, contactEmail);
    }

    public void update(String starterPrice, String standardPrice, String proPrice, String contactEmail) {
        this.starterPrice = starterPrice;
        this.standardPrice = standardPrice;
        this.proPrice = proPrice;
        this.contactEmail = contactEmail;
    }

    public String getStarterPrice() { return starterPrice; }
    public String getStandardPrice() { return standardPrice; }
    public String getProPrice() { return proPrice; }
    public String getContactEmail() { return contactEmail; }
}
