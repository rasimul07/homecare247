import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  IonSpinner,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonTextarea,
  RefresherEventDetail,
} from '@ionic/react';
import {
  alertCircleOutline,
  callOutline,
  checkmarkCircleOutline,
  navigateOutline,
  closeOutline,
  timeOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { HeaderBar } from '../../components/HeaderBar';
import { api } from '../../services/api';
import { EmergencyRequest } from '../../types';

export const AdminEmergency: React.FC = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DISPATCHED' | 'RESOLVED'>('ALL');
  
  // Update modal state
  const [selectedReq, setSelectedReq] = useState<EmergencyRequest | null>(null);
  const [actionStatus, setActionStatus] = useState<string>('');
  const [actionNotes, setActionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminEmergencyRequests();
      setRequests(data || []);
    } catch (err: any) {
      console.error('Failed to load emergency requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData();
    event.detail.complete();
  };

  const handleOpenAction = (req: EmergencyRequest, targetStatus: string) => {
    setSelectedReq(req);
    setActionStatus(targetStatus);
    setActionNotes(targetStatus === 'DISPATCHED' ? 'Rapid response clinical team dispatched to bedside.' : 'Clinical emergency stabilized and handover complete.');
  };

  const handleConfirmAction = async () => {
    if (!selectedReq || !actionStatus) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.updateEmergencyRequestStatus(selectedReq.id, actionStatus, actionNotes);
      setSelectedReq(null);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update emergency request');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const dispatchedCount = requests.filter((r) => r.status === 'DISPATCHED').length;
  const resolvedCount = requests.filter((r) => r.status === 'RESOLVED').length;

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <IonPage>
      <HeaderBar />
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '32px' }}>
          {/* Header Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>
                Emergency Dispatch Hub
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                24/7 Rapid bedside deployment & SOS triage console
              </p>
            </div>
            {pendingCount > 0 && (
              <span className="live-pulse" style={{ backgroundColor: '#ef4444' }}>
                {pendingCount} Active SOS
              </span>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#e11d48' }}>{pendingCount}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9f1239' }}>Pending Triage</div>
            </div>
            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb' }}>{dispatchedCount}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#1e40af' }}>En-Route</div>
            </div>
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>{resolvedCount}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#166534' }}>Resolved</div>
            </div>
          </div>

          {/* Segment Filter */}
          <IonSegment
            value={filter}
            onIonChange={(e) => setFilter(e.detail.value as any)}
            style={{ marginBottom: '16px' }}
          >
            <IonSegmentButton value="ALL">
              <IonLabel>All ({requests.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="PENDING">
              <IonLabel>Pending ({pendingCount})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="DISPATCHED">
              <IonLabel>En-Route ({dispatchedCount})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="RESOLVED">
              <IonLabel>Done</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {/* Requests List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <IonSpinner name="crescent" color="primary" />
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Checking emergency queue...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px dashed #cbd5e1',
              }}
            >
              <IonIcon icon={shieldCheckmarkOutline} style={{ fontSize: '48px', color: '#10b981', marginBottom: '8px' }} />
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#334155' }}>No Active Alerts</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                All emergency requests in this status category are attended to.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredRequests.map((req) => {
                const isPending = req.status === 'PENDING';
                const isDispatched = req.status === 'DISPATCHED';
                const isResolved = req.status === 'RESOLVED';

                return (
                  <div
                    key={req.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      padding: '16px',
                      border: isPending ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      boxShadow: isPending ? '0 4px 12px rgba(239, 68, 68, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                            {req.patientName || 'Emergency Patient'}
                          </span>
                          <IonBadge
                            color={isPending ? 'danger' : isDispatched ? 'primary' : 'success'}
                            style={{ fontSize: '10px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '6px' }}
                          >
                            {req.status}
                          </IonBadge>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {req.city} {req.area ? `• ${req.area}` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
                        <IonIcon icon={timeOutline} style={{ fontSize: '13px' }} />
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {req.patientCondition && (
                      <div
                        style={{
                          background: isPending ? '#fef2f2' : '#f8fafc',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: isPending ? '#991b1b' : '#475569',
                          marginBottom: '12px',
                          borderLeft: isPending ? '3px solid #ef4444' : '3px solid #94a3b8',
                        }}
                      >
                        <strong>Triage Condition:</strong> {req.patientCondition}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', paddingTop: '4px' }}>
                      <a
                        href={`tel:${req.callerPhone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: '#0284c7',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <IonIcon icon={callOutline} /> Call {req.callerPhone}
                      </a>

                      {isPending && (
                        <button
                          onClick={() => handleOpenAction(req, 'DISPATCHED')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <IonIcon icon={navigateOutline} /> Dispatch Staff
                        </button>
                      )}

                      {(isPending || isDispatched) && (
                        <button
                          onClick={() => handleOpenAction(req, 'RESOLVED')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <IonIcon icon={checkmarkCircleOutline} /> Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Update Status Modal */}
        <IonModal isOpen={!!selectedReq} onDidDismiss={() => setSelectedReq(null)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Update SOS Status</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setSelectedReq(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>
                  {actionStatus === 'DISPATCHED' ? 'Dispatch Immediate Care Team' : 'Resolve Emergency SOS'}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Patient: <strong>{selectedReq?.patientName || selectedReq?.callerPhone}</strong> ({selectedReq?.city})
                </p>
              </div>

              {errorMsg && (
                <div style={{ padding: '10px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '12px' }}>
                  {errorMsg}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Dispatch / Clinical Notes
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                  }}
                  placeholder="E.g., Nurse Priya deployed from Salt Lake hub with portable oxygen concentrator..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <IonButton expand="block" fill="outline" color="medium" style={{ flex: 1 }} onClick={() => setSelectedReq(null)}>
                  Cancel
                </IonButton>
                <IonButton
                  expand="block"
                  color={actionStatus === 'DISPATCHED' ? 'danger' : 'success'}
                  style={{ flex: 2 }}
                  disabled={submitting}
                  onClick={handleConfirmAction}
                >
                  {submitting ? 'Updating...' : actionStatus === 'DISPATCHED' ? 'Confirm Dispatch' : 'Complete Emergency'}
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
