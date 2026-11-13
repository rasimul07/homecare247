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
  IonToast,
  IonAlert,
} from '@ionic/react';
import {
  timeOutline,
  locationOutline,
  callOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  carOutline,
  logInOutline,
  logOutOutline,
  pulseOutline,
  alertCircleOutline,
  shieldCheckmarkOutline,
  personOutline,
} from 'ionicons/icons';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HeaderBar } from '../../components/HeaderBar';
import { VitalsModal } from '../../components/VitalsModal';
import { Shift } from '../../types';

export const NurseDuty: React.FC = () => {
  const { user } = useAuth();
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [pendingOffers, setPendingOffers] = useState<any[]>([]);
  const [availability, setAvailability] = useState<'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE'>('AVAILABLE');
  const [checklist, setChecklist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [clockOutAlertOpen, setClockOutAlertOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const data = await api.getNurseDashboard();
      setActiveShift(data.activeShift);
      setPendingOffers(data.pendingJobOffers || []);
      setChecklist(data.dutyChecklist || []);
      if (data.nurseProfile?.availabilityStatus) {
        setAvailability(data.nurseProfile.availabilityStatus);
      }
    } catch (e: any) {
      console.warn('Failed to fetch nurse dashboard', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = async (e: CustomEvent) => {
    await fetchDashboard();
    e.detail.complete();
  };

  const handleAvailabilityToggle = async (status: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE') => {
    setAvailability(status);
    try {
      await api.updateNurseAvailability(status);
      setToastMsg(`Status changed to ${status}`);
    } catch (e: any) {
      setToastMsg(e.message || 'Failed to update status');
    }
  };

  const handleEnRoute = async () => {
    if (!activeShift) return;
    try {
      await api.setNurseEnRoute(activeShift.id);
      setToastMsg('Marked En Route! Patient has been notified.');
      await fetchDashboard();
    } catch (e: any) {
      setToastMsg(e.message || 'Failed to set en route');
    }
  };

  const handleCheckIn = async () => {
    if (!activeShift) return;
    try {
      await api.checkInNurse(activeShift.id, { checkInNotes: 'Arrived at patient residence on schedule' });
      setToastMsg('Checked In! Duty started.');
      await fetchDashboard();
    } catch (e: any) {
      setToastMsg(e.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async (notes: string) => {
    if (!activeShift) return;
    try {
      await api.checkOutNurse(activeShift.id, { checkOutNotes: notes || 'Shift concluded smoothly, patient vitals stable' });
      setToastMsg('Shift Completed! Handover report submitted.');
      await fetchDashboard();
    } catch (e: any) {
      setToastMsg(e.message || 'Failed to check out');
    }
  };

  const handleOfferResponse = async (offerId: string, accept: boolean) => {
    try {
      await api.respondToJobOffer(offerId, accept);
      setToastMsg(accept ? 'Job Offer Accepted! Shift added to schedule.' : 'Job Offer Declined.');
      await fetchDashboard();
    } catch (e: any) {
      setToastMsg(e.message || 'Failed to respond to offer');
    }
  };

  return (
    <IonPage>
      <HeaderBar title="Nurse Duty Console" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Availability Status Bar */}
        <div style={{ marginBottom: '14px' }}>
          <span style={{ fontSize: '10px', color: '#62748e', fontWeight: 800, textTransform: 'uppercase', display: 'block', margin: '0 4px 6px' }}>
            MY ROSTER AVAILABILITY
          </span>
          <IonSegment
            value={availability}
            onIonChange={(e) => handleAvailabilityToggle(e.detail.value as any)}
            style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2px' }}
          >
            <IonSegmentButton value="AVAILABLE">
              <IonLabel style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a' }}>🟢 Available</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="ON_DUTY">
              <IonLabel style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb' }}>🔵 On Duty</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="ON_LEAVE">
              <IonLabel style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>⚪ On Leave</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Incoming Job Offers if any */}
        {pendingOffers.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              ⚡ INCOMING SHIFT ASSIGNMENT REQUESTS ({pendingOffers.length})
            </span>
            {pendingOffers.map((offer) => (
              <IonCard key={offer.id} style={{ margin: '0 0 10px', borderRadius: '16px', border: '1px solid #fed7aa', background: '#fffbeb' }}>
                <IonCardContent style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '14px', color: '#0f172b' }}>
                      {offer.booking?.patientName || 'New Patient'}
                    </strong>
                    <IonBadge color="warning">Pending Response</IonBadge>
                  </div>
                  <p style={{ fontSize: '12px', color: '#62748e', margin: '0 0 10px' }}>
                    📍 {offer.booking?.area} • ⏰ {offer.booking?.shiftDuration?.toUpperCase()} shift • {offer.booking?.patientCondition}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IonButton
                      size="small"
                      color="success"
                      expand="block"
                      onClick={() => handleOfferResponse(offer.id, true)}
                      style={{ flex: 1, fontWeight: 800, '--border-radius': '8px' }}
                    >
                      Accept Shift
                    </IonButton>
                    <IonButton
                      size="small"
                      color="medium"
                      fill="outline"
                      onClick={() => handleOfferResponse(offer.id, false)}
                      style={{ flex: 1, fontWeight: 800, '--border-radius': '8px' }}
                    >
                      Decline
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {/* Active Shift Card */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : activeShift ? (
          <IonCard
            style={{
              margin: '0 0 16px',
              borderRadius: '20px',
              border: '2px solid #2563eb',
              background: '#ffffff',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
            }}
          >
            <IonCardHeader style={{ padding: '16px 16px 10px', background: '#eff6ff', borderBottom: '1px solid #dbeafe' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase' }}>
                    CURRENT ACTIVE ASSIGNMENT
                  </span>
                  <IonCardTitle style={{ fontSize: '18px', fontWeight: 900, color: '#0f172b' }}>
                    {activeShift.patientName || 'Clinical Patient'}
                  </IonCardTitle>
                </div>
                <IonBadge color="primary" style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '8px' }}>
                  {activeShift.status}
                </IonBadge>
              </div>
            </IonCardHeader>

            <IonCardContent style={{ padding: '16px' }}>
              {/* Location & Time info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#475569', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IonIcon icon={locationOutline} color="primary" style={{ fontSize: '16px' }} />
                  <span>{activeShift.patientAddress || 'Patient Residence'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IonIcon icon={timeOutline} color="primary" style={{ fontSize: '16px' }} />
                  <span>Shift: {activeShift.startTime} - {activeShift.endTime} ({activeShift.shiftType})</span>
                </div>
              </div>

              {/* Duty Status Progression Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {activeShift.status === 'SCHEDULED' && (
                  <IonButton
                    expand="block"
                    color="primary"
                    onClick={handleEnRoute}
                    style={{ fontWeight: 800, height: '46px', '--border-radius': '12px' }}
                  >
                    <IonIcon icon={carOutline} slot="start" />
                    Start Travel (Mark En Route)
                  </IonButton>
                )}

                {(activeShift.status === 'SCHEDULED' || activeShift.status === 'EN_ROUTE') && (
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={handleCheckIn}
                    style={{ fontWeight: 800, height: '46px', '--border-radius': '12px' }}
                  >
                    <IonIcon icon={logInOutline} slot="start" />
                    Clock In at Patient Residence
                  </IonButton>
                )}

                {activeShift.status === 'CHECKED_IN' && (
                  <>
                    <IonButton
                      expand="block"
                      color="secondary"
                      onClick={() => setVitalsModalOpen(true)}
                      style={{ fontWeight: 800, height: '46px', '--border-radius': '12px' }}
                    >
                      <IonIcon icon={pulseOutline} slot="start" />
                      Record Bedside Vitals (Chart)
                    </IonButton>

                    <IonButton
                      expand="block"
                      color="danger"
                      fill="outline"
                      onClick={() => setClockOutAlertOpen(true)}
                      style={{ fontWeight: 800, height: '46px', '--border-radius': '12px' }}
                    >
                      <IonIcon icon={logOutOutline} slot="start" />
                      Clock Out & End Shift
                    </IonButton>
                  </>
                )}
              </div>

              {/* Patient Contact phone */}
              {activeShift.patientPhone && (
                <IonButton
                  fill="clear"
                  size="small"
                  href={`tel:${activeShift.patientPhone}`}
                  style={{ width: '100%', fontSize: '12px', fontWeight: 700 }}
                >
                  <IonIcon icon={callOutline} slot="start" />
                  Call Family Emergency: {activeShift.patientPhone}
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard style={{ margin: '0 0 16px', textAlign: 'center', padding: '30px 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonIcon icon={shieldCheckmarkOutline} color="success" style={{ fontSize: '48px', margin: '0 auto 10px' }} />
            <h3 style={{ fontWeight: 800, color: '#0f172b', margin: '0 0 4px' }}>No Active Duty Shift</h3>
            <p style={{ fontSize: '12px', color: '#62748e', margin: 0 }}>
              Keep availability toggled to <strong>Available</strong> to receive nearby shift assignments.
            </p>
          </IonCard>
        )}

        {/* Clinical Checklist Card */}
        {checklist.length > 0 && (
          <IonCard style={{ margin: 0, borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardHeader style={{ padding: '14px 16px 8px' }}>
              <IonCardTitle style={{ fontSize: '14px', fontWeight: 800, color: '#0f172b' }}>
                📋 NABH Bedside Protocol Checklist
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent style={{ padding: '0 16px 14px' }}>
              {checklist.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                  <IonIcon icon={checkmarkCircleOutline} color="success" style={{ fontSize: '15px', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </IonCardContent>
          </IonCard>
        )}

        {/* Vitals Modal */}
        {activeShift && (
          <VitalsModal
            isOpen={vitalsModalOpen}
            bookingId={activeShift.bookingId}
            patientName={activeShift.patientName || 'Patient'}
            onClose={() => setVitalsModalOpen(false)}
          />
        )}

        {/* Clock Out Alert with Handover Notes */}
        <IonAlert
          isOpen={clockOutAlertOpen}
          onDidDismiss={() => setClockOutAlertOpen(false)}
          header="Shift Handover & Clock Out"
          message="Enter nursing summary & vital stability for the medical record before ending shift:"
          inputs={[
            {
              name: 'handoverNotes',
              type: 'text',
              placeholder: 'Patient vitals stable, catheter emptied, medications given...',
            },
          ]}
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Clock Out',
              handler: (data) => handleCheckOut(data.handoverNotes),
            },
          ]}
        />

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg || ''}
          duration={3000}
          onDidDismiss={() => setToastMsg(null)}
          color="dark"
        />
      </IonContent>
    </IonPage>
  );
};

