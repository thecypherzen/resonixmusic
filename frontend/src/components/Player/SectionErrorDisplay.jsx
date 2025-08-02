const SectionErrorDisplay = ({ reason, prefix = null, message = null }) => {
  return (
    <div>
      <p className="text-neutral-500 flex flex-col gap-1 items-center justify-center p-5 bg-neutral-900 rounded-lg border-1 border-neutral-500">
        <span>
          {prefix ? prefix : ""}&nbsp;
          <span className="font-semibold text-neutral-400">{reason}</span>
        </span>
        {message && <span className="text-sm text-neutral-400">{message}</span>}
      </p>
    </div>
  );
};

export default SectionErrorDisplay;
