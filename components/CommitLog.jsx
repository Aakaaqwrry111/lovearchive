const commits = [
  "feat: First realization",
  "fix: Awkward silence resolved",
  "docs: Future drafted at MIT",
  "perf: Heartbeat latency reduced",
  "chore: Playlist synced to midnight",
  "refactor: Better boundaries, softer edges",
  "feat: Distance closed with a smile"
];

export default function CommitLog() {
  return (
    <section className="glass rounded-3xl p-6 min-h-[420px] flex flex-col">
      <div className="mb-4">
        <p className="uppercase tracking-[0.3em] text-xs text-cyan">Commit Log</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 text-sm terminal">
        {commits.map((commit) => (
          <div key={commit} className="flex items-start gap-3">
            <span className="text-cyan">•</span>
            <span className="text-white/80">{commit}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
