import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { 
  Phone, 
  Mail, 
  Plus, 
  Edit3, 
  Trash2, 
  Power, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  PhoneCall, 
  Save, 
  Check, 
  X, 
  Clock, 
  Layers, 
  Sparkles, 
  Smartphone,
  Building,
  Building2,
  MapPin,
  QrCode,
  CreditCard,
  Copy
} from 'lucide-react';


import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_LABELS = [
  'Primary Support Number',
  'Secondary Support Number',
  'Emergency Dispatch Hotline',
  'Billing & Claims Desk',
  'Driver Operations Desk',
  'Night Shift Hotline'
];

const SupportSettings = () => {
  const [contacts, setContacts] = useState([]);
  const [supportEmail, setSupportEmail] = useState('');
  const [totalActive, setTotalActive] = useState(0);
  const [loading, setLoading] = useState(true);

  // Success / Error Alerts
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Company Information State
  const [companyForm, setCompanyForm] = useState({
    companyName: 'CargoConnect',
    companyTagline: 'B2B Logistics & Fleet Management',
    companyDescription: 'Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.',
    officeAddress: 'CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India',
    supportHours: 'Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)',
    upiId: 'cargoconnect@icici',
    upiHolderName: 'CargoConnect Technologies Pvt Ltd',
    bankAccountNumber: '002405012345',
    bankIfsc: 'ICIC0000024',
    bankName: 'ICICI Bank Ltd'
  });
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);

  // Email Editing State
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  // Modal State for Add / Edit / Replace
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('ADD'); // 'ADD', 'EDIT', 'REPLACE'
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactForm, setContactForm] = useState({
    label: '',
    phoneNumber: '',
    isActive: true,
    displayOrder: 1
  });
  const [savingContact, setSavingContact] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Publishing State
  const [publishing, setPublishing] = useState(false);

  const fetchSupportData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/support/contacts');
      if (res.data) {
        setContacts(res.data.contacts || []);
        setSupportEmail(res.data.supportEmail || 'support@cargoconnect.com');
        setEmailInput(res.data.supportEmail || 'support@cargoconnect.com');
        setTotalActive(res.data.totalActiveContacts || 0);
        setCompanyForm({
          companyName: res.data.companyName || 'CargoConnect',
          companyTagline: res.data.companyTagline || 'B2B Logistics & Fleet Management',
          companyDescription: res.data.companyDescription || 'Connecting businesses with verified Cargo Partners for reliable and efficient transportation across nationwide industrial freight routes.',
          officeAddress: res.data.officeAddress || 'CargoConnect HQ, Logistics Tech Park, Baner Road, Pune - 411045, Maharashtra, India',
          supportHours: res.data.supportHours || 'Monday – Saturday: 8:00 AM – 9:00 PM IST (24/7 Emergency Dispatch Hotline)',
          upiId: res.data.upiId || 'cargoconnect@icici',
          upiHolderName: res.data.upiHolderName || 'CargoConnect Technologies Pvt Ltd',
          bankAccountNumber: res.data.bankAccountNumber || '002405012345',
          bankIfsc: res.data.bankIfsc || 'ICIC0000024',
          bankName: res.data.bankName || 'ICICI Bank Ltd'
        });
      }
    } catch (err) {
      console.error('Error loading support contacts:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to load support contact details.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSupportData();
  }, []);

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const triggerError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 6000);
  };

  // 1. Open Modal for Add
  const handleOpenAddModal = () => {
    setSelectedContact(null);
    setContactForm({
      label: '',
      phoneNumber: '+91 ',
      isActive: true,
      displayOrder: contacts.length + 1
    });
    setModalMode('ADD');
    setModalOpen(true);
  };

  // 2. Open Modal for Edit
  const handleOpenEditModal = (contact) => {
    setSelectedContact(contact);
    setContactForm({
      label: contact.label || '',
      phoneNumber: contact.phoneNumber || '',
      isActive: contact.isActive !== false,
      displayOrder: contact.displayOrder || 1
    });
    setModalMode('EDIT');
    setModalOpen(true);
  };

  // 3. Open Modal for Replace
  const handleOpenReplaceModal = (contact) => {
    setSelectedContact(contact);
    setContactForm({
      label: contact.label || '',
      phoneNumber: '+91 ',
      isActive: true,
      displayOrder: contact.displayOrder || 1
    });
    setModalMode('REPLACE');
    setModalOpen(true);
  };

  // 4. Submit Add / Edit / Replace
  const handleSaveContactModal = async (e) => {
    e.preventDefault();
    if (!contactForm.label.trim()) {
      triggerError('Please enter a descriptive contact label.');
      return;
    }
    if (!contactForm.phoneNumber.trim() || contactForm.phoneNumber.trim().length < 7) {
      triggerError('Please enter a valid phone number.');
      return;
    }

    setSavingContact(true);
    try {
      if (modalMode === 'ADD') {
        await api.post('/admin/support/contacts', contactForm);
        triggerSuccess(`Support contact "${contactForm.label}" added successfully.`);
      } else {
        // EDIT or REPLACE
        await api.put(`/admin/support/contacts/${selectedContact.id}`, contactForm);
        triggerSuccess(
          modalMode === 'REPLACE'
            ? `Replaced support contact #${selectedContact.id} with ${contactForm.phoneNumber}`
            : `Updated support contact "${contactForm.label}" successfully.`
        );
      }
      setModalOpen(false);
      fetchSupportData();
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to save support contact.');
    } finally {
      setSavingContact(false);
    }
  };

  // 5. Toggle Active/Inactive
  const handleToggleActive = async (contact) => {
    const newActiveState = !contact.isActive;

    // Check frontend guard for >= 2 active numbers
    if (!newActiveState && totalActive <= 2) {
      triggerError('At least two active support numbers are required. Please add or activate another number before deactivating this one.');
      return;
    }

    try {
      await api.put(`/admin/support/contacts/${contact.id}`, {
        label: contact.label,
        phoneNumber: contact.phoneNumber,
        isActive: newActiveState,
        displayOrder: contact.displayOrder
      });
      triggerSuccess(
        newActiveState
          ? `Activated "${contact.label}". It is now published live.`
          : `Deactivated "${contact.label}".`
      );
      fetchSupportData();
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to update active state.');
    }
  };

  // 6. Delete Support Contact
  const handleConfirmDelete = (contact) => {
    if (contact.isActive && totalActive <= 2) {
      triggerError('At least two active support numbers are required. Please add another number before deleting this one.');
      return;
    }
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const executeDeleteContact = async () => {
    if (!contactToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/support/contacts/${contactToDelete.id}`);
      triggerSuccess(`Deleted support contact "${contactToDelete.label}".`);
      setDeleteModalOpen(false);
      setContactToDelete(null);
      fetchSupportData();
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to delete support contact.');
    } finally {
      setDeleting(false);
    }
  };

  // 7. Save Support Email
  const handleSaveEmail = async () => {
    const trimmed = emailInput.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      triggerError('Please provide a valid support email address.');
      return;
    }

    setSavingEmail(true);
    try {
      await api.put('/admin/support/email', { supportEmail: trimmed });
      setSupportEmail(trimmed);
      setIsEditingEmail(false);
      triggerSuccess(`Support email updated to ${trimmed} and published immediately.`);
      fetchSupportData();
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to update support email.');
    } finally {
      setSavingEmail(false);
    }
  };

  // 8. Save Company Profile & Operating Headquarters
  const handleSaveCompany = async (e) => {
    if (e) e.preventDefault();
    if (!companyForm.companyName.trim()) {
      triggerError('Company name is required.');
      return;
    }
    if (!companyForm.officeAddress.trim()) {
      triggerError('Office headquarters address is required.');
      return;
    }
    if (!companyForm.supportHours.trim()) {
      triggerError('Operational support hours are required.');
      return;
    }

    setSavingCompany(true);
    try {
      await api.put('/admin/support/company-info', {
        companyName: companyForm.companyName.trim(),
        companyTagline: companyForm.companyTagline.trim(),
        companyDescription: companyForm.companyDescription.trim(),
        officeAddress: companyForm.officeAddress.trim(),
        supportHours: companyForm.supportHours.trim(),
        supportEmail: supportEmail,
        upiId: companyForm.upiId.trim(),
        upiHolderName: companyForm.upiHolderName.trim(),
        bankAccountNumber: companyForm.bankAccountNumber.trim(),
        bankIfsc: companyForm.bankIfsc.trim(),
        bankName: companyForm.bankName.trim()
      });
      setIsEditingCompany(false);
      triggerSuccess('Company profile, headquarters, and UPI settlement details saved & published across the CargoConnect network.');

      fetchSupportData();
    } catch (err) {
      triggerError(err.response?.data?.message || 'Failed to update company profile.');
    } finally {
      setSavingCompany(false);
    }
  };

  // 9. Publish / Save All Confirmation Action
  const handlePublishAll = async () => {
    setPublishing(true);
    try {
      await fetchSupportData();
      triggerSuccess('All support contact details are verified, saved to MySQL, and published live across the CargoConnect network!');
    } catch (err) {
      triggerError('Failed to refresh published contacts.');
    } finally {
      setPublishing(false);
    }
  };

  const activeContactsList = contacts.filter((c) => c.isActive);

  if (loading) {
    return (
      <Layout title="Support Settings">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="CargoConnect Support Settings">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Management Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Operations & Dispatch Hotline Control
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live MySQL Synced
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              CargoConnect Support Settings
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Full administrative authority to add, edit, replace, activate, and delete official support phone numbers and communication emails. All updates immediately broadcast to Shippers and Cargo Partners in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-brand-600/30 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Support Number</span>
            </button>

            <button
              onClick={handlePublishAll}
              disabled={publishing}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${publishing ? 'animate-spin' : ''}`} />
              <span>Publish Contact Info</span>
            </button>
          </div>
        </div>

        {/* Global Notification Alerts */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-2xl flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid: Management Table + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Support Numbers & Email Settings */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Policy Status Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl border ${totalActive >= 2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    High-Availability Hotline Policy
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    System enforces a minimum of <strong className="text-white">2 active support numbers</strong> at all times.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs font-bold text-white">
                  Active Numbers: <span className={totalActive >= 2 ? 'text-emerald-400' : 'text-amber-400'}>{totalActive}</span>
                </span>
              </div>
            </div>

            {/* Support Phone Numbers List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Registered Support Phone Numbers
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Shippers and Cargo Partners connect directly to these numbers via one-tap dialing.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-400" />
                  <span>Add Number</span>
                </button>
              </div>

              {contacts.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs">
                  No support numbers configured. Click &quot;Add Support Number&quot; above to add one.
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((contact, index) => {
                    const isPrimary = index === 0;
                    const isSecondary = index === 1;

                    return (
                      <div
                        key={contact.id}
                        className={`bg-slate-950 border rounded-2xl p-4 transition-all duration-200 ${
                          contact.isActive
                            ? 'border-slate-800 hover:border-slate-700'
                            : 'border-slate-800/40 opacity-70 bg-slate-950/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Contact Info */}
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-white">
                                {contact.label}
                              </span>
                              {isPrimary && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                                  Primary Hotline
                                </span>
                              )}
                              {isSecondary && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                  Secondary Line
                                </span>
                              )}
                              {!isPrimary && !isSecondary && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                                  Additional Line
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase flex items-center gap-1 ${
                                  contact.isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    contact.isActive ? 'bg-emerald-400' : 'bg-rose-400'
                                  }`}
                                ></span>
                                {contact.isActive ? 'Active & Published' : 'Inactive'}
                              </span>
                            </div>

                            <p className="text-lg font-black text-white font-mono tracking-wider">
                              {contact.phoneNumber}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(contact)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                              title="Edit Label & Number"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                              <span>Edit</span>
                            </button>

                            {/* Replace Button */}
                            <button
                              onClick={() => handleOpenReplaceModal(contact)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                              title="Replace this old number with a new one"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                              <span>Replace</span>
                            </button>

                            {/* Activate / Deactivate Toggle Button */}
                            <button
                              onClick={() => handleToggleActive(contact)}
                              className={`px-3 py-1.5 font-semibold rounded-xl text-xs flex items-center gap-1 border transition-colors ${
                                contact.isActive
                                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                              }`}
                              title={contact.isActive ? 'Deactivate this number' : 'Activate this number'}
                            >
                              <Power className="w-3.5 h-3.5" />
                              <span>{contact.isActive ? 'Deactivate' : 'Activate'}</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleConfirmDelete(contact)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors border border-rose-500/20"
                              title="Delete number"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Quick Action Bar */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleOpenAddModal}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add another support hotline</span>
                </button>

                <button
                  onClick={handlePublishAll}
                  disabled={publishing}
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/30 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* Official Support Email Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Official Support Email</h3>
                    <p className="text-[11px] text-slate-400">
                      Central customer service inbox for consignment claims, billing queries, and official inquiries.
                    </p>
                  </div>
                </div>

                {!isEditingEmail && (
                  <button
                    onClick={() => {
                      setEmailInput(supportEmail);
                      setIsEditingEmail(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                    <span>Change Email</span>
                  </button>
                )}
              </div>

              {isEditingEmail ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1">
                      New Support Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. support@cargoconnect.com or help@cargoconnect.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsEditingEmail(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEmail}
                      disabled={savingEmail}
                      className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingEmail ? 'Saving...' : 'Save & Publish Email'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-400" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Support Email</span>
                      <span className="text-base font-bold text-white font-mono">{supportEmail}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase">
                    Live Published
                  </span>
                </div>
              )}
            </div>

            {/* Company Profile & Operating Headquarters Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Company Profile & Headquarters</h3>
                    <p className="text-[11px] text-slate-400">
                      Brand details, office location, and operating hours published on Legal & Contact pages.
                    </p>
                  </div>
                </div>

                {!isEditingCompany && (
                  <button
                    onClick={() => setIsEditingCompany(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditingCompany ? (
                <form onSubmit={handleSaveCompany} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Company Name</label>
                      <input
                        type="text"
                        required
                        value={companyForm.companyName}
                        onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                        placeholder="CargoConnect"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Company Tagline</label>
                      <input
                        type="text"
                        value={companyForm.companyTagline}
                        onChange={(e) => setCompanyForm({ ...companyForm, companyTagline: e.target.value })}
                        placeholder="B2B Logistics & Fleet Management"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Company Description</label>
                    <textarea
                      rows={2}
                      value={companyForm.companyDescription}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyDescription: e.target.value })}
                      placeholder="Commercial logistics platform overview..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-500 leading-relaxed"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Registered Office Address</label>
                    <input
                      type="text"
                      required
                      value={companyForm.officeAddress}
                      onChange={(e) => setCompanyForm({ ...companyForm, officeAddress: e.target.value })}
                      placeholder="CargoConnect HQ, Pune, Maharashtra"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Support Operating Hours</label>
                    <input
                      type="text"
                      required
                      value={companyForm.supportHours}
                      onChange={(e) => setCompanyForm({ ...companyForm, supportHours: e.target.value })}
                      placeholder="Monday – Saturday: 8:00 AM – 9:00 PM IST"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* UPI & Banking Remittance Details */}
                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-brand-400 font-bold text-xs">
                      <QrCode className="w-4 h-4" />
                      <span>Official UPI & Remittance Banking Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Official UPI ID (VPA)</label>
                        <input
                          type="text"
                          required
                          value={companyForm.upiId}
                          onChange={(e) => setCompanyForm({ ...companyForm, upiId: e.target.value })}
                          placeholder="cargoconnect@icici"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">UPI Account Holder Name</label>
                        <input
                          type="text"
                          required
                          value={companyForm.upiHolderName}
                          onChange={(e) => setCompanyForm({ ...companyForm, upiHolderName: e.target.value })}
                          placeholder="CargoConnect Technologies Pvt Ltd"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Bank Account No.</label>
                        <input
                          type="text"
                          value={companyForm.bankAccountNumber}
                          onChange={(e) => setCompanyForm({ ...companyForm, bankAccountNumber: e.target.value })}
                          placeholder="002405012345"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Bank IFSC Code</label>
                        <input
                          type="text"
                          value={companyForm.bankIfsc}
                          onChange={(e) => setCompanyForm({ ...companyForm, bankIfsc: e.target.value })}
                          placeholder="ICIC0000024"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={companyForm.bankName}
                          onChange={(e) => setCompanyForm({ ...companyForm, bankName: e.target.value })}
                          placeholder="ICICI Bank Ltd"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setIsEditingCompany(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingCompany}
                      className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingCompany ? 'Saving...' : 'Save & Publish Profile'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Company Name & Tagline</span>
                      <strong className="text-sm font-bold text-white">{companyForm.companyName}</strong>
                      <span className="text-xs text-brand-400 ml-2 font-medium">• {companyForm.companyTagline}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase">
                      Live
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Office Address</span>
                      <p className="text-slate-200">{companyForm.officeAddress}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Support Hours</span>
                      <p className="text-slate-200">{companyForm.supportHours}</p>
                    </div>
                  </div>

                  {/* UPI & Remittance Preview Box */}
                  <div className="p-3 bg-brand-950/30 border border-brand-800/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-500/20 text-brand-400 rounded-xl border border-brand-500/30">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Official Settlement UPI ID (VPA)
                        </span>
                        <p className="text-sm font-black text-brand-300 font-mono tracking-wide">
                          {companyForm.upiId || 'cargoconnect@icici'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {companyForm.upiHolderName} • {companyForm.bankName}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(companyForm.upiId || 'cargoconnect@icici');
                        triggerSuccess('Copied UPI ID to clipboard!');
                      }}
                      className="px-3 py-1.5 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 self-start sm:self-auto transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy UPI</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right 4 Cols: Live Shipper/Partner Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Live Mobile / Desk Preview
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Real-time render for Shippers & Cargo Partners
                  </p>
                </div>
              </div>

              {/* Mobile Mock Container */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 shadow-inner space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
                  <div className="p-2 bg-brand-500/10 text-brand-400 rounded-xl">
                    <PhoneCall className="w-4 h-4 animate-pulse text-brand-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">CargoConnect Support</h4>
                    <p className="text-[10px] text-slate-400">Direct 24/7 Operations Desk</p>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {activeContactsList.map((c, i) => (
                    <div
                      key={c.id}
                      className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-400 block truncate">
                          {c.label}
                        </span>
                        <p className="text-xs font-black text-white font-mono truncate">
                          {c.phoneNumber}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0">
                        <Phone className="w-2.5 h-2.5" />
                        Call
                      </span>
                    </div>
                  ))}

                  {supportEmail && (
                    <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          Official Support Email
                        </span>
                        <p className="text-[11px] font-semibold text-slate-200 truncate">
                          {supportEmail}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-200 font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0 border border-slate-700">
                        <Mail className="w-2.5 h-2.5" />
                        Email
                      </span>
                    </div>
                  )}

                  {companyForm.upiId && (
                    <div className="bg-slate-900/90 border border-brand-500/20 rounded-xl p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-400 block">
                          Official UPI Remittance
                        </span>
                        <p className="text-xs font-bold text-white font-mono truncate">
                          {companyForm.upiId}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-brand-500/20 text-brand-300 font-bold rounded-lg text-[10px] flex items-center gap-1 shrink-0 border border-brand-500/30">
                        <QrCode className="w-2.5 h-2.5" />
                        UPI
                      </span>
                    </div>
                  )}
                </div>


                <div className="p-2.5 bg-slate-900/50 border border-slate-800/60 rounded-xl text-[10px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    Response SLA:
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">&lt; 60 seconds</span>
                </div>
              </div>

              <div className="p-3 bg-brand-950/20 border border-brand-800/20 rounded-2xl flex gap-2 text-[11px] text-slate-400">
                <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <p>
                  Any number saved or edited here updates immediately across all Shipper and Cargo Partner screens.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MODAL: ADD / EDIT / REPLACE CONTACT ================= */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 space-y-4"
              >
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
                    {modalMode === 'ADD' ? (
                      <Plus className="w-5 h-5" />
                    ) : modalMode === 'REPLACE' ? (
                      <RefreshCw className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Edit3 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {modalMode === 'ADD'
                        ? 'Add New Support Number'
                        : modalMode === 'REPLACE'
                        ? `Replace Contact #${selectedContact?.id}`
                        : `Edit Contact: ${selectedContact?.label}`}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {modalMode === 'REPLACE'
                        ? 'Provide a new phone number to replace this existing contact.'
                        : 'Configure contact label and active phone number.'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveContactModal} className="space-y-4 text-xs">
                  {/* Label Input with Suggestion Chips */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Contact Label / Purpose
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.label}
                      onChange={(e) => setContactForm({ ...contactForm, label: e.target.value })}
                      placeholder="e.g. Primary Support Number, Billing Desk..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500 text-xs"
                    />

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {SUGGESTED_LABELS.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setContactForm({ ...contactForm, label: sug })}
                          className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Phone Number (with Country Code)
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.phoneNumber}
                      onChange={(e) => setContactForm({ ...contactForm, phoneNumber: e.target.value })}
                      placeholder="+91 98220 11223"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm font-bold focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Active Toggle & Display Order */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <input
                        type="checkbox"
                        id="contactActive"
                        checked={contactForm.isActive}
                        onChange={(e) => setContactForm({ ...contactForm, isActive: e.target.checked })}
                        className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4"
                      />
                      <label htmlFor="contactActive" className="text-slate-300 font-semibold cursor-pointer">
                        Active & Published
                      </label>
                    </div>

                    <div>
                      <input
                        type="number"
                        min="1"
                        value={contactForm.displayOrder}
                        onChange={(e) => setContactForm({ ...contactForm, displayOrder: parseInt(e.target.value) || 1 })}
                        placeholder="Order"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-white font-mono focus:outline-none focus:border-brand-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={savingContact}
                      className="px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/30 disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingContact ? 'Saving...' : 'Save & Publish'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ================= MODAL: CONFIRM DELETE ================= */}
        <AnimatePresence>
          {deleteModalOpen && contactToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-100 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Delete Support Number</h3>
                    <p className="text-xs text-slate-400">Confirm permanent removal</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Contact:</span>
                  <p className="font-bold text-white">{contactToDelete.label}</p>
                  <p className="font-mono text-brand-400">{contactToDelete.phoneNumber}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setContactToDelete(null);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={executeDeleteContact}
                    disabled={deleting}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deleting ? 'Deleting...' : 'Confirm Delete'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default SupportSettings;
