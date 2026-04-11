import { useState, useEffect } from 'react';

export default function DateInput({ name, value, onChange, className, placeholder = 'dd/mm/yyyy' }) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        setDisplay(`${parts[2]}/${parts[1]}/${parts[0]}`);
      }
    } else {
      setDisplay('');
    }
  }, [value]);

  const handleChange = (e) => {
    let input = e.target.value.replace(/[^\d]/g, '');

    if (input.length > 8) input = input.slice(0, 8);

    let formatted = '';
    if (input.length > 0) formatted = input.slice(0, 2);
    if (input.length > 2) formatted += '/' + input.slice(2, 4);
    if (input.length > 4) formatted += '/' + input.slice(4, 8);

    setDisplay(formatted);

    if (input.length === 8) {
      const day = input.slice(0, 2);
      const month = input.slice(2, 4);
      const year = input.slice(4, 8);
      const isoDate = `${year}-${month}-${day}`;

      const d = new Date(isoDate);
      if (!isNaN(d.getTime()) && d.toISOString().startsWith(isoDate)) {
        onChange({ target: { name, value: isoDate } });
      }
    }
  };

  return (
    <input
      type="text"
      name={name}
      value={display}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      maxLength={10}
    />
  );
}
