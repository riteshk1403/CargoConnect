package com.cargoconnect.repository;

import com.cargoconnect.model.ShipmentPartnerOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentPartnerOfferRepository extends JpaRepository<ShipmentPartnerOffer, Long> {
    List<ShipmentPartnerOffer> findByShipmentId(Long shipmentId);
    List<ShipmentPartnerOffer> findByCargoPartnerId(Long cargoPartnerId);
    List<ShipmentPartnerOffer> findByCargoPartnerIdAndStatus(Long cargoPartnerId, ShipmentPartnerOffer.OfferStatus status);
    Optional<ShipmentPartnerOffer> findByShipmentIdAndCargoPartnerId(Long shipmentId, Long cargoPartnerId);

    @Query("SELECT o FROM ShipmentPartnerOffer o WHERE o.shipmentId = :shipmentId AND o.status = 'ACCEPTED' ORDER BY o.acceptancePriority ASC, o.respondedAt ASC")
    List<ShipmentPartnerOffer> findAcceptedOffersOrderedByPriority(@Param("shipmentId") Long shipmentId);

    @Query("SELECT COUNT(o) FROM ShipmentPartnerOffer o WHERE o.shipmentId = :shipmentId AND o.status = 'ACCEPTED'")
    long countAcceptedOffers(@Param("shipmentId") Long shipmentId);
}
