import React from 'react';
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
  IonList,
  IonBadge,
} from '@ionic/react';
import {
  personCircleOutline,
  mailOutline,
  callOutline,
  locationOutline,
  logOutOutline,
  shieldCheckmarkOutline,
  logInOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeaderBar } from '../../components/HeaderBar';

export const CustomerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, selectedCity, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <IonPage>
      <HeaderBar title="Account & Profile" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        {/* User Card */}
        <IonCard style={{ margin: '0 0 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <IonCardContent style={{ padding: '20px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#155dfc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '28px',
                fontWeight: 800,
              }}
            >
              {user?.name?.charAt(0) || <IonIcon icon={personCircleOutline} />}
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172b', margin: '0 0 4px' }}>
              {user?.name || 'Guest Patient'}
            </h2>
            <p style={{ fontSize: '12px', color: '#62748e', margin: '0 0 10px' }}>
              {user?.email || 'Not signed in'}
            </p>

            <IonBadge color="primary" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px' }}>
              {user?.role || 'GUEST CUSTOMER'}
            </IonBadge>
          </IonCardContent>
        </IonCard>

        {/* Details List */}
        <IonCard style={{ margin: '0 0 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <IonList inset lines="full">
            <IonItem>
              <IonIcon icon={locationOutline} slot="start" color="primary" />
              <IonLabel>
                <p style={{ fontSize: '11px', color: '#62748e' }}>Selected Healthcare Hub</p>
                <h3 style={{ fontWeight: 800, color: '#0f172b' }}>{selectedCity.name}</h3>
              </IonLabel>
            </IonItem>

            {user?.phone && (
              <IonItem>
                <IonIcon icon={callOutline} slot="start" color="primary" />
                <IonLabel>
                  <p style={{ fontSize: '11px', color: '#62748e' }}>Verified Mobile</p>
                  <h3 style={{ fontWeight: 800, color: '#0f172b' }}>{user.phone}</h3>
                </IonLabel>
              </IonItem>
            )}

            {user?.address && (
              <IonItem>
                <IonIcon icon={shieldCheckmarkOutline} slot="start" color="success" />
                <IonLabel>
                  <p style={{ fontSize: '11px', color: '#62748e' }}>Registered Address</p>
                  <h3 style={{ fontWeight: 800, color: '#0f172b' }}>{user.address}</h3>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        </IonCard>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <IonButton
            fill="outline"
            color="secondary"
            expand="block"
            onClick={() => navigate('/login')}
            style={{ fontWeight: 800, '--border-radius': '12px' }}
          >
            <IonIcon icon={swapHorizontalOutline} slot="start" />
            Switch Role / Portal (Demo)
          </IonButton>

          {user ? (
            <IonButton
              fill="solid"
              color="danger"
              expand="block"
              onClick={handleLogout}
              style={{ fontWeight: 800, '--border-radius': '12px' }}
            >
              <IonIcon icon={logOutOutline} slot="start" />
              Sign Out
            </IonButton>
          ) : (
            <IonButton
              fill="solid"
              color="primary"
              expand="block"
              onClick={() => navigate('/login')}
              style={{ fontWeight: 800, '--border-radius': '12px' }}
            >
              <IonIcon icon={logInOutline} slot="start" />
              Sign In to Your Account
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
