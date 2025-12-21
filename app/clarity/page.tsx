import { clarityStats } from "@/lib/data/clarity";

export default function Clarity() {
  const {
    project,
    overview,
    performance,
    funnels,
    audience,
    contentPerformance,
  } = clarityStats;

  return (
    <section className="space-y-6 py-4 md:py-8">
      <header className="space-y-1">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold uppercase">
          Resume Analytics
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {project.dateRange.from} → {project.dateRange.to}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Metric title="Total Sessions" value={overview.sessions.total} />
        <Metric title="Unique Users" value={overview.users.unique} />
        <Metric title="Human Sessions" value={overview.sessions.human} />
        <Metric title="Bot Sessions" value={overview.sessions.bot} />
      </div>

      <Section title="User Engagement">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Metric
            title="Pages / Session"
            value={overview.engagement.pagesPerSessionAvg}
          />
          <Metric
            title="Avg Scroll Depth"
            value={`${overview.engagement.scrollDepthAvgPercent}%`}
          />
          <Metric
            title="Active Time"
            value={`${overview.engagement.activeTimeSeconds}s`}
          />
          <Metric
            title="Total Time"
            value={`${overview.engagement.totalTimeSeconds}s`}
          />
        </div>
      </Section>

      <Section title="User Segments">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Metric
            title="New Sessions"
            value={overview.users.newSessions}
            subtitle={`${((overview.users.newSessions / overview.sessions.total) * 100).toFixed(1)}%`}
          />
          <Metric
            title="Returning Sessions"
            value={overview.users.returningSessions}
            subtitle={`${((overview.users.returningSessions / overview.sessions.total) * 100).toFixed(1)}%`}
          />
        </div>
      </Section>

      <Section title="Performance">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 md:gap-4">
          <Metric title="Score" value={performance.score} />
          <Metric
            title="LCP"
            value={`${performance.coreWebVitals.lcpSeconds}s`}
          />
          <Metric title="INP" value={`${performance.coreWebVitals.inpMs}ms`} />
          <Metric title="CLS" value={performance.coreWebVitals.cls} />
        </div>
      </Section>

      <Section title="Conversion Funnel">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <Metric
            title="Resume → Chat"
            value={`${funnels.resumeToChat.conversionRatePercent}%`}
          />
          <Metric
            title="Converted Sessions"
            value={funnels.resumeToChat.sessionsConverted}
          />
          <Metric
            title="Median Time"
            value={`${funnels.resumeToChat.medianTimeSeconds}s`}
          />
        </div>
      </Section>

      <Section title="Behavior Insights">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Metric
            title="Rage Clicks"
            value={clarityStats.behaviorInsights.rageClicks.sessions}
            subtitle={`${clarityStats.behaviorInsights.rageClicks.percentage}%`}
          />
          <Metric
            title="Dead Clicks"
            value={clarityStats.behaviorInsights.deadClicks.sessions}
            subtitle={`${clarityStats.behaviorInsights.deadClicks.percentage}%`}
          />
          <Metric
            title="Excessive Scrolling"
            value={clarityStats.behaviorInsights.excessiveScrolling.sessions}
            subtitle={`${clarityStats.behaviorInsights.excessiveScrolling.percentage}%`}
          />
          <Metric
            title="Quick Back Clicks"
            value={clarityStats.behaviorInsights.quickBackClicks.sessions}
            subtitle={`${clarityStats.behaviorInsights.quickBackClicks.percentage}%`}
          />
        </div>
      </Section>

      <Section title="Top Pages">
        <div className="space-y-2">
          {contentPerformance.topPages.map((page) => (
            <div
              key={page.label}
              className="flex justify-between border-l-4 pl-3 sm:pl-4 py-2 text-sm md:text-base bg-accent/80"
            >
              <span>{page.label}</span>
              <span className="font-medium pr-3">{page.sessions}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Audience">
        <div className="space-y-6">
          <div>
            <h5 className="text-xs md:text-sm font-medium text-muted-foreground mb-3 uppercase">
              Devices
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {Object.entries(audience.devices).map(([device, data]) => (
                <Metric
                  key={device}
                  title={device.toUpperCase()}
                  value={`${data.sessions}`}
                  subtitle={`${data.percentage}%`}
                />
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs md:text-sm font-medium text-muted-foreground mb-3 uppercase">
              Operating Systems
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {Object.entries(audience.operatingSystems).map(([os, sessions]) => (
                <Metric
                  key={os}
                  title={os}
                  value={sessions}
                  subtitle={`${((sessions / overview.sessions.total) * 100).toFixed(1)}%`}
                />
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs md:text-sm font-medium text-muted-foreground mb-3 uppercase">
              Top Countries
            </h5>
            <div className="space-y-2">
              {audience.countries.map((country) => (
                <div
                  key={country.country}
                  className="flex justify-between border-l-4 pl-3 sm:pl-4 py-2 text-sm md:text-base bg-accent/80"
                >
                  <span>{country.country}</span>
                  <span className="font-medium pr-3">
                    {country.sessions} ({((country.sessions / overview.sessions.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h4 className="pb-1 uppercase font-semibold border-b">{title}</h4>
      <div>{children}</div>
    </section>
  );
}

function Metric({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="space-y-1 border-l-4 pl-3 sm:pl-4 py-2 bg-accent/80">
      <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
      <p className="text-xl md:text-2xl font-semibold">{value}</p>
      {subtitle && (
        <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
