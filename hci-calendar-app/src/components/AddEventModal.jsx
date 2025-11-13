import React, { useState, useEffect } from 'react';

// Modal for creating OR editing an item
export default function AddEventModal({
  onClose,
  onCreate,
  onUpdate,
  existingItem,
  defaultDate,
  defaultKind = 'event'
}) {
  const isEditing = !!existingItem;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate || '');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState(defaultKind);
  const [priority, setPriority] = useState('Medium');

  // Pre-fill form when editing
  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title || '');
      setDate(existingItem.date || defaultDate || '');
      setTime(existingItem.time || '');
      setDescription(existingItem.description || '');
      setKind(existingItem.kind || defaultKind);
      setPriority(existingItem.priority || 'Medium');
    } else {
      setTitle('');
      setDate(defaultDate || '');
      setTime('');
      setDescription('');
      setKind(defaultKind);
      setPriority('Medium');
    }
  }, [existingItem, defaultDate, defaultKind]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;

    const item = {
      ...(existingItem || {}),
      id: existingItem ? existingItem.id : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind,
      title,
      date,
      time: time || undefined,
      description,
      priority
    };

    if (kind === 'todo' && existingItem == null) item.completed = false;

    if (isEditing) onUpdate(item);
    else onCreate(item);

    onClose();
  };

  const kindLabels = {
    event: 'Calendar Event',
    todo: 'To-Do Item',
    reminder: 'Reminder'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? `Edit ${kindLabels[kind]}` : `Create ${kindLabels[kind]}`}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Type</label>
            <div className="kind-selector">
              <button
                type="button"
                className={`kind-option ${kind === 'event' ? 'active' : ''}`}
                onClick={() => setKind('event')}
                disabled={isEditing} // lock kind while editing
              >
                <span className="kind-icon">📅</span>
                <span className="kind-label">Event</span>
              </button>
              <button
                type="button"
                className={`kind-option ${kind === 'todo' ? 'active' : ''}`}
                onClick={() => setKind('todo')}
                disabled={isEditing}
              >
                <span className="kind-icon">📝</span>
                <span className="kind-label">To-Do</span>
              </button>
              <button
                type="button"
                className={`kind-option ${kind === 'reminder' ? 'active' : ''}`}
                onClick={() => setKind('reminder')}
                disabled={isEditing}
              >
                <span className="kind-icon">🔔</span>
                <span className="kind-label">Reminder</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required
              placeholder={`What's your ${kindLabels[kind].toLowerCase()}?`}className="form-input"/>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-input" />
            </div>

            <div className="form-group">
              <label>Time (optional)</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="form-textarea"
              rows={3}
            />
          </div>

          {kind === 'todo' && (
            <div className='form-group'>
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className='form-input'
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Save Changes' : `Create ${kindLabels[kind]}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
