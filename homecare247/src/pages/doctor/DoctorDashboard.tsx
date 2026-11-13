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
  medkitOutline,
  peopleOutline,
  pulseOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  documentTextOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { HeaderBar } from '../../components/HeaderBar';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const data = await api.getDoctorDashboard();
      setDashboard(data);
    } catch (e) {
      console.warn('Failed to load doctor dashboard', e);
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

  return (
    <IonPage>
      <HeaderBar title="Doctor Clinical Governance" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Doctor Header Banner */}
        <IonCard
          style={{
            margin: '0 0 16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #155dfc, #4f39f6)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(21, 93, 252, 0.2)',
          }}
        >
          <IonCardContent style={{ padding: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9 }}>
              👨‍⚕️ SENIOR ATTENDING PHYSICIAN
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0 4px', color: '#ffffff' }}>
              {dashboard?.doctorName || 'Dr. Arindam Mukherjee, MD'}
            </h2>
            <p style={{ fontSize: '12px', margin: '0 0 14px', opacity: 0.9 }}>
              {dashboard?.specialization || 'Critical Care & Pulmonology'} • Oversight & Home Patient Care
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '8px', borderRadius: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{dashboard?.activePatientsCount || 3}</div>
                <span style={{ fontSize: '10px', opacity: 0.9 }}>Active Cases</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '8px', borderRadius: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{dashboard?.totalSupervised || 8}</div>
                <span style={{ fontSize: '10px', opacity: 0.9 }}>Supervised</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '8px', borderRadius: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{dashboard?.completedCases || 5}</div>
                <span style={{ fontSize: '10px', opacity: 0.9 }}>Discharged</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Recent Critical Alerts */}
        {dashboard?.recentVitalAlerts && dashboard.recentVitalAlerts.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              ⚠️ ACTIVE CLINICAL ALERTS ({dashboard.recentVitalAlerts.length})
            </span>
            {dashboard.recentVitalAlerts.map((alert: any) => (
              <IonCard key={alert.id} style={{ margin: '0 0 8px', borderRadius: '14px', border: '1px solid #fca5a5', background: '#fef2f2' }}>
                <IonCardContent style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: '#991b1b' }}>{alert.patientName || 'Patient Alert'}</strong>
                    <IonBadge color="danger">SpO2 {alert.spo2Percent || 91}%</IonBadge>
                  </div>
                  <p style={{ fontSize: '11px', color: '#7f1d1d', margin: 0 }}>
                    BP: {alert.systolicBp}/{alert.diastolicBp} • Pulse: {alert.pulseBpm} • {alert.alertReason || 'Desaturation warning'}
                  </p>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <IonButton
            expand="block"
            color="primary"
            onClick={() => navigate('/doctor/patients')}
            style={{ fontWeight: 800, fontSize: '12px', '--border-radius': '12px', height: '46px' }}
          >
            <IonIcon icon={peopleOutline} slot="start" />
            Supervised Patients
          </IonButton>

          <IonButton
            expand="block"
            color="secondary"
            onClick={() => navigate('/doctor/note')}
            style={{ fontWeight: 800, fontSize: '12px', '--border-radius': '12px', height: '46px' }}
          >
            <IonIcon icon={documentTextOutline} slot="start" />
            Add Doctor Note
          </IonButton>
        </div>

        {/* Supervised Patients Preview */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172b', margin: '0 0 10px' }}>
            Active Home Patients
          </h3>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <IonSpinner name="crescent" color="primary" />
            </div>
          ) : dashboard?.assignedPatients && dashboard.assignedPatients.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dashboard.assignedPatients.map((p: any) => (
                <IonCard
                  key={p.id}
                  button
                  onClick={() => navigate('/doctor/patients')}
                  style={{ margin: 0, borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}
                >
                  <IonCardContent style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#0f172b', display: 'block' }}>
                        {p.patientName}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#62748e' }}>
                        {p.serviceId} • {p.area} • Nurse: {p.assignedNurse?.name || 'On Duty'}
                      </span>
                    </div>
                    <IonIcon icon={chevronForwardOutline} color="medium" />
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          ) : (
            <IonCard style={{ margin: 0, padding: '24px', textAlign: 'center', borderRadius: '16px', background: '#ffffff' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#62748e' }}>No patients assigned currently</p>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
