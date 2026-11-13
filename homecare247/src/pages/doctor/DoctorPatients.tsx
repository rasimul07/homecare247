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
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from '@ionic/react';
import {
  peopleOutline,
  pulseOutline,
  documentTextOutline,
  closeOutline,
  checkmarkCircleOutline,
  timeOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { HeaderBar } from '../../components/HeaderBar';
import { Booking } from '../../types';

export const DoctorPatients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [clinicalHistory, setClinicalHistory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchPatients = async () => {
    try {
      const data = await api.getDoctorPatients();
      setPatients(data || []);
    } catch (e) {
      console.warn('Failed to fetch doctor patients', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRefresh = async (e: CustomEvent) => {
    await fetchPatients();
    e.detail.complete();
  };

  const openPatientHistory = async (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setHistoryLoading(true);
    try {
      const data = await api.getClinicalHistory(bookingId);
      setClinicalHistory(data);
    } catch (e) {
      console.warn('Failed to load history', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <IonPage>
      <HeaderBar title="Supervised Patients" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172b', margin: '0 0 4px' }}>
            Under Doctor Clinical Governance
          </h2>
          <p style={{ fontSize: '12px', color: '#62748e', margin: 0 }}>
            Review bedside vitals, nursing care records, and prescribe treatment updates.
          </p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : patients.length === 0 ? (
          <IonCard style={{ margin: 0, textAlign: 'center', padding: '36px 16px', borderRadius: '18px', background: '#ffffff' }}>
            <IonIcon icon={peopleOutline} color="medium" style={{ fontSize: '48px', margin: '0 auto 12px' }} />
            <h4 style={{ fontWeight: 800, color: '#0f172b', margin: '0 0 4px' }}>No Assigned Patients</h4>
            <p style={{ fontSize: '12px', color: '#62748e', margin: 0 }}>
              Patients assigned by the clinical supervisor will show up here.
            </p>
          </IonCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '30px' }}>
            {patients.map((patient) => (
              <IonCard
                key={patient.id}
                style={{
                  margin: 0,
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                }}
              >
                <IonCardHeader style={{ padding: '16px 16px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#155dfc', fontWeight: 800, textTransform: 'uppercase' }}>
                        HOMECARE CASE
                      </span>
                      <IonCardTitle style={{ fontSize: '16px', fontWeight: 900, color: '#0f172b' }}>
                        {patient.patientName}
                      </IonCardTitle>
                    </div>
                    <IonBadge color="primary">{patient.status}</IonBadge>
                  </div>
                </IonCardHeader>

                <IonCardContent style={{ padding: '0 16px 16px' }}>
                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                    <div>📍 Location: {patient.area}, {patient.cityId}</div>
                    <div>🩺 Condition: {patient.patientCondition || 'General Clinical Care'}</div>
                    <div>👩‍⚕️ Nurse: {patient.assignedNurse?.name || 'Assigned Staff'}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IonButton
                      expand="block"
                      fill="outline"
                      size="small"
                      color="primary"
                      onClick={() => openPatientHistory(patient.id)}
                      style={{ flex: 1, fontWeight: 800, fontSize: '11px', '--border-radius': '10px' }}
                    >
                      <IonIcon icon={pulseOutline} slot="start" />
                      View Vitals Chart
                    </IonButton>

                    <IonButton
                      expand="block"
                      fill="solid"
                      size="small"
                      color="secondary"
                      onClick={() => navigate(`/doctor/note?bookingId=${patient.id}`)}
                      style={{ flex: 1, fontWeight: 800, fontSize: '11px', '--border-radius': '10px' }}
                    >
                      <IonIcon icon={documentTextOutline} slot="start" />
                      Add Assessment
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {/* Patient Clinical History Modal */}
        <IonModal isOpen={!!selectedBookingId} onDidDismiss={() => setSelectedBookingId(null)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle style={{ fontWeight: 900 }}>Bedside Clinical History</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setSelectedBookingId(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            {historyLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <IonSpinner name="crescent" color="primary" />
              </div>
            ) : clinicalHistory ? (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172b', margin: '0 0 12px' }}>
                  Patient: {clinicalHistory.booking?.patientName}
                </h3>

                {/* Vitals records timeline */}
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#155dfc', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  📊 Bedside Vitals Log ({clinicalHistory.clinicalRecords?.length || 0} entries)
                </span>

                {clinicalHistory.clinicalRecords && clinicalHistory.clinicalRecords.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {clinicalHistory.clinicalRecords.map((r: any) => (
                      <IonCard key={r.id} style={{ margin: 0, borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <IonCardContent style={{ padding: '12px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <strong style={{ color: '#0f172b' }}>
                              BP: {r.systolicBp}/{r.diastolicBp} mmHg • SpO2: {r.spo2Percent}%
                            </strong>
                            <span style={{ fontSize: '10px', color: '#62748e' }}>
                              {new Date(r.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div style={{ color: '#475569', fontSize: '11px' }}>
                            Pulse: {r.pulseBpm} bpm • Temp: {r.temperatureFahrenheit}°F
                          </div>

                          {r.nursingActionsDone && (
                            <div style={{ marginTop: '4px', color: '#1e293b', fontStyle: 'italic', fontSize: '11px' }}>
                              Actions: {r.nursingActionsDone}
                            </div>
                          )}
                        </IonCardContent>
                      </IonCard>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: '#62748e', marginBottom: '20px' }}>No bedside vitals recorded yet.</p>
                )}

                {/* Doctor Clinical Notes */}
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#009588', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  📝 Doctor Notes & Treatment Adjustments
                </span>

                {clinicalHistory.doctorNotes && clinicalHistory.doctorNotes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {clinicalHistory.doctorNotes.map((note: any) => (
                      <IonCard key={note.id} style={{ margin: 0, borderRadius: '14px', border: '1px solid #ccfbf1', background: '#f0fdfa' }}>
                        <IonCardContent style={{ padding: '12px', fontSize: '12px' }}>
                          <div style={{ fontWeight: 800, color: '#0f766e', marginBottom: '4px' }}>
                            {note.patientConditionSummary}
                          </div>
                          <p style={{ margin: '0 0 6px', color: '#334155' }}>{note.clinicalAssessment}</p>
                          {note.medicineChanges && (
                            <div style={{ color: '#b91c1c', fontWeight: 700, fontSize: '11px' }}>
                              Prescription: {note.medicineChanges}
                            </div>
                          )}
                        </IonCardContent>
                      </IonCard>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: '#62748e' }}>No clinical notes logged yet.</p>
                )}
              </div>
            ) : null}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
