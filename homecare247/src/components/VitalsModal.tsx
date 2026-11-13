import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonToast,
  IonBadge,
} from '@ionic/react';
import { closeOutline, pulseOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { api } from '../services/api';

interface Props {
  isOpen: boolean;
  bookingId: string;
  patientName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VitalsModal: React.FC<Props> = ({ isOpen, bookingId, patientName, onClose, onSuccess }) => {
  const [systolicBp, setSystolicBp] = useState<number | undefined>(120);
  const [diastolicBp, setDiastolicBp] = useState<number | undefined>(80);
  const [pulseBpm, setPulseBpm] = useState<number | undefined>(74);
  const [spo2Percent, setSpo2Percent] = useState<number | undefined>(98);
  const [temperature, setTemperature] = useState<number | undefined>(98.4);
  const [bloodSugar, setBloodSugar] = useState<number | undefined>();
  const [respiratoryRate, setRespiratoryRate] = useState<number | undefined>(16);
  const [actionsDone, setActionsDone] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Safety checks
  const isSpo2Low = spo2Percent !== undefined && spo2Percent < 93;
  const isBpHigh = systolicBp !== undefined && (systolicBp > 150 || (diastolicBp !== undefined && diastolicBp > 95));
  const isFever = temperature !== undefined && temperature > 100.4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      setToastMsg('No active booking selected for vitals recording');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.recordVitals({
        bookingId,
        systolicBp: systolicBp ? Number(systolicBp) : undefined,
        diastolicBp: diastolicBp ? Number(diastolicBp) : undefined,
        pulseBpm: pulseBpm ? Number(pulseBpm) : undefined,
        spo2Percent: spo2Percent ? Number(spo2Percent) : undefined,
        temperatureFahrenheit: temperature ? Number(temperature) : undefined,
        bloodSugarMgDl: bloodSugar ? Number(bloodSugar) : undefined,
        respiratoryRate: respiratoryRate ? Number(respiratoryRate) : undefined,
        nursingActionsDone: actionsDone || 'Bedside vital assessment, vital signs charting',
        patientConditionRemarks: remarks,
      });

      setToastMsg('Vitals recorded successfully in patient clinical chart!');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to record vitals');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.9} breakpoints={[0, 0.9, 1]}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ fontWeight: 900 }}>Record Bedside Vitals</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ marginBottom: '14px', background: '#eff6ff', padding: '10px 14px', borderRadius: '12px' }}>
          <span style={{ fontSize: '11px', color: '#1447e6', fontWeight: 800, textTransform: 'uppercase' }}>
            Active Patient Chart
          </span>
          <h3 style={{ margin: '2px 0 0', fontWeight: 800, color: '#0f172b', fontSize: '16px' }}>{patientName}</h3>
        </div>

        {/* Clinical Alert Warning if any vital is abnormal */}
        {(isSpo2Low || isBpHigh || isFever) && (
          <div
            style={{
              background: '#ffe2e2',
              border: '1px solid #ffc9c9',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#bf000f',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            <IonIcon icon={alertCircleOutline} style={{ fontSize: '18px' }} />
            <div>
              {isSpo2Low && '⚠️ Critical SpO2 < 93%! Administer oxygen. '}
              {isBpHigh && '⚠️ Elevated Blood Pressure. '}
              {isFever && '⚠️ High Fever detected.'}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* BP */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                SYSTOLIC BP (mmHg)
              </IonLabel>
              <IonInput
                type="number"
                placeholder="120"
                value={systolicBp}
                onIonInput={(e) => setSystolicBp(Number(e.detail.value))}
              />
            </IonItem>

            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                DIASTOLIC BP (mmHg)
              </IonLabel>
              <IonInput
                type="number"
                placeholder="80"
                value={diastolicBp}
                onIonInput={(e) => setDiastolicBp(Number(e.detail.value))}
              />
            </IonItem>
          </div>

          {/* Pulse & SpO2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                PULSE RATE (BPM)
              </IonLabel>
              <IonInput
                type="number"
                placeholder="72"
                value={pulseBpm}
                onIonInput={(e) => setPulseBpm(Number(e.detail.value))}
              />
            </IonItem>

            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                SPO2 OXYGEN (%)
              </IonLabel>
              <IonInput
                type="number"
                placeholder="98"
                value={spo2Percent}
                onIonInput={(e) => setSpo2Percent(Number(e.detail.value))}
              />
            </IonItem>
          </div>

          {/* Temp & Sugar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                TEMPERATURE (°F)
              </IonLabel>
              <IonInput
                type="number"
                step="0.1"
                placeholder="98.6"
                value={temperature}
                onIonInput={(e) => setTemperature(Number(e.detail.value))}
              />
            </IonItem>

            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                BLOOD SUGAR (mg/dL)
              </IonLabel>
              <IonInput
                type="number"
                placeholder="Optional"
                value={bloodSugar}
                onIonInput={(e) => setBloodSugar(Number(e.detail.value))}
              />
            </IonItem>
          </div>

          {/* Nursing Actions */}
          <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
            <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
              NURSING PROCEDURES / ACTIONS DONE
            </IonLabel>
            <IonInput
              placeholder="e.g. Catheter irrigation, IV infusion, Ryle tube feed, positioning"
              value={actionsDone}
              onIonInput={(e) => setActionsDone(e.detail.value || '')}
            />
          </IonItem>

          {/* Handover remarks */}
          <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '16px' }}>
            <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
              PATIENT CONDITION & HANDOVER NOTES
            </IonLabel>
            <IonTextarea
              rows={2}
              placeholder="e.g. Patient conscious, oriented, resting comfortably post medicine..."
              value={remarks}
              onIonInput={(e) => setRemarks(e.detail.value || '')}
            />
          </IonItem>

          <IonButton
            type="submit"
            expand="block"
            color="primary"
            disabled={isSubmitting}
            style={{ fontWeight: 900, '--border-radius': '14px', height: '48px' }}
          >
            {isSubmitting ? <IonSpinner name="crescent" /> : 'Save Vitals to Medical Chart'}
          </IonButton>
        </form>

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg || ''}
          duration={3000}
          onDidDismiss={() => setToastMsg(null)}
          color="dark"
        />
      </IonContent>
    </IonModal>
  );
};

