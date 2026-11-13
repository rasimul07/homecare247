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
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import { documentTextOutline, medkitOutline, alertCircleOutline } from 'ionicons/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { HeaderBar } from '../../components/HeaderBar';
import { Booking } from '../../types';

export const DoctorClinicalNote: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const prefillBookingId = searchParams.get('bookingId');

  const [patients, setPatients] = useState<Booking[]>([]);
  const [bookingId, setBookingId] = useState(prefillBookingId || '');
  const [summary, setSummary] = useState('');
  const [assessment, setAssessment] = useState('');
  const [medicines, setMedicines] = useState('');
  const [nurseOrders, setNurseOrders] = useState('');
  const [flagAlert, setFlagAlert] = useState(false);
  const [alertReason, setAlertReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const list = await api.getDoctorPatients();
        setPatients(list || []);
        if (!bookingId && list && list.length > 0) {
          setBookingId(list[0].id);
        }
      } catch (e) {
        console.warn('Failed to load patients for note', e);
      }
    };
    loadPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      setToastMsg('Please select a patient case');
      return;
    }
    if (!summary.trim() || !assessment.trim()) {
      setToastMsg('Please complete the summary and clinical assessment');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.addClinicalNote({
        bookingId,
        patientConditionSummary: summary,
        clinicalAssessment: assessment,
        medicineChanges: medicines,
        nurseCarePlan: nurseOrders,
        flagCriticalAlert: flagAlert,
        criticalAlertReason: flagAlert ? alertReason || 'Physician Critical Flag' : undefined,
      });

      setToastMsg('Doctor clinical note & treatment guidelines recorded successfully!');
      setTimeout(() => {
        navigate('/doctor/patients');
      }, 700);
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to submit clinical note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <HeaderBar title="Doctor Assessment" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonCard style={{ margin: '0 0 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <IonCardHeader style={{ padding: '16px 16px 8px' }}>
            <IonCardTitle style={{ fontSize: '17px', fontWeight: 900, color: '#0f172b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IonIcon icon={documentTextOutline} color="primary" />
              Progress Assessment & Medical Orders
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent style={{ padding: '0 16px 16px' }}>
            <p style={{ fontSize: '12px', color: '#62748e', marginTop: 0, marginBottom: '14px' }}>
              Supervisory assessment notes are logged directly into the patient's digital chart and sent to attending GNM nurses.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Select Patient Case */}
              <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  SELECT PATIENT CASE *
                </IonLabel>
                <IonSelect value={bookingId} onIonChange={(e) => setBookingId(e.detail.value)}>
                  {patients.map((p) => (
                    <IonSelectOption key={p.id} value={p.id}>
                      {p.patientName} ({p.area}, {p.cityId})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              {/* Condition Summary */}
              <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  PATIENT CONDITION SUMMARY *
                </IonLabel>
                <IonInput
                  required
                  placeholder="e.g. Post-CABG Day 12, recovering from pneumonia"
                  value={summary}
                  onIonInput={(e) => setSummary(e.detail.value || '')}
                />
              </IonItem>

              {/* Clinical Assessment */}
              <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  CLINICAL EVALUATION & PROGRESS ASSESSMENT *
                </IonLabel>
                <IonTextarea
                  required
                  rows={3}
                  placeholder="Evaluate chest clearance, vitals trend, wound healing, mobility progress..."
                  value={assessment}
                  onIonInput={(e) => setAssessment(e.detail.value || '')}
                />
              </IonItem>

              {/* Prescription Changes */}
              <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  PRESCRIPTION & MEDICINE ADJUSTMENTS
                </IonLabel>
                <IonTextarea
                  rows={2}
                  placeholder="e.g. Continue Nebulization BD, taper Pantocid, add Tab Augmentin 625mg..."
                  value={medicines}
                  onIonInput={(e) => setMedicines(e.detail.value || '')}
                />
              </IonItem>

              {/* Nurse Care Plan Orders */}
              <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '12px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  NURSING PROTOCOL & BEDSIDE INSTRUCTIONS
                </IonLabel>
                <IonTextarea
                  rows={2}
                  placeholder="e.g. Check SpO2 Q4H, suction every 6 hours, 2-hourly position change..."
                  value={nurseOrders}
                  onIonInput={(e) => setNurseOrders(e.detail.value || '')}
                />
              </IonItem>

              {/* Critical Alert Toggle */}
              <IonItem lines="none" style={{ '--background': '#fff1f2', borderRadius: '12px', marginBottom: '16px' }}>
                <IonIcon icon={alertCircleOutline} slot="start" color="danger" />
                <IonLabel style={{ fontSize: '12px', fontWeight: 700, color: '#9f1239' }}>
                  Flag Critical Clinical Alert
                </IonLabel>
                <IonToggle checked={flagAlert} onIonChange={(e) => setFlagAlert(e.detail.checked)} color="danger" />
              </IonItem>

              <IonButton
                type="submit"
                expand="block"
                color="primary"
                disabled={isSubmitting}
                style={{ fontWeight: 900, '--border-radius': '14px', height: '48px' }}
              >
                {isSubmitting ? <IonSpinner name="crescent" /> : 'Sign & Submit Clinical Order'}
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
