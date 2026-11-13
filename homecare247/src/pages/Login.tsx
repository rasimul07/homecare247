import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonBadge,
  IonChip,
} from '@ionic/react';
import {
  medkitOutline,
  lockClosedOutline,
  mailOutline,
  personCircleOutline,
  shieldCheckmarkOutline,
  pulseOutline,
  arrowForwardOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, quickLogin, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToastMsg('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err: any) {
      setToastMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (targetRole: 'CUSTOMER' | 'NURSE' | 'DOCTOR' | 'ADMIN') => {
    setIsLoading(true);
    try {
      const user = await quickLogin(targetRole);
      redirectByRole(user.role);
    } catch (err: any) {
      setToastMsg(err.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectByRole = (userRole: string) => {
    switch (userRole) {
      case 'NURSE':
      case 'CAREGIVER':
      case 'STAFF':
        navigate('/nurse/duty', { replace: true });
        break;
      case 'DOCTOR':
        navigate('/doctor/dashboard', { replace: true });
        break;
      case 'ADMIN':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'CUSTOMER':
      default:
        navigate('/customer/services', { replace: true });
        break;
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#ffffff' }}>
          <IonTitle style={{ fontWeight: 900, color: '#0f172b' }}>Portal Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <div style={{ maxWidth: '420px', margin: '0 auto', paddingTop: '10px' }}>
          {/* Brand Logo & Banner */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #155dfc, #009588)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 8px 24px rgba(21, 93, 252, 0.25)',
                color: '#ffffff',
              }}
            >
              <IonIcon icon={medkitOutline} style={{ fontSize: '32px' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172b', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
              HomeCare<span style={{ color: '#155dfc' }}>247</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#62748e', margin: 0 }}>
              Hospital-Grade Clinical Home Healthcare & Nursing
            </p>
          </div>

          {/* Quick Demo Login Switcher */}
          <IonCard style={{ margin: '0 0 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardContent style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#1447e6', display: 'block', marginBottom: '8px' }}>
                ⚡ 1-Tap Demo Role Switcher
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <IonButton
                  fill="outline"
                  size="small"
                  color="primary"
                  onClick={() => handleQuickLogin('CUSTOMER')}
                  disabled={isLoading}
                  style={{ fontWeight: 700, fontSize: '11px', '--border-radius': '10px' }}
                >
                  Family / Patient
                </IonButton>

                <IonButton
                  fill="outline"
                  size="small"
                  color="secondary"
                  onClick={() => handleQuickLogin('NURSE')}
                  disabled={isLoading}
                  style={{ fontWeight: 700, fontSize: '11px', '--border-radius': '10px' }}
                >
                  Nurse / Caregiver
                </IonButton>

                <IonButton
                  fill="outline"
                  size="small"
                  color="tertiary"
                  onClick={() => handleQuickLogin('DOCTOR')}
                  disabled={isLoading}
                  style={{ fontWeight: 700, fontSize: '11px', '--border-radius': '10px' }}
                >
                  Doctor MD
                </IonButton>

                <IonButton
                  fill="outline"
                  size="small"
                  color="dark"
                  onClick={() => handleQuickLogin('ADMIN')}
                  disabled={isLoading}
                  style={{ fontWeight: 700, fontSize: '11px', '--border-radius': '10px' }}
                >
                  Admin Tower
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Login Form */}
          <IonCard style={{ margin: '0 0 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardContent style={{ padding: '20px' }}>
              <form onSubmit={handleLogin}>
                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '12px' }}>
                  <IonIcon icon={mailOutline} slot="start" color="medium" style={{ fontSize: '18px' }} />
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    EMAIL ADDRESS
                  </IonLabel>
                  <IonInput
                    type="email"
                    required
                    placeholder="e.g. name@homecare247.com"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value || '')}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '18px' }}>
                  <IonIcon icon={lockClosedOutline} slot="start" color="medium" style={{ fontSize: '18px' }} />
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    PASSWORD
                  </IonLabel>
                  <IonInput
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value || '')}
                  />
                </IonItem>

                <IonButton
                  type="submit"
                  expand="block"
                  color="primary"
                  disabled={isLoading}
                  style={{ fontWeight: 900, '--border-radius': '14px', height: '48px' }}
                >
                  {isLoading ? <IonSpinner name="crescent" /> : 'Sign In to Account'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>

          {/* Bottom Register & Public Browse Links */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#62748e', margin: '0 0 8px' }}>
              New family patient account?{' '}
              <a
                onClick={() => navigate('/register')}
                style={{ color: '#155dfc', fontWeight: 800, cursor: 'pointer' }}
              >
                Register here
              </a>
            </p>

            <IonButton
              fill="clear"
              size="small"
              onClick={() => navigate('/customer/services')}
              style={{ color: '#62748e', fontSize: '12px', fontWeight: 700 }}
            >
              Continue browsing services as guest <IonIcon icon={arrowForwardOutline} slot="end" />
            </IonButton>
          </div>
        </div>

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
