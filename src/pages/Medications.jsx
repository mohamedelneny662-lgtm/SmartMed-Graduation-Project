import React, { useState } from 'react';
import {
  DollarSign,
  Edit3,
  Info,
  Pill,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { cheaperAlternatives, medications } from '../data/medications';

const FILTERS = ['All', 'Active', 'On Hold', 'Discontinued'];

const Medications = () => {
  const [meds, setMeds] = useState(medications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [selectedMed, setSelectedMed] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const filteredMeds = meds.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || med.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddEdit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const medData = {
      id: editingMed ? editingMed.id : Date.now(),
      name: formData.get('name'),
      activeIngredient: formData.get('activeIngredient'),
      dosage: formData.get('dosage'),
      frequency: formData.get('frequency'),
      schedule: formData
        .get('schedule')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
      startDate: formData.get('startDate'),
      status: formData.get('status'),
      image: editingMed?.image ?? null,
    };

    if (editingMed) {
      setMeds((current) => current.map((med) => (med.id === editingMed.id ? medData : med)));
    } else {
      setMeds((current) => [...current, medData]);
    }

    setIsModalOpen(false);
    setEditingMed(null);
  };

  const handleDelete = (id) => {
    setMeds((current) => current.filter((med) => med.id !== id));
    if (selectedMed?.id === id) {
      setSelectedMed(null);
      setShowAlternatives(false);
    }
  };

  const closeFormModal = () => {
    setIsModalOpen(false);
    setEditingMed(null);
  };

  const openAddModal = () => {
    setEditingMed(null);
    setIsModalOpen(true);
  };

  const openEditModal = (med) => {
    setEditingMed(med);
    setIsModalOpen(true);
  };

  const showCheaperAlternatives = (med) => {
    setSelectedMed(med);
    setShowAlternatives(true);
  };

  const alternatives = selectedMed
    ? cheaperAlternatives[selectedMed.activeIngredient] || []
    : [];

  return (
    <div>
      <PageHeader
        eyebrow="Medication management"
        eyebrowIcon={Pill}
        title="Medications"
        subtitle="Keep your medication list, schedule, and active ingredients accurate so your reminders stay reliable."
        actions={
          <button type="button" className="btn btn--primary" onClick={openAddModal}>
            <Plus />
            Add medication
          </button>
        }
      />

      <div className="stack-lg">
        <div className="card">
          <div className="toolbar">
            <div className="input-wrap toolbar__search">
              <Search className="input-wrap__icon" aria-hidden="true" />
              <input
                type="search"
                className="input input--has-action"
                placeholder="Search medications or active ingredients..."
                aria-label="Search medications"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="input-wrap__action"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <X />
                </button>
              )}
            </div>

            <div className="toolbar__group">
              <div className="chips" role="group" aria-label="Filter medications by status">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`chip${statusFilter === filter ? ' is-active' : ''}`}
                    onClick={() => setStatusFilter(filter)}
                    aria-pressed={statusFilter === filter}
                  >
                    {filter}
                    <span className="chip__count">
                      {filter === 'All'
                        ? meds.length
                        : meds.filter((med) => med.status === filter).length}
                    </span>
                  </button>
                ))}
              </div>
              <span className="toolbar__count">
                {filteredMeds.length} of {meds.length} shown
              </span>
            </div>
          </div>
        </div>

        {filteredMeds.length > 0 ? (
          <div className="med-grid">
            {filteredMeds.map((med) => (
              <article className="card med-card card--hover" key={med.id}>
                <div className="med-card__top">
                  <div className="med-id">
                    <span className="med-thumb" aria-hidden="true">
                      {med.image ? (
                        <img
                          src={med.image}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 11 }}
                        />
                      ) : (
                        <Pill />
                      )}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <h3 className="med-name" title={med.name}>
                        {med.name}
                      </h3>
                      <p className="med-ingredient" title={med.activeIngredient}>
                        {med.activeIngredient}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={med.status} />
                </div>

                <div className="med-meta">
                  <div>
                    <p className="med-meta__label">Dose</p>
                    <p className="med-meta__value">{med.dosage}</p>
                  </div>
                  <div>
                    <p className="med-meta__label">Frequency</p>
                    <p className="med-meta__value">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="med-meta__label">Schedule</p>
                    <p className="med-meta__value">{med.schedule.join(' · ')}</p>
                  </div>
                  <div>
                    <p className="med-meta__label">Started</p>
                    <p className="med-meta__value">{med.startDate}</p>
                  </div>
                </div>

                <div className="med-actions">
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => openEditModal(med)}
                  >
                    <Edit3 />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(med.id)}
                    aria-label={`Delete ${med.name}`}
                  >
                    <Trash2 />
                    Delete
                  </button>
                </div>

                <button
                  type="button"
                  className="med-alt"
                  onClick={() => showCheaperAlternatives(med)}
                >
                  <DollarSign aria-hidden="true" />
                  Cheaper alternatives
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <span className="empty-state__icon">
                <Search aria-hidden="true" />
              </span>
              <p className="empty-state__title">No medications match your filters</p>
              <p className="empty-state__text">
                Try a different search term or reset the status filter to see your full list.
              </p>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                }}
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeFormModal}
        title={editingMed ? 'Edit medication' : 'Add medication'}
        subtitle="Update the details used for your schedule and adherence tracking."
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={closeFormModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" form="medication-form">
              {editingMed ? 'Save changes' : 'Add medication'}
            </button>
          </>
        }
      >
        <form id="medication-form" onSubmit={handleAddEdit}>
          <div className="form-stack">
            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="med-name">
                  Medicine name <span>*</span>
                </label>
                <input
                  id="med-name"
                  className="input"
                  type="text"
                  name="name"
                  defaultValue={editingMed?.name}
                  placeholder="e.g. Metformin"
                  required
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="med-ingredient">
                  Active ingredient <span>*</span>
                </label>
                <input
                  id="med-ingredient"
                  className="input"
                  type="text"
                  name="activeIngredient"
                  defaultValue={editingMed?.activeIngredient}
                  placeholder="e.g. Metformin hydrochloride"
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="med-dosage">
                  Dosage <span>*</span>
                </label>
                <input
                  id="med-dosage"
                  className="input"
                  type="text"
                  name="dosage"
                  defaultValue={editingMed?.dosage}
                  placeholder="e.g. 500 mg"
                  required
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="med-frequency">
                  Frequency <span>*</span>
                </label>
                <input
                  id="med-frequency"
                  className="input"
                  type="text"
                  name="frequency"
                  defaultValue={editingMed?.frequency}
                  placeholder="e.g. Twice daily"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="med-schedule">
                Schedule <span>*</span>
              </label>
              <input
                id="med-schedule"
                className="input"
                type="text"
                name="schedule"
                defaultValue={editingMed?.schedule?.join(', ')}
                placeholder="08:00, 20:00"
                required
              />
              <p className="hint">Separate multiple reminder times with commas.</p>
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="med-start">
                  Start date <span>*</span>
                </label>
                <input
                  id="med-start"
                  className="input"
                  type="date"
                  name="startDate"
                  defaultValue={editingMed?.startDate}
                  required
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="med-status">
                  Status
                </label>
                <select
                  id="med-status"
                  className="select"
                  name="status"
                  defaultValue={editingMed?.status || 'Active'}
                >
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
              </div>
            </div>

            <div className="notice notice--neutral">
              <Info aria-hidden="true" />
              <div className="notice__body">
                <p className="notice__text">
                  This is a frontend prototype. Medication changes are stored in local state only
                  and are not sent to a pharmacy or clinician.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showAlternatives}
        onClose={() => setShowAlternatives(false)}
        title="Cheaper alternatives"
        subtitle="Informational examples only — not a prescription recommendation."
        size="lg"
        footer={
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setShowAlternatives(false)}
          >
            Close
          </button>
        }
      >
        {selectedMed && (
          <div className="stack-md">
            <div className="kv-grid">
              <div className="kv">
                <p className="kv__label">Current medication</p>
                <p className="kv__value">{selectedMed.name}</p>
              </div>
              <div className="kv">
                <p className="kv__label">Active ingredient</p>
                <p className="kv__value">{selectedMed.activeIngredient}</p>
              </div>
              <div className="kv">
                <p className="kv__label">Current dose</p>
                <p className="kv__value">{selectedMed.dosage}</p>
              </div>
              <div className="kv">
                <p className="kv__label">Frequency</p>
                <p className="kv__value">{selectedMed.frequency}</p>
              </div>
            </div>

            <div className="notice notice--warning">
              <ShieldAlert aria-hidden="true" />
              <div className="notice__body">
                <p className="notice__title">Verify before changing anything</p>
                <p className="notice__text">
                  These alternatives are informational examples based only on matching active
                  ingredients. They are not a recommendation to switch. Always confirm
                  availability, strength, and suitability with a pharmacist or doctor before
                  changing your medication.
                </p>
              </div>
            </div>

            {alternatives.length > 0 ? (
              <div className="alt-list">
                {alternatives.map((alternative) => (
                  <div className="alt-card" key={`${alternative.name}-${alternative.brand}`}>
                    <div>
                      <p className="alt-card__name">{alternative.name}</p>
                      <p className="alt-card__meta">
                        {alternative.brand} · {alternative.dosage} · same active ingredient
                      </p>
                    </div>
                    <div className="alt-card__price">
                      {alternative.price}
                      <span>estimated</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon">
                  <DollarSign aria-hidden="true" />
                </span>
                <p className="empty-state__title">No example alternatives available</p>
                <p className="empty-state__text">
                  Examples are only provided for the demo medications. Ask your pharmacist about
                  comparable options.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Medications;
