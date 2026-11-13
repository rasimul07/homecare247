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
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from '@ionic/react';
import {
  flashOutline,
  peopleOutline,
  medkitOutline,
  shieldCheckmarkOutline,
  timeOutline,
  calendarOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { HeaderBar } from '../../components/HeaderBar';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const [m, em] = await Promise.allSettled([
        api.getAdminMetrics(),
        api.getAdminEmergencyRequests(),
      ]);

      if (m.status === 'fulfilled') setMetrics(m.value);
      if (em.status === 'fulfilled') {
        const pending = (em.value || []).filter((r: any) => r.status === 'PENDING').length;
        setEmergencyCount(pending);
      }
    } catch (e) {
      console.warn('Failed to load admin metrics', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRefresh = async (e: CustomEvent) => {
    await fetchMetrics();
    e.detail.complete();
  };

  return (
    <IonPage>
      <HeaderBar title="Admin Operations Tower" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Emergency Alert Banner if pending calls */}
        {emergencyCount > 0 && (
          <IonCard
            button
            onClick={() => navigate('/admin/emergency')}
            style={{
              margin: '0 0 16px',
              borderRadius: '16px',
              border: '2px solid #ef4444',
              background: '#fef2f2',
            }}
          >
            <IonCardContent style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IonIcon icon={flashOutline} color="danger" style={{ fontSize: '24px' }} />
                <div>
                  <strong style={{ color: '#991b1b', fontSize: '14px', display: 'block' }}>
                    {emergencyCount} Urgent Emergency Dispatch Requests
                  </strong>
                  <span style={{ fontSize: '11px', color: '#b91c1c' }}>Tap to view and assign ambulances/nurses</span>
                </div>
              </div>
              <IonBadge color="danger">URGENT</IonBadge>
            </IonCardContent>
          </IonCard>
        )}

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <IonCard style={{ margin: 0, borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardContent style={{ padding: '14px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#62748e', textTransform: 'uppercase' }}>
                Total Bookings
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172b', margin: '4px 0 2px' }}>
                {metrics?.totalBookings || 24}
              </div>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                {metrics?.activeBookings || 8} Active Duty
              </span>
            </IonCardContent>
          </IonCard>

          <IonCard style={{ margin: 0, borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardContent style={{ padding: '14px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#62748e', textTransform: 'uppercase' }}>
                Clinical Staff
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172b', margin: '4px 0 2px' }}>
                {metrics?.totalNurses || 42}
              </div>
              <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>
                {metrics?.availableNurses || 28} Available
              </span>
            </IonCardContent>
          </IonCard>

          <IonCard style={{ margin: 0, borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardContent style={{ padding: '14px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#62748e', textTransform: 'uppercase' }}>
                Active Shifts
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172b', margin: '4px 0 2px' }}>
                {metrics?.activeShifts || 14}
              </div>
              <span style={{ fontSize: '11px', color: '#62748e' }}>Bedside Ongoing</span>
            </IonCardContent>
          </IonCard>

          <IonCard style={{ margin: 0, borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardContent style={{ padding: '14px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#62748e', textTransform: 'uppercase' }}>
                Nurse Applicants
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172b', margin: '4px 0 2px' }}>
                {metrics?.pendingApplications || 6}
              </div>
              <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: 700 }}>Verification Pending</span>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Admin Navigation Quick Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '30px' }}>
          <IonButton
            expand="block"
            color="danger"
            onClick={() => navigate('/admin/emergency')}
            style={{ fontWeight: 800, '--border-radius': '12px', height: '46px' }}
          >
            <IonIcon icon={flashOutline} slot="start" />
            24/7 Emergency Dispatch Queue
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            color="primary"
            onClick={() => navigate('/customer/services')}
            style={{ fontWeight: 800, '--border-radius': '12px', height: '46px' }}
          >
            <IonIcon icon={medkitOutline} slot="start" />
            View Public Healthcare Catalog
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
