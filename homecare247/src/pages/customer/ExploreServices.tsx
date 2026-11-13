import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import {
  medkitOutline,
  shieldCheckmarkOutline,
  timeOutline,
  pulseOutline,
  flashOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  chevronForwardOutline,
  heartOutline,
} from 'ionicons/icons';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HeaderBar } from '../../components/HeaderBar';
import { BookingModal } from '../../components/BookingModal';
import { EmergencyModal } from '../../components/EmergencyModal';
import { ServiceItem } from '../../types';

export const ExploreServices: React.FC = () => {
  const { selectedCity } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('skilled-nursing');

  const fetchServices = async () => {
    try {
      const data = await api.getServices(activeCategory);
      setServices(data || []);
    } catch (e) {
      console.warn('Failed to fetch services', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeCategory]);

  const handleRefresh = async (e: CustomEvent) => {
    await fetchServices();
    e.detail.complete();
  };

  const openBookingFor = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  return (
    <IonPage>
      <HeaderBar onEmergencyClick={() => setEmergencyModalOpen(true)} />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Local City Hub Standby Banner */}
        <IonCard
          style={{
            margin: '0 0 16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #155dfc, #009588)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(21, 93, 252, 0.22)',
          }}
        >
          <IonCardContent style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                ● 24/7 Clinical Standby
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700 }}>
                Avg response: ~{selectedCity.avgResponseMinutes}m
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px', color: '#ffffff' }}>
              {selectedCity.availableStaffCount} Registered Caregivers in {selectedCity.name}
            </h2>
            <p style={{ fontSize: '12px', margin: '0 0 12px', opacity: 0.9 }}>
              100% Police Verified GNM nurses, ayah attendants & ICU setups with senior doctor supervision.
            </p>

            <IonButton
              fill="solid"
              color="light"
              size="small"
              onClick={() => openBookingFor('skilled-nursing')}
              style={{ fontWeight: 900, color: '#155dfc', '--border-radius': '10px' }}
            >
              Request Caregiver Now
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Category Filter Segments */}
        <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
          <IonSegment
            value={activeCategory}
            onIonChange={(e) => setActiveCategory(e.detail.value as string)}
            scrollable
            style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2px' }}
          >
            <IonSegmentButton value="all">
              <IonLabel style={{ fontSize: '11px', fontWeight: 700 }}>All Care</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="nursing">
              <IonLabel style={{ fontSize: '11px', fontWeight: 700 }}>Clinical Nursing</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="attendant">
              <IonLabel style={{ fontSize: '11px', fontWeight: 700 }}>Attendants</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="icu">
              <IonLabel style={{ fontSize: '11px', fontWeight: 700 }}>ICU at Home</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="physiotherapy">
              <IonLabel style={{ fontSize: '11px', fontWeight: 700 }}>Physiotherapy</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Services List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <IonSpinner name="crescent" color="primary" />
            <p style={{ fontSize: '12px', color: '#62748e', marginTop: '8px' }}>Loading clinical services...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '30px' }}>
            {services.map((service) => (
              <IonCard
                key={service.id}
                style={{
                  margin: 0,
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  boxShadow: '0 4px 16px rgba(15, 23, 43, 0.04)',
                }}
              >
                <IonCardHeader style={{ padding: '16px 16px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '12px',
                          background: service.isClinical ? '#eff6ff' : '#f0fdf4',
                          color: service.isClinical ? '#155dfc' : '#009767',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IonIcon icon={service.isClinical ? medkitOutline : heartOutline} style={{ fontSize: '20px' }} />
                      </div>
                      <div>
                        <IonCardTitle style={{ fontSize: '16px', fontWeight: 800, color: '#0f172b' }}>
                          {service.name || service.titleKey}
                        </IonCardTitle>
                        <span style={{ fontSize: '11px', color: '#62748e', fontWeight: 600 }}>
                          {service.isClinical ? 'Clinical Nursing (GNM/B.Sc)' : 'Non-Clinical Bedside Care'}
                        </span>
                      </div>
                    </div>

                    {service.badge && (
                      <IonBadge color="primary" style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '8px' }}>
                        {service.badge}
                      </IonBadge>
                    )}
                  </div>
                </IonCardHeader>

                <IonCardContent style={{ padding: '0 16px 16px' }}>
                  <p style={{ fontSize: '12px', color: '#62748e', lineHeight: 1.5, margin: '0 0 10px' }}>
                    {service.description}
                  </p>

                  {/* Pricing row */}
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', color: '#62748e', fontWeight: 700, textTransform: 'uppercase' }}>
                        Starting Rate
                      </span>
                      <div style={{ fontWeight: 900, color: '#0f172b', fontSize: '15px' }}>
                        {service.startingPrice}
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#62748e', fontWeight: 600 }}>
                      {service.pricePeriod}
                    </span>
                  </div>

                  {/* Key Features */}
                  <div style={{ marginBottom: '12px' }}>
                    {service.keyFeatures.slice(0, 3).map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#334155', marginBottom: '3px' }}>
                        <IonIcon icon={checkmarkCircleOutline} color="success" style={{ fontSize: '14px', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IonButton
                      expand="block"
                      fill="solid"
                      color="primary"
                      onClick={() => openBookingFor(service.id)}
                      style={{ flex: 1, fontWeight: 800, fontSize: '12px', '--border-radius': '10px', height: '38px' }}
                    >
                      Book Caregiver
                    </IonButton>

                    <IonButton
                      fill="outline"
                      color="secondary"
                      onClick={() => openBookingFor(service.id)}
                      style={{ fontWeight: 800, fontSize: '12px', '--border-radius': '10px', height: '38px' }}
                    >
                      Instant Quote
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {/* Floating SOS Emergency FAB Button */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{ marginBottom: '56px' }}>
          <IonFabButton color="danger" onClick={() => setEmergencyModalOpen(true)} style={{ width: '56px', height: '56px' }}>
            <IonIcon icon={flashOutline} style={{ fontSize: '24px' }} />
          </IonFabButton>
        </IonFab>

        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          preselectedServiceId={selectedServiceId}
          onSuccess={() => fetchServices()}
        />

        <EmergencyModal
          isOpen={emergencyModalOpen}
          onClose={() => setEmergencyModalOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

