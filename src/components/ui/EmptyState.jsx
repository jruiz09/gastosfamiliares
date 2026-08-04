function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[24px] border border-pink-100 bg-white/70 p-6 text-center shadow-sm">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
