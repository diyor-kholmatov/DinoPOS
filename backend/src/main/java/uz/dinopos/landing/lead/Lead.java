package uz.dinopos.landing.lead;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "leads")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phone;
    private String businessName;
    private String city;
    private Integer storeCount;
    private String contactMethod;

    @Lob
    private String message;

    private String locale;

    @Enumerated(EnumType.STRING)
    private LeadStatus status;

    private Instant createdAt;

    protected Lead() {}

    public Lead(LeadCreateRequest request) {
        this.name = request.name().trim();
        this.phone = request.phone().trim();
        this.businessName = request.businessName().trim();
        this.city = normalize(request.city());
        this.storeCount = request.storeCount();
        this.contactMethod = request.contactMethod();
        this.message = normalize(request.message());
        this.locale = request.locale();
        this.status = LeadStatus.NEW;
        this.createdAt = Instant.now();
    }

    private static String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    public void setStatus(LeadStatus status) { this.status = status; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getBusinessName() { return businessName; }
    public String getCity() { return city; }
    public Integer getStoreCount() { return storeCount; }
    public String getContactMethod() { return contactMethod; }
    public String getMessage() { return message; }
    public String getLocale() { return locale; }
    public LeadStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
