import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import { alertCircleOutline, flashOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { api } from '../../services/api';
import { HeaderBar } from '../../components/HeaderBar';

export const NurseIncident: React.FC = () => {
  const [incidentType, setIncidentType] = useState('PATIENT_DETERIORATION');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setToastMsg('Please enter details of the clinical event');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.reportNurseIncident({
        incidentType,
        severity,
        description,
      });
      setToastMsg('Clinical incident reported. Emergency medical response team notified.');
      setDescription('');
    } catch (e: any) {
      setToastMsg(e.message || 'Incident recorded.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <HeaderBar title="Report Safety & Incident" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonCard style={{ margin: '0 0 16px', borderRadius: '18px', border: '1px solid #ffc9c9', background: '#fff5f5' }}>
          <IonCardHeader style={{ padding: '16px 16px 8px' }}>
            <IonCardTitle style={{ fontSize: '16px', fontWeight: 900, color: '#bf000f', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IonIcon icon={alertCircleOutline} style={{ fontSize: '22px' }} />
              Clinical Escalation & Worker Safety
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent style={{ padding: '0 16px 16px' }}>
            <p style={{ fontSize: '12px', color: '#62748e', marginTop: 0, marginBottom: '14px', lineHeight: 1.5 }}>
              Use this form for acute patient deterioration, unsafe home environment, harassment, or severe clinical events requiring immediate physician intervention.
            </p>

            <form onSubmit={handleSubmit}>
              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  INCIDENT TYPE
                </IonLabel>
                <IonSelect value={incidentType} onIonChange={(e) => setIncidentType(e.detail.value)}>
                  <IonSelectOption value="PATIENT_DETERIORATION">Patient Clinical Deterioration</IonSelectOption>
                  <IonSelectOption value="SAFETY_CONCERN">Unsafe Environment / Risk</IonSelectOption>
                  <IonSelectOption value="CLINICAL_ERROR">Medication / Equipment Failure</IonSelectOption>
                  <IonSelectOption value="HARASSMENT">Hostile / Unprofessional Conduct</IonSelectOption>
                  <IonSelectOption value="SCOPE_VIOLATION">Forced Beyond Nursing Scope</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  SEVERITY LEVEL
                </IonLabel>
                <IonSelect value={severity} onIonChange={(e) => setSeverity(e.detail.value)}>
                  <IonSelectOption value="CRITICAL">🔴 CRITICAL (Immediate intervention)</IonSelectOption>
                  <IonSelectOption value="HIGH">🟠 HIGH</IonSelectOption>
                  <IonSelectOption value="MEDIUM">🟡 MEDIUM</IonSelectOption>
                  <IonSelectOption value="LOW">🟢 LOW</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '16px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  INCIDENT DETAILS & OBSERVATIONS *
                </IonLabel>
                <IonTextarea
                  required
                  rows={4}
                  placeholder="Detail vitals collapse, oxygen desaturation, family instructions, or immediate actions taken..."
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value || '')}
                />
              </IonItem>

              <IonButton
                type="submit"
                expand="block"
                color="danger"
                disabled={isSubmitting}
                style={{ fontWeight: 900, '--border-radius': '14px', height: '48px' }}
              >
                {isSubmitting ? <IonSpinner name="crescent" /> : '🚨 TRANSMIT EMERGENCY INCIDENT ALERT'}
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>

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

