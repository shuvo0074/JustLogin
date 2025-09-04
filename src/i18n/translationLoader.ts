import enTranslations from './languages/en.json';
import frTranslations from './languages/fr.json';
import deTranslations from './languages/de.json';

export type Language = 'en' | 'fr' | 'de';

export interface Translations {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    logout: string;
    login: string;
    signup: string;
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
  };
  splash: {
    title: string;
    subtitle: string;
    loading: string;
  };
  login: {
    title: string;
    button: string;
    hint: string;
    dontHaveAccount: string;
    signUpLink: string;
  };
  signup: {
    title: string;
    button: string;
    alreadyHaveAccount: string;
    loginLink: string;
  };
  home: {
    title: string;
    welcome: string;
  };
  profile: {
    title: string;
    accountSettings: string;
    accountSettingsDescription: string;
    privacySecurity: string;
    privacySecurityDescription: string;
    language: string;
    languageDescription: string;
  };
  about: {
    title: string;
    welcome: string;
    welcomeDescription: string;
    ourMission: string;
    ourMissionDescription: string;
    features: string;
    featuresList: string;
    version: string;
    contactUs: string;
    contactUsDescription: string;
    emailSupport: string;
    visitWebsite: string;
    copyright: string;
    neverStopFighting: string;
  };
  tabs: {
    home: string;
    profile: string;
    about: string;
  };
  validation: {
    emailRequired: string;
    passwordRequired: string;
    nameRequired: string;
    confirmPasswordRequired: string;
    invalidEmail: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
    invalidCredentials: string;
    loginFailed: string;
    signupFailed: string;
  };
  logout: {
    confirm: string;
    confirmMessage: string;
  };
  userInfo: {
    nameLabel: string;
    emailLabel: string;
    userIdLabel: string;
    createdLabel: string;
    updatedLabel: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: enTranslations as Translations,
  fr: frTranslations as Translations,
  de: deTranslations as Translations,
};

// Flattened translation interface for backward compatibility
export interface FlattenedTranslations {
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  confirm: string;
  logout: string;
  login: string;
  signup: string;
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  
  // Splash Screen
  splashTitle: string;
  splashSubtitle: string;
  splashLoading: string;
  
  // Login Screen
  loginTitle: string;
  loginButton: string;
  loginHint: string;
  dontHaveAccount: string;
  signUpLink: string;
  
  // Signup Screen
  signupTitle: string;
  signupButton: string;
  alreadyHaveAccount: string;
  loginLink: string;
  
  // Home Screen
  homeTitle: string;
  welcome: string;
  
  // Profile Screen
  profileTitle: string;
  accountSettings: string;
  accountSettingsDescription: string;
  privacySecurity: string;
  privacySecurityDescription: string;
  language: string;
  languageDescription: string;
  
  // About Screen
  aboutTitle: string;
  aboutWelcome: string;
  aboutWelcomeDescription: string;
  ourMission: string;
  ourMissionDescription: string;
  features: string;
  featuresList: string;
  version: string;
  contactUs: string;
  contactUsDescription: string;
  emailSupport: string;
  visitWebsite: string;
  copyright: string;
  neverStopFighting: string;
  
  // Tab Navigation
  homeTab: string;
  profileTab: string;
  aboutTab: string;
  
  // Validation Messages
  emailRequired: string;
  passwordRequired: string;
  nameRequired: string;
  confirmPasswordRequired: string;
  invalidEmail: string;
  passwordTooShort: string;
  passwordsDoNotMatch: string;
  invalidCredentials: string;
  loginFailed: string;
  signupFailed: string;
  
  // Logout
  logoutConfirm: string;
  logoutConfirmMessage: string;
  
  // User Info Card
  nameLabel: string;
  emailLabel: string;
  userIdLabel: string;
  createdLabel: string;
  updatedLabel: string;
}

// Function to flatten nested translations for backward compatibility
export const flattenTranslations = (translations: Translations): FlattenedTranslations => {
  return {
    // Common
    loading: translations.common.loading,
    error: translations.common.error,
    success: translations.common.success,
    cancel: translations.common.cancel,
    confirm: translations.common.confirm,
    logout: translations.common.logout,
    login: translations.common.login,
    signup: translations.common.signup,
    email: translations.common.email,
    password: translations.common.password,
    name: translations.common.name,
    confirmPassword: translations.common.confirmPassword,
    
    // Splash Screen
    splashTitle: translations.splash.title,
    splashSubtitle: translations.splash.subtitle,
    splashLoading: translations.splash.loading,
    
    // Login Screen
    loginTitle: translations.login.title,
    loginButton: translations.login.button,
    loginHint: translations.login.hint,
    dontHaveAccount: translations.login.dontHaveAccount,
    signUpLink: translations.login.signUpLink,
    
    // Signup Screen
    signupTitle: translations.signup.title,
    signupButton: translations.signup.button,
    alreadyHaveAccount: translations.signup.alreadyHaveAccount,
    loginLink: translations.signup.loginLink,
    
    // Home Screen
    homeTitle: translations.home.title,
    welcome: translations.home.welcome,
    
    // Profile Screen
    profileTitle: translations.profile.title,
    accountSettings: translations.profile.accountSettings,
    accountSettingsDescription: translations.profile.accountSettingsDescription,
    privacySecurity: translations.profile.privacySecurity,
    privacySecurityDescription: translations.profile.privacySecurityDescription,
    language: translations.profile.language,
    languageDescription: translations.profile.languageDescription,
    
    // About Screen
    aboutTitle: translations.about.title,
    aboutWelcome: translations.about.welcome,
    aboutWelcomeDescription: translations.about.welcomeDescription,
    ourMission: translations.about.ourMission,
    ourMissionDescription: translations.about.ourMissionDescription,
    features: translations.about.features,
    featuresList: translations.about.featuresList,
    version: translations.about.version,
    contactUs: translations.about.contactUs,
    contactUsDescription: translations.about.contactUsDescription,
    emailSupport: translations.about.emailSupport,
    visitWebsite: translations.about.visitWebsite,
    copyright: translations.about.copyright,
    neverStopFighting: translations.about.neverStopFighting,
    
    // Tab Navigation
    homeTab: translations.tabs.home,
    profileTab: translations.tabs.profile,
    aboutTab: translations.tabs.about,
    
    // Validation Messages
    emailRequired: translations.validation.emailRequired,
    passwordRequired: translations.validation.passwordRequired,
    nameRequired: translations.validation.nameRequired,
    confirmPasswordRequired: translations.validation.confirmPasswordRequired,
    invalidEmail: translations.validation.invalidEmail,
    passwordTooShort: translations.validation.passwordTooShort,
    passwordsDoNotMatch: translations.validation.passwordsDoNotMatch,
    invalidCredentials: translations.validation.invalidCredentials,
    loginFailed: translations.validation.loginFailed,
    signupFailed: translations.validation.signupFailed,
    
    // Logout
    logoutConfirm: translations.logout.confirm,
    logoutConfirmMessage: translations.logout.confirmMessage,
    
    // User Info Card
    nameLabel: translations.userInfo.nameLabel,
    emailLabel: translations.userInfo.emailLabel,
    userIdLabel: translations.userInfo.userIdLabel,
    createdLabel: translations.userInfo.createdLabel,
    updatedLabel: translations.userInfo.updatedLabel,
  };
};
