package uz.dinopos.landing.lead;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findAllByOrderByCreatedAtDesc();
}
