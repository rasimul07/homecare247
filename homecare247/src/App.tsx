import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  medkitOutline,
  calendarOutline,
  peopleOutline,
  callOutline,
  personCircleOutline,
  pulseOutline,
  timeOutline,
  warningOutline,
  documentTextOutline,
  analyticsOutline,
  flashOutline,
} from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ExploreServices } from './pages/customer/ExploreServices';
import { CustomerBookings } from './pages/customer/CustomerBookings';
import { CustomerPatients } from './pages/customer/CustomerPatients';
import { CustomerSupport } from './pages/customer/CustomerSupport';
import { CustomerProfile } from './pages/customer/CustomerProfile';

import { NurseDuty } from './pages/nurse/NurseDuty';
import { NurseVitals } from './pages/nurse/NurseVitals';
import { NurseShifts } from './pages/nurse/NurseShifts';
import { NurseIncident } from './pages/nurse/NurseIncident';

import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorPatients } from './pages/doctor/DoctorPatients';
import { DoctorClinicalNote } from './pages/doctor/DoctorClinicalNote';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEmergency } from './pages/admin/AdminEmergency';

setupIonicReact({
  mode: 'ios',
});

const App: React.FC = () => {
  const { role, isAuthenticated } = useAuth();

  const getDefaultRedirect = () => {
    if (!isAuthenticated) return '/customer/services';
    switch (role) {
      case 'NURSE':
        return '/nurse/duty';
      case 'DOCTOR':
        return '/doctor/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      case 'CUSTOMER':
      default:
        return '/customer/services';
    }
  };

  const renderTabButtons = () => {
    if (role === 'NURSE') {
      return [
        <IonTabButton key="nurse-duty" tab="duty" href="/nurse/duty">
          <IonIcon icon={timeOutline} />
          <IonLabel>Duty Console</IonLabel>
        </IonTabButton>,
        <IonTabButton key="nurse-vitals" tab="vitals" href="/nurse/vitals">
          <IonIcon icon={pulseOutline} />
          <IonLabel>Bedside Vitals</IonLabel>
        </IonTabButton>,
        <IonTabButton key="nurse-shifts" tab="shifts" href="/nurse/shifts">
          <IonIcon icon={calendarOutline} />
          <IonLabel>My Shifts</IonLabel>
        </IonTabButton>,
        <IonTabButton key="nurse-incident" tab="incident" href="/nurse/incident">
          <IonIcon icon={warningOutline} />
          <IonLabel>Incident SOS</IonLabel>
        </IonTabButton>,
        <IonTabButton key="nurse-profile" tab="profile" href="/customer/profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Staff Profile</IonLabel>
        </IonTabButton>,
      ];
    }

    if (role === 'DOCTOR') {
      return [
        <IonTabButton key="doc-dashboard" tab="dashboard" href="/doctor/dashboard">
          <IonIcon icon={analyticsOutline} />
          <IonLabel>Supervisor Hub</IonLabel>
        </IonTabButton>,
        <IonTabButton key="doc-patients" tab="patients" href="/doctor/patients">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Patient Vitals</IonLabel>
        </IonTabButton>,
        <IonTabButton key="doc-note" tab="note" href="/doctor/note">
          <IonIcon icon={documentTextOutline} />
          <IonLabel>Rx / Orders</IonLabel>
        </IonTabButton>,
        <IonTabButton key="doc-profile" tab="profile" href="/customer/profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>MD Profile</IonLabel>
        </IonTabButton>,
      ];
    }

    if (role === 'ADMIN') {
      return [
        <IonTabButton key="admin-dashboard" tab="dashboard" href="/admin/dashboard">
          <IonIcon icon={analyticsOutline} />
          <IonLabel>Metrics</IonLabel>
        </IonTabButton>,
        <IonTabButton key="admin-emergency" tab="emergency" href="/admin/emergency">
          <IonIcon icon={flashOutline} />
          <IonLabel>SOS Dispatch</IonLabel>
        </IonTabButton>,
        <IonTabButton key="admin-services" tab="services" href="/customer/services">
          <IonIcon icon={medkitOutline} />
          <IonLabel>Care Catalog</IonLabel>
        </IonTabButton>,
        <IonTabButton key="admin-profile" tab="profile" href="/customer/profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Admin</IonLabel>
        </IonTabButton>,
      ];
    }

    // Default Customer / Guest
    return [
      <IonTabButton key="cust-services" tab="services" href="/customer/services">
        <IonIcon icon={medkitOutline} />
        <IonLabel>Services</IonLabel>
      </IonTabButton>,
      <IonTabButton key="cust-bookings" tab="bookings" href="/customer/bookings">
        <IonIcon icon={calendarOutline} />
        <IonLabel>My Care</IonLabel>
      </IonTabButton>,
      <IonTabButton key="cust-patients" tab="patients" href="/customer/patients">
        <IonIcon icon={peopleOutline} />
        <IonLabel>Family</IonLabel>
      </IonTabButton>,
      <IonTabButton key="cust-support" tab="support" href="/customer/support">
        <IonIcon icon={callOutline} />
        <IonLabel>24/7 Help</IonLabel>
      </IonTabButton>,
      <IonTabButton key="cust-profile" tab="profile" href="/customer/profile">
        <IonIcon icon={personCircleOutline} />
        <IonLabel>{isAuthenticated ? 'Profile' : 'Sign In'}</IonLabel>
      </IonTabButton>,
    ];
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/customer/services" element={<ExploreServices />} />
            <Route path="/customer/bookings" element={<CustomerBookings />} />
            <Route path="/customer/patients" element={<CustomerPatients />} />
            <Route path="/customer/support" element={<CustomerSupport />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />

            {/* Nurse Routes */}
            <Route path="/nurse/duty" element={<NurseDuty />} />
            <Route path="/nurse/vitals" element={<NurseVitals />} />
            <Route path="/nurse/shifts" element={<NurseShifts />} />
            <Route path="/nurse/incident" element={<NurseIncident />} />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/note" element={<DoctorClinicalNote />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/emergency" element={<AdminEmergency />} />

            {/* Default Root Redirect */}
            <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
          </IonRouterOutlet>

          {/* Dynamic Bottom Tab Bar */}
          <IonTabBar slot="bottom">
            {renderTabButtons()}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
