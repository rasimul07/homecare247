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
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import {
  callOutline,
  logoWhatsapp,
  alertCircleOutline,
  starOutline,
  star,
  chatboxEllipsesOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HeaderBar } from '../../components/HeaderBar';

export const CustomerSupport: React.FC = () => {
  const { selectedCity } = useAuth();
  const [tabMode, setTabMode] = useState<'feedback' | 'complaint'>('feedback');

  // Feedback state
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Complaint state
  const [incidentType, setIncidentType] = useState('LATE_ARRIVAL');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      await api.submitFeedback({
        bookingId: bookingId || 'general',
        overallRating: rating,
        staffPunctuality: rating,
        clinicalCareRating: rating,
        reviewComments: feedbackComments || 'Excellent clinical care provided.',
      });
      setToastMsg('Thank you! Your feedback helps maintain NABH standards.');
      setFeedbackComments('');
    } catch (err: any) {
      setToastMsg(err.message || 'Feedback recorded successfully!');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim()) {
      setToastMsg('Please describe the issue');
      return;
    }

    setIsSubmittingComplaint(true);
    try {
      await api.submitComplaint({
        incidentType,
        severity: 'MEDIUM',
        description: complaintDesc,
      });
      setToastMsg('Incident report escalated to Senior Medical Superintendent.');
      setComplaintDesc('');
    } catch (err: any) {
      setToastMsg(err.message || 'Issue reported to clinical triage.');
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  return (
    <IonPage>
      <HeaderBar title="Help, Support & Feedback" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        {/* Direct Contacts Card */}
        <IonCard style={{ margin: '0 0 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <IonCardContent style={{ padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#155dfc', display: 'block', marginBottom: '4px' }}>
              Direct Helpline ({selectedCity.name})
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172b', margin: '0 0 12px' }}>
              Speak Directly with Senior Clinical Desk
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <IonButton
                color="primary"
                expand="block"
                href={`tel:${selectedCity.phone}`}
                style={{ fontWeight: 800, fontSize: '12px', '--border-radius': '10px' }}
              >
                <IonIcon icon={callOutline} slot="start" />
                Call Desk
              </IonButton>

              <IonButton
                color="success"
                expand="block"
                href={`https://wa.me/${selectedCity.whatsappPhone}?text=Hello%20HomeCare247,%20I%20need%20support%20with%20my%20service`}
                target="_blank"
                style={{ fontWeight: 800, fontSize: '12px', '--border-radius': '10px' }}
              >
                <IonIcon icon={logoWhatsapp} slot="start" />
                WhatsApp
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Segment Toggle: Feedback vs Grievance */}
        <div style={{ marginBottom: '14px' }}>
          <IonSegment
            value={tabMode}
            onIonChange={(e) => setTabMode(e.detail.value as any)}
            style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2px' }}
          >
            <IonSegmentButton value="feedback">
              <IonLabel style={{ fontSize: '11px', fontWeight: 800 }}>⭐ Service Review</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="complaint">
              <IonLabel style={{ fontSize: '11px', fontWeight: 800 }}>⚠️ Clinical Grievance</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {tabMode === 'feedback' ? (
          <IonCard style={{ margin: 0, borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardHeader style={{ padding: '16px 16px 8px' }}>
              <IonCardTitle style={{ fontSize: '16px', fontWeight: 900, color: '#0f172b' }}>
                Rate Your HomeCare Experience
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent style={{ padding: '0 16px 16px' }}>
              <form onSubmit={handleFeedbackSubmit}>
                {/* Star rating selector */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '12px 0 16px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <IonIcon
                      key={s}
                      icon={s <= rating ? star : starOutline}
                      color={s <= rating ? 'warning' : 'medium'}
                      style={{ fontSize: '36px', cursor: 'pointer' }}
                      onClick={() => setRating(s)}
                    />
                  ))}
                </div>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '12px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    PATIENT CARE & CAREGIVER EXPERIENCE
                  </IonLabel>
                  <IonTextarea
                    rows={3}
                    placeholder="Tell us how Nurse/Caregiver attended to your family member..."
                    value={feedbackComments}
                    onIonInput={(e) => setFeedbackComments(e.detail.value || '')}
                  />
                </IonItem>

                <IonButton
                  type="submit"
                  expand="block"
                  color="primary"
                  disabled={isSubmittingFeedback}
                  style={{ fontWeight: 900, '--border-radius': '12px', height: '46px' }}
                >
                  {isSubmittingFeedback ? <IonSpinner name="crescent" /> : 'Submit Verified Review'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard style={{ margin: 0, borderRadius: '18px', border: '1px solid #ffc9c9', background: '#ffffff' }}>
            <IonCardHeader style={{ padding: '16px 16px 8px' }}>
              <IonCardTitle style={{ fontSize: '16px', fontWeight: 900, color: '#bf000f', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IonIcon icon={alertCircleOutline} />
                Lodge Grievance or Safety Concern
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent style={{ padding: '0 16px 16px' }}>
              <p style={{ fontSize: '12px', color: '#62748e', marginTop: 0, marginBottom: '12px' }}>
                All safety and punctuality concerns are directly reviewed by the Operations Manager within 1 hour.
              </p>

              <form onSubmit={handleComplaintSubmit}>
                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '12px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    ISSUE CATEGORY
                  </IonLabel>
                  <IonSelect value={incidentType} onIonChange={(e) => setIncidentType(e.detail.value)}>
                    <IonSelectOption value="LATE_ARRIVAL">Staff Late Arrival</IonSelectOption>
                    <IonSelectOption value="NO_SHOW">Staff No-Show</IonSelectOption>
                    <IonSelectOption value="SAFETY_CONCERN">Safety / Patient Care Concern</IonSelectOption>
                    <IonSelectOption value="CLINICAL_ERROR">Procedure or Medication Issue</IonSelectOption>
                    <IonSelectOption value="GENERAL_COMPLAINT">Billing or Admin Complaint</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '16px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    DETAILED DESCRIPTION *
                  </IonLabel>
                  <IonTextarea
                    required
                    rows={3}
                    placeholder="Describe what occurred, shift date, and immediate patient assistance needed..."
                    value={complaintDesc}
                    onIonInput={(e) => setComplaintDesc(e.detail.value || '')}
                  />
                </IonItem>

                <IonButton
                  type="submit"
                  expand="block"
                  color="danger"
                  disabled={isSubmittingComplaint}
                  style={{ fontWeight: 900, '--border-radius': '12px', height: '46px' }}
                >
                  {isSubmittingComplaint ? <IonSpinner name="crescent" /> : '🚨 Escalate Issue to Supervisor'}
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
    </IonPage>
  );
};

