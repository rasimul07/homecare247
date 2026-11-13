import React, { useState, useEffect } from 'react';
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
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonToast,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { closeOutline, checkmarkCircleOutline, calendarOutline, medkitOutline } from 'ionicons/icons';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Booking, ServiceItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  onSuccess?: (booking: Booking) => void;
}

export const BookingModal: React.FC<Props> = ({ isOpen, onClose, preselectedServiceId, onSuccess }) => {
  const { selectedCity, user } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceId, setServiceId] = useState(preselectedServiceId || 'skilled-nursing');
  const [shiftDuration, setShiftDuration] = useState('12d');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | undefined>();
  const [patientGender, setPatientGender] = useState('MALE');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [condition, setCondition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const list = await api.getServices();
        if (list && list.length > 0) {
          setServices(list);
        }
      } catch (e) {
        console.warn('Using default services list');
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (preselectedServiceId) {
      setServiceId(preselectedServiceId);
    }
    if (user) {
      setContactName(user.name);
      if (user.phone) setContactPhone(user.phone);
    }
  }, [preselectedServiceId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setToastMsg('Please enter the patient name');
      return;
    }
    if (!contactPhone.trim()) {
      setToastMsg('Please enter a 10-digit contact mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createBooking({
        patientName,
        patientAge: patientAge ? Number(patientAge) : undefined,
        patientGender,
        contactName: contactName || patientName,
        contactPhone,
        cityId: selectedCity.id,
        area: area || selectedCity.popularAreas[0] || 'Main Area',
        address,
        serviceId,
        shiftDuration,
        patientCondition: condition || 'Home care requirement',
      });

      setCreatedBooking(res);
      if (onSuccess) onSuccess(res);
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to place booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCreatedBooking(null);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose} initialBreakpoint={0.9} breakpoints={[0, 0.9, 1]}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ fontWeight: 900 }}>Book Healthcare Caregiver</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {createdBooking ? (
          <IonCard style={{ margin: 0, textAlign: 'center', padding: '24px 16px', borderRadius: '18px' }}>
            <IonIcon icon={checkmarkCircleOutline} color="success" style={{ fontSize: '64px', margin: '0 auto 12px' }} />
            <h2 style={{ fontWeight: 900, color: '#0f172b', margin: '0 0 8px' }}>Booking Confirmed!</h2>
            <p style={{ fontSize: '13px', color: '#62748e', lineHeight: 1.5, margin: '0 0 16px' }}>
              Your clinical service request for <strong>{createdBooking.patientName}</strong> in <strong>{selectedCity.name}</strong> has been logged.
            </p>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', textAlign: 'left', marginBottom: '16px', fontSize: '12px' }}>
              <div><strong>Booking ID:</strong> {createdBooking.id.slice(0, 8)}...</div>
              <div style={{ marginTop: '4px' }}><strong>Status:</strong> {createdBooking.status}</div>
              <div style={{ marginTop: '4px' }}><strong>City Hub:</strong> {selectedCity.name}</div>
              <div style={{ marginTop: '4px' }}><strong>Expected Arrival:</strong> ~{selectedCity.avgResponseMinutes} mins</div>
            </div>

            <IonButton color="primary" expand="block" onClick={handleClose}>
              Close & View Care Track
            </IonButton>
          </IonCard>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Service & Shift selection */}
            <div style={{ marginBottom: '14px' }}>
              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '8px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  SELECT CLINICAL SERVICE
                </IonLabel>
                <IonSelect
                  value={serviceId}
                  onIonChange={(e) => setServiceId(e.detail.value)}
                  style={{ width: '100%' }}
                >
                  <IonSelectOption value="skilled-nursing">Skilled Nursing Care (GNM / B.Sc)</IonSelectOption>
                  <IonSelectOption value="bedside-attendant">Bedside Caregiver / Ayah Service</IonSelectOption>
                  <IonSelectOption value="icu-at-home">ICU Setup at Home (Ventilator)</IonSelectOption>
                  <IonSelectOption value="elderly-dementia-care">Dementia & Alzheimer's Care</IonSelectOption>
                  <IonSelectOption value="physiotherapy-home">Home Physiotherapy & Rehab</IonSelectOption>
                  <IonSelectOption value="medical-equipment-rental">Medical Equipment Rental</IonSelectOption>
                  {services.map((s) => (
                    <IonSelectOption key={s.id} value={s.id}>
                      {s.name || s.titleKey} ({s.startingPrice})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonLabel style={{ fontWeight: 700, fontSize: '11px', color: '#62748e', display: 'block', margin: '8px 4px 6px' }}>
                DUTY SHIFT DURATION
              </IonLabel>
              <IonSegment
                value={shiftDuration}
                onIonChange={(e) => setShiftDuration(e.detail.value as string)}
                style={{ background: '#e2e8f0', borderRadius: '10px' }}
              >
                <IonSegmentButton value="12d">
                  <IonLabel style={{ fontSize: '11px', fontWeight: 700 }}>☀️ 12h Day</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="12n">
                  <IonLabel style={{ fontSize: '11px', fontWeight: 700 }}>🌙 12h Night</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="24h">
                  <IonLabel style={{ fontSize: '11px', fontWeight: 700 }}>⏰ 24h Live-in</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>

            {/* Patient details */}
            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                PATIENT FULL NAME *
              </IonLabel>
              <IonInput
                required
                placeholder="e.g. Maya Mukherjee"
                value={patientName}
                onIonInput={(e) => setPatientName(e.detail.value || '')}
              />
            </IonItem>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  AGE
                </IonLabel>
                <IonInput
                  type="number"
                  placeholder="e.g. 72"
                  value={patientAge}
                  onIonInput={(e) => setPatientAge(Number(e.detail.value) || undefined)}
                />
              </IonItem>

              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  GENDER
                </IonLabel>
                <IonSelect value={patientGender} onIonChange={(e) => setPatientGender(e.detail.value)}>
                  <IonSelectOption value="FEMALE">Female</IonSelectOption>
                  <IonSelectOption value="MALE">Male</IonSelectOption>
                  <IonSelectOption value="OTHER">Other</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>

            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                FAMILY CONTACT PHONE *
              </IonLabel>
              <IonInput
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={contactPhone}
                onIonInput={(e) => setContactPhone(e.detail.value || '')}
              />
            </IonItem>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  AREA / LOCALITY
                </IonLabel>
                <IonInput
                  placeholder="e.g. Salt Lake Sector 2"
                  value={area}
                  onIonInput={(e) => setArea(e.detail.value || '')}
                />
              </IonItem>

              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  CITY HUB
                </IonLabel>
                <IonInput readonly value={selectedCity.name} />
              </IonItem>
            </div>

            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                FULL RESIDENCE ADDRESS
              </IonLabel>
              <IonInput
                placeholder="House no, Street, Landmark"
                value={address}
                onIonInput={(e) => setAddress(e.detail.value || '')}
              />
            </IonItem>

            <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '16px' }}>
              <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                MEDICAL CONDITION / CLINICAL NOTES
              </IonLabel>
              <IonTextarea
                rows={2}
                placeholder="e.g. Tracheostomy care, Ryle's tube feeding, post-stroke paralysis..."
                value={condition}
                onIonInput={(e) => setCondition(e.detail.value || '')}
              />
            </IonItem>

            <IonButton
              type="submit"
              expand="block"
              color="primary"
              disabled={isSubmitting}
              style={{ fontWeight: 900, '--border-radius': '14px', height: '48px' }}
            >
              {isSubmitting ? <IonSpinner name="crescent" /> : 'Confirm & Request Caregiver'}
            </IonButton>
          </form>
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

