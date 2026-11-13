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
  IonItem,
  IonLabel,
  IonAlert,
  IonToast,
} from '@ionic/react';
import {
  medkitOutline,
  personOutline,
  shieldCheckmarkOutline,
  timeOutline,
  callOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  locationOutline,
  calendarOutline,
  pulseOutline,
} from 'ionicons/icons';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HeaderBar } from '../../components/HeaderBar';
import { Booking } from '../../types';

export const CustomerBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      if (user) {
        const dash = await api.getCustomerDashboard();
        setBookings([...(dash.activeBookings || []), ...(dash.recentBookings || [])]);
      } else {
        const publicList = await api.getBookings();
        setBookings(publicList || []);
      }
    } catch (e: any) {
      console.warn('Failed to fetch bookings', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleRefresh = async (e: CustomEvent) => {
    await fetchBookings();
    e.detail.complete();
  };

  const handleCancel = async (reason: string) => {
    if (!selectedBookingForCancel) return;
    try {
      await api.cancelBooking(selectedBookingForCancel, reason || 'Family requested cancellation');
      setToastMsg('Cancellation request submitted');
      await fetchBookings();
    } catch (e: any) {
      setToastMsg(e.message || 'Failed to cancel booking');
    } finally {
      setSelectedBookingForCancel(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SERVICE_STARTED':
      case 'CONFIRMED':
        return 'success';
      case 'STAFF_EN_ROUTE':
      case 'STAFF_ASSIGNED':
        return 'primary';
      case 'REQUEST_RECEIVED':
      case 'UNDER_REVIEW':
        return 'warning';
      case 'SERVICE_COMPLETED':
        return 'medium';
      case 'CANCELLED':
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <IonPage>
      <HeaderBar title="My Care & Duty Tracking" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172b', margin: '0 0 4px' }}>
            Active Home Care Services
          </h2>
          <p style={{ fontSize: '12px', color: '#62748e', margin: 0 }}>
            Live status of assigned nurses, bedside arrival, and medical supervision.
          </p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <IonSpinner name="crescent" color="primary" />
            <p style={{ fontSize: '12px', color: '#62748e', marginTop: '8px' }}>Loading your care bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <IonCard style={{ margin: 0, textAlign: 'center', padding: '36px 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonIcon icon={calendarOutline} color="medium" style={{ fontSize: '48px', margin: '0 auto 12px' }} />
            <h3 style={{ fontWeight: 800, color: '#0f172b', margin: '0 0 6px' }}>No Active Bookings Yet</h3>
            <p style={{ fontSize: '12px', color: '#62748e', margin: '0 0 16px' }}>
              Book your first verified nurse or bedside caregiver in 2 minutes.
            </p>
            <IonButton routerLink="/customer/services" color="primary" style={{ fontWeight: 800 }}>
              Browse Services & Request
            </IonButton>
          </IonCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '30px' }}>
            {bookings.map((booking) => (
              <IonCard
                key={booking.id}
                style={{
                  margin: 0,
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  boxShadow: '0 4px 16px rgba(15, 23, 43, 0.04)',
                }}
              >
                {/* Header */}
                <IonCardHeader style={{ padding: '16px 16px 10px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#62748e', fontWeight: 800, textTransform: 'uppercase' }}>
                        PATIENT
                      </span>
                      <IonCardTitle style={{ fontSize: '17px', fontWeight: 900, color: '#0f172b' }}>
                        {booking.patientName}
                      </IonCardTitle>
                    </div>

                    <IonBadge color={getStatusBadgeColor(booking.status)} style={{ fontSize: '11px', padding: '5px 9px', borderRadius: '8px' }}>
                      {booking.status.replace(/_/g, ' ')}
                    </IonBadge>
                  </div>
                </IonCardHeader>

                <IonCardContent style={{ padding: '14px 16px' }}>
                  {/* Service & Location meta */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#62748e', display: 'block', fontSize: '10px', fontWeight: 700 }}>SHIFT TYPE</span>
                      <strong style={{ color: '#0f172b' }}>{booking.shiftDuration?.toUpperCase() || '12-HOUR DAY'}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#62748e', display: 'block', fontSize: '10px', fontWeight: 700 }}>LOCATION</span>
                      <strong style={{ color: '#0f172b' }}>{booking.area || 'City Area'}</strong>
                    </div>
                  </div>

                  {/* Assigned Nurse Card */}
                  {booking.assignedNurse ? (
                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                          ✓ Assigned Clinical Nurse
                        </span>
                        <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          100% Police Verified
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#0f172b', display: 'block' }}>
                            {booking.assignedNurse.name}
                          </strong>
                          <span style={{ fontSize: '11px', color: '#62748e' }}>
                            {booking.assignedNurse.nurseProfile?.qualification || 'Certified GNM'} •{' '}
                            {booking.assignedNurse.nurseProfile?.experienceYears || 4}+ yrs exp
                          </span>
                        </div>

                        {booking.assignedNurse.phone && (
                          <IonButton
                            size="small"
                            color="success"
                            href={`tel:${booking.assignedNurse.phone}`}
                            style={{ fontWeight: 800, '--border-radius': '8px' }}
                          >
                            <IonIcon icon={callOutline} slot="start" />
                            Call
                          </IonButton>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        marginBottom: '10px',
                        fontSize: '12px',
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <IonIcon icon={timeOutline} style={{ fontSize: '16px', flexShrink: 0 }} />
                      <span>Matching nearest verified staff in your locality...</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <IonButton
                      fill="outline"
                      size="small"
                      color="danger"
                      onClick={() => setSelectedBookingForCancel(booking.id)}
                      disabled={booking.status === 'CANCELLED' || booking.status === 'SERVICE_COMPLETED'}
                      style={{ flex: 1, fontSize: '11px', fontWeight: 700, '--border-radius': '10px' }}
                    >
                      Reschedule / Cancel
                    </IonButton>

                    <IonButton
                      fill="solid"
                      size="small"
                      color="primary"
                      routerLink="/customer/support"
                      style={{ flex: 1, fontSize: '11px', fontWeight: 700, '--border-radius': '10px' }}
                    >
                      Need Clinical Help
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {/* Cancellation Alert Prompt */}
        <IonAlert
          isOpen={!!selectedBookingForCancel}
          onDidDismiss={() => setSelectedBookingForCancel(null)}
          header="Cancel or Reschedule Service"
          message="Please share the reason for rescheduling or cancellation so our clinical desk can assist:"
          inputs={[
            {
              name: 'reason',
              type: 'text',
              placeholder: 'e.g. Patient admitted to hospital / Shift timing change',
            },
          ]}
          buttons={[
            { text: 'Keep Service', role: 'cancel' },
            {
              text: 'Confirm Request',
              handler: (data) => handleCancel(data.reason),
            },
          ]}
        />

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

