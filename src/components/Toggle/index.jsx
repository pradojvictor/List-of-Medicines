export default function ToggleBox({ label, isChecked, onToggle }) {
  return (
    <label>
      {label}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
      />
    </label>
  );
}