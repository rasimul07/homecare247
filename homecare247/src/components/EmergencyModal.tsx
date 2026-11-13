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
} from '@ionic/react';
import {
  closeOutline,
  alertCircleOutline,
  callOutline,
  logoWhatsapp,
  flashOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedCity } = useAuth();
  const [callerPhone, setCallerPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [area, setArea] = useState('');
  const [condition, setCondition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerPhone.trim()) {
      setToastMsg('Please enter a 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createEmergencyRequest({
        callerPhone,
        patientName: patientName || 'Urgent Patient',
        city: selectedCity.id,
        area,
        patientCondition: condition || 'Immediate caregiver / ICU dispatch needed',
      });
      setIsSuccess(true);
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to submit emergency alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCallerPhone('');
    setPatientName('');
    setArea('');
    setCondition('');
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleReset} initialBreakpoint={0.85} breakpoints={[0, 0.85, 1]}>
      <IonHeader>
        <IonToolbar color="danger">
          <IonTitle style={{ fontWeight: 900 }}>🚨 24/7 Urgent Dispatch</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleReset}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Direct Call & WhatsApp Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <IonButton
            color="danger"
            expand="block"
            href={`tel:${selectedCity.emergencyPhone}`}
            style={{ fontWeight: 800, fontSize: '13px' }}
          >
            <IonIcon icon={callOutline} slot="start" />
            Direct Call
          </IonButton>

          <IonButton
            color="success"
            expand="block"
            href={`https://wa.me/${selectedCity.whatsappPhone}?text=URGENT%20CLINICAL%20ASSISTANCE%20IN%20${selectedCity.name}`}
            target="_blank"
            style={{ fontWeight: 800, fontSize: '13px' }}
          >
            <IonIcon icon={logoWhatsapp} slot="start" />
            WhatsApp
          </IonButton>
        </div>

        {isSuccess ? (
          <IonCard style={{ margin: 0, textAlign: 'center', padding: '24px 16px', borderRadius: '18px' }}>
            <IonIcon icon={checkmarkCircleOutline} color="success" style={{ fontSize: '56px', margin: '0 auto 12px' }} />
            <h2 style={{ fontWeight: 900, color: '#0f172b', margin: '0 0 8px' }}>Alert Dispatched!</h2>
            <p style={{ fontSize: '13px', color: '#62748e', lineHeight: 1.5, margin: '0 0 16px' }}>
              Our Senior Medical Dispatcher in <strong>{selectedCity.name}</strong> has received your urgent call. We will contact <strong>{callerPhone}</strong> within 5 minutes.
            </p>
            <IonButton color="primary" expand="block" onClick={handleReset}>
              Done
            </IonButton>
          </IonCard>
        ) : (
          <IonCard style={{ margin: 0, borderRadius: '18px', border: '1px solid #ffc9c9', background: '#fff5f5' }}>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#bf000f', marginBottom: '12px' }}>
                <IonIcon icon={flashOutline} style={{ fontSize: '20px' }} />
                <strong style={{ fontSize: '14px' }}>Request 10-Minute Clinical Callback</strong>
              </div>

              <form onSubmit={handleSubmit}>
                <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '12px', color: '#62748e' }}>
                    YOUR PHONE NUMBER *
                  </IonLabel>
                  <IonInput
                    type="tel"
                    required
                    placeholder="e.g. 9830024701"
                    value={callerPhone}
                    onIonInput={(e) => setCallerPhone(e.detail.value || '')}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '12px', color: '#62748e' }}>
                    PATIENT NAME
                  </IonLabel>
                  <IonInput
                    type="text"
                    placeholder="e.g. Nirmal Ghosh"
                    value={patientName}
                    onIonInput={(e) => setPatientName(e.detail.value || '')}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '12px', color: '#62748e' }}>
                    AREA / LOCALITY ({selectedCity.name})
                  </IonLabel>
                  <IonInput
                    type="text"
                    placeholder="e.g. Salt Lake Sector 1, Newtown"
                    value={area}
                    onIonInput={(e) => setArea(e.detail.value || '')}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '16px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '12px', color: '#62748e' }}>
                    URGENT REQUIREMENT / CONDITION
                  </IonLabel>
                  <IonTextarea
                    rows={2}
                    placeholder="e.g. ICU ventilator setup, oxygen, post-op vitals drop..."
                    value={condition}
                    onIonInput={(e) => setCondition(e.detail.value || '')}
                  />
                </IonItem>

                <IonButton
                  type="submit"
                  expand="block"
                  color="danger"
                  disabled={isSubmitting}
                  style={{ fontWeight: 900, '--border-radius': '12px', height: '48px' }}
                >
                  {isSubmitting ? <IonSpinner name="crescent" /> : '🚨 DISPATCH MEDICAL TEAM NOW'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        )}

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

