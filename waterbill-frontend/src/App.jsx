import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Droplets,
  Edit3,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';

const emptyBill = { holderName: '', type: 'Residential', status: 'Pending', location: '' };
const statuses = ['Pending', 'Paid', 'Overdue'];
const types = ['Residential', 'Commercial', 'Industrial'];
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

function App() {
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState(emptyBill);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadBills = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBills(await request('/waterbill/displayall'));
    } catch (err) {
      setError(`Could not load bills. ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const filteredBills = useMemo(() => bills.filter((bill) => {
    const matchesQuery = `${bill.holderName} ${bill.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (typeFilter === 'All' || bill.type === typeFilter);
  }), [bills, query, typeFilter]);

  const stats = useMemo(() => ({
    total: bills.length,
    paid: bills.filter((bill) => bill.status === 'Paid').length,
    pending: bills.filter((bill) => bill.status === 'Pending').length,
    overdue: bills.filter((bill) => bill.status === 'Overdue').length,
  }), [bills]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function startEdit(bill) {
    setEditingId(bill.waterBillId);
    setForm({
      holderName: bill.holderName,
      type: bill.type,
      status: bill.status,
      location: bill.location,
    });
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyBill);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await request('/waterbill/update', {
          method: 'PUT',
          body: JSON.stringify({ ...form, waterBillId: editingId }),
        });
        setNotice('Bill updated successfully.');
      } else {
        await request('/waterbill/add', { method: 'POST', body: JSON.stringify(form) });
        setNotice('Bill added successfully.');
      }
      resetForm();
      await loadBills();
    } catch (err) {
      setError(`Could not save bill. ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function removeBill(id) {
    if (!window.confirm('Delete this water bill?')) return;
    setError('');
    try {
      await request(`/waterbill/delete/${id}`, { method: 'DELETE' });
      setNotice('Bill deleted successfully.');
      await loadBills();
    } catch (err) {
      setError(`Could not delete bill. ${err.message}`);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark"><Droplets size={22} /></span>
          <span>Water<span>Bill</span></span>
        </a>
        <div className="connection-status"><span /> API connected on localhost:1427</div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">BILLING OVERVIEW</p>
          <h1>Keep every drop <em>accounted for.</em></h1>
          <p className="hero-copy">Manage customer water bills, payment status, and service locations from one clear workspace.</p>
        </div>
        <div className="hero-icon"><Droplets size={94} strokeWidth={1} /></div>
      </section>

      <section className="stats-grid" aria-label="Bill statistics">
        <StatCard label="Total bills" value={stats.total} icon={<Activity />} tone="blue" />
        <StatCard label="Paid" value={stats.paid} icon={<span className="stat-dot paid" />} tone="green" />
        <StatCard label="Pending" value={stats.pending} icon={<span className="stat-dot pending" />} tone="amber" />
        <StatCard label="Overdue" value={stats.overdue} icon={<span className="stat-dot overdue" />} tone="rose" />
      </section>

      {error && <div className="alert error">{error}</div>}
      {notice && <div className="alert success">{notice}</div>}

      <section className="content-grid">
        <form className="panel bill-form" onSubmit={submit}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{editingId ? 'UPDATE RECORD' : 'NEW RECORD'}</p>
              <h2>{editingId ? 'Edit water bill' : 'Add a water bill'}</h2>
            </div>
            {editingId && <button className="icon-button" type="button" onClick={resetForm} aria-label="Cancel editing"><X size={18} /></button>}
          </div>
          <label>Holder name<input name="holderName" value={form.holderName} onChange={updateField} placeholder="e.g. Priya Sharma" required /></label>
          <label>Location<div className="input-with-icon"><MapPin size={17} /><input name="location" value={form.location} onChange={updateField} placeholder="e.g. Jubilee Hills" required /></div></label>
          <div className="form-row">
            <label>Bill type<select name="type" value={form.type} onChange={updateField}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label>Status<select name="status" value={form.status} onChange={updateField}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          </div>
          <button className="primary-button" disabled={saving} type="submit">
            {saving ? <RefreshCw className="spin" size={18} /> : <Plus size={18} />}
            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add bill'}
          </button>
        </form>

        <section className="panel records-panel">
          <div className="records-header">
            <div><p className="eyebrow">LIVE RECORDS</p><h2>Water bills <span>{filteredBills.length}</span></h2></div>
            <button className="refresh-button" onClick={loadBills} disabled={loading}><RefreshCw className={loading ? 'spin' : ''} size={17} /> Refresh</button>
          </div>
          <div className="toolbar">
            <div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search holder or location..." /></div>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filter by bill type"><option>All</option>{types.map((type) => <option key={type}>{type}</option>)}</select>
          </div>
          <div className="table-wrap">
            {loading ? <div className="empty-state"><RefreshCw className="spin" size={25} />Loading bills...</div> : filteredBills.length === 0 ? <div className="empty-state"><Droplets size={28} />No bills match your search.</div> : (
              <table><thead><tr><th>Customer</th><th>Type</th><th>Status</th><th>Location</th><th aria-label="Actions" /></tr></thead>
                <tbody>{filteredBills.map((bill) => <tr key={bill.waterBillId}>
                  <td><div className="customer"><span className="avatar"><UserRound size={16} /></span><div><strong>{bill.holderName}</strong><small>#{bill.waterBillId}</small></div></div></td>
                  <td><span className="type-label">{bill.type}</span></td><td><span className={`status ${bill.status.toLowerCase()}`}>{bill.status}</span></td><td className="location-cell"><MapPin size={14} />{bill.location}</td>
                  <td><div className="row-actions"><button onClick={() => startEdit(bill)} aria-label={`Edit ${bill.holderName}`}><Edit3 size={16} /></button><button className="delete" onClick={() => removeBill(bill.waterBillId)} aria-label={`Delete ${bill.holderName}`}><Trash2 size={16} /></button></div></td>
                </tr>)}</tbody>
              </table>
            )}
          </div>
        </section>
      </section>
      <footer>WaterBill management console <span>•</span> Built for clear, reliable service</footer>
    </main>
  );
}

function StatCard({ label, value, icon, tone }) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

export default App;
