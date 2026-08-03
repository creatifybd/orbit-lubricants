import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/initialData';

const CmsContext = createContext();

const STORAGE_KEY = 'orbit_lubricants_cms_v7';
const AUTH_KEY = 'orbit_admin_authenticated';

export const CmsProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load local storage CMS data", e);
    }
    return initialData;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [data]);

  const loginAdmin = (password) => {
    if (password === 'admin' || password === 'orbit123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem(AUTH_KEY, 'true');
      showToast('Successfully logged into Admin CMS!', 'success');
      return true;
    } else {
      showToast('Invalid password! (Try: admin)', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(AUTH_KEY);
    showToast('Logged out from Admin Dashboard', 'info');
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Section Updaters
  const updateHero = (heroFields) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, ...heroFields }
    }));
    showToast('Hero section updated!');
  };

  const updateAbout = (aboutFields) => {
    setData(prev => ({
      ...prev,
      about: { ...prev.about, ...aboutFields }
    }));
    showToast('About section updated!');
  };

  const updateContactInfo = (contactFields) => {
    setData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, ...contactFields }
    }));
    showToast('Contact information updated!');
  };

  const updateSettings = (settingFields) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settingFields }
    }));
    showToast('Site settings updated!');
  };

  // Why Us CRUD
  const addWhyUsItem = (newItem) => {
    const itemWithId = { id: `w-${Date.now()}`, ...newItem };
    setData(prev => ({
      ...prev,
      whyUs: [...prev.whyUs, itemWithId]
    }));
    showToast('Added new Feature card!');
  };

  const updateWhyUsItem = (id, fields) => {
    setData(prev => ({
      ...prev,
      whyUs: prev.whyUs.map(item => item.id === id ? { ...item, ...fields } : item)
    }));
    showToast('Feature card updated!');
  };

  const deleteWhyUsItem = (id) => {
    setData(prev => ({
      ...prev,
      whyUs: prev.whyUs.filter(item => item.id !== id)
    }));
    showToast('Feature card removed', 'warning');
  };

  // Core Values CRUD
  const addCoreValue = (val) => {
    setData(prev => ({
      ...prev,
      about: { ...prev.about, values: [...(prev.about.values || []), val] }
    }));
    showToast('Core Value added!');
  };

  const deleteCoreValue = (index) => {
    setData(prev => ({
      ...prev,
      about: { ...prev.about, values: prev.about.values.filter((_, idx) => idx !== index) }
    }));
    showToast('Core Value removed', 'warning');
  };

  // Standards CRUD
  const addStandard = (std) => {
    setData(prev => ({
      ...prev,
      standards: [...prev.standards, std]
    }));
    showToast('Quality Certification added!');
  };

  const deleteStandard = (index) => {
    setData(prev => ({
      ...prev,
      standards: prev.standards.filter((_, idx) => idx !== index)
    }));
    showToast('Quality Standard removed', 'warning');
  };

  // Product CRUD
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `orb-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      products: [productWithId, ...prev.products]
    }));
    showToast(`Added product: ${newProduct.name}`);
  };

  const updateProduct = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    }));
    showToast('Product updated successfully!');
  };

  const deleteProduct = (id) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
    showToast('Product deleted', 'warning');
  };

  // Inquiry Handler
  const addInquiry = (inquiryForm) => {
    const newInquiry = {
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'New',
      ...inquiryForm
    };
    setData(prev => ({
      ...prev,
      inquiries: [newInquiry, ...prev.inquiries]
    }));
    showToast('Inquiry submitted! Our technical team will reach out soon.');
  };

  const updateInquiryStatus = (id, newStatus) => {
    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq)
    }));
    showToast(`Inquiry status changed to ${newStatus}`);
  };

  const deleteInquiry = (id) => {
    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.filter(inq => inq.id !== id)
    }));
    showToast('Inquiry deleted', 'warning');
  };

  // Backup & Import/Reset
  const exportDataJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orbit-lubricants-cms-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CMS Backup JSON exported successfully!');
  };

  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.products && parsed.hero) {
        setData(parsed);
        showToast('CMS Data imported successfully!');
        return true;
      } else {
        throw new Error("Invalid CMS schema structure");
      }
    } catch (err) {
      showToast(`Import failed: ${err.message}`, 'error');
      return false;
    }
  };

  const resetToFactoryDefaults = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
    showToast('CMS data reset to factory defaults!', 'info');
  };

  return (
    <CmsContext.Provider
      value={{
        data,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        toastMessage,
        showToast,
        updateHero,
        updateAbout,
        updateContactInfo,
        updateSettings,
        addWhyUsItem,
        updateWhyUsItem,
        deleteWhyUsItem,
        addCoreValue,
        deleteCoreValue,
        addStandard,
        deleteStandard,
        addProduct,
        updateProduct,
        deleteProduct,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        exportDataJSON,
        importDataJSON,
        resetToFactoryDefaults
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => useContext(CmsContext);
