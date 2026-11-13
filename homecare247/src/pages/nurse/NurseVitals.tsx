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
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonBadge,
} from '@ionic/react';
import { pulseOutline, alertCircleOutline, addCircleOutline, timeOutline } from 'ionicons/icons';
import { api } from '../../services/api';
import { HeaderBar } from '../../components/HeaderBar';
import { VitalsModal } from '../../components/VitalsModal';
import { Shift } from '../../types';

export const NurseVitals: React.FC = () => {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShift = async () => {
    try {
      const data = await api.getNurseDashboard();
      setActiveShift(data.activeShift);
    } catch (e) {
      console.warn('Failed to load active shift for vitals', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShift();
  }, []);

  const handleRefresh = async (e: CustomEvent) => {
    await fetchShift();
    e.detail.complete();
  };

  return (
    <IonPage>
      <HeaderBar title="Bedside Vitals Charting" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172b', margin: '0 0 4px' }}>
            Clinical Vitals & Nursing Chart
          </h2>
          <p style={{ fontSize: '12px', color: '#62748e', margin: 0 }}>
            Log BP, pulse, SpO2, temperature, and bedside procedures.
          </p>
        </div>

        {activeShift ? (
          <IonCard style={{ margin: '0 0 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardHeader style={{ padding: '16px 16px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#155dfc', fontWeight: 800, textTransform: 'uppercase' }}>
                    PATIENT ON DUTY
                  </span>
                  <IonCardTitle style={{ fontSize: '17px', fontWeight: 900, color: '#0f172b' }}>
                    {activeShift.patientName || 'Clinical Patient'}
                  </IonCardTitle>
                </div>
                <IonBadge color="success">Shift Active</IonBadge>
              </div>
            </IonCardHeader>

            <IonCardContent style={{ padding: '0 16px 16px' }}>
              <p style={{ fontSize: '12px', color: '#62748e', margin: '0 0 14px' }}>
                📍 {activeShift.patientAddress || 'Home Care Residence'}
              </p>

              <IonButton
                expand="block"
                color="primary"
                onClick={() => setModalOpen(true)}
                style={{ fontWeight: 900, height: '46px', '--border-radius': '12px' }}
              >
                <IonIcon icon={pulseOutline} slot="start" />
                Record New Vitals Assessment
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard style={{ margin: 0, textAlign: 'center', padding: '36px 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonIcon icon={pulseOutline} color="medium" style={{ fontSize: '48px', margin: '0 auto 12px' }} />
            <h3 style={{ fontWeight: 800, color: '#0f172b', margin: '0 0 6px' }}>No Patient on Active Shift</h3>
            <p style={{ fontSize: '12px', color: '#62748e', margin: 0 }}>
              Clock in to an assigned shift from the Duty tab to record bedside vital signs.
            </p>
          </IonCard>
        )}

        {/* Clinical Threshold Guidelines */}
        <IonCard style={{ margin: '16px 0 0', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <IonCardHeader style={{ padding: '14px 16px 6px' }}>
            <IonCardTitle style={{ fontSize: '14px', fontWeight: 800, color: '#0f172b' }}>
              🏥 Clinical Safety Thresholds (NABH Standards)
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ padding: '0 16px 14px', fontSize: '12px', color: '#475569' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px' }}>
                <strong style={{ color: '#0f172b' }}>SpO2 Target:</strong> ≥ 95%<br />
                <span style={{ fontSize: '10px', color: '#dc2626' }}>Alert if &lt; 93%</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px' }}>
                <strong style={{ color: '#0f172b' }}>Blood Pressure:</strong> 120/80<br />
                <span style={{ fontSize: '10px', color: '#dc2626' }}>Alert if &gt; 150/95</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px' }}>
                <strong style={{ color: '#0f172b' }}>Pulse Rate:</strong> 60 - 90 bpm<br />
                <span style={{ fontSize: '10px', color: '#dc2626' }}>Alert if &gt; 105 or &lt; 50</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px' }}>
                <strong style={{ color: '#0f172b' }}>Temperature:</strong> 98.4°F<br />
                <span style={{ fontSize: '10px', color: '#dc2626' }}>Fever if &gt; 100.4°F</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {activeShift && (
          <VitalsModal
            isOpen={modalOpen}
            bookingId={activeShift.bookingId}
            patientName={activeShift.patientName || 'Patient'}
            onClose={() => setModalOpen(false)}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

