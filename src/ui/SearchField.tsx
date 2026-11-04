/**
 * Поле Search під хедером Group (не липке). Стан запиту тримає View Group;
 * хрестик Safari (`type="search"`) і Escape очищають поле.
 */
export function SearchField({
  value,
  placeholder,
  onInput,
}: {
  value: string;
  placeholder: string;
  onInput: (value: string) => void;
}) {
  return (
    <div class="bg-surface-2 px-3.5 pb-3">
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        autocomplete="off"
        spellcheck={false}
        onInput={(e) => onInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value !== '') {
            e.preventDefault();
            onInput('');
          }
        }}
        class="box-border w-full rounded-md border border-line bg-surface px-2.5 py-1.5 font-[inherit] text-ink placeholder:text-muted focus:outline-2 focus:outline-accent"
      />
    </div>
  );
}
