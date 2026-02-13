import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, ChevronLeft, ChevronRight } from 'lucide-react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface RawContribution {
  date: string;
  count: number;
  level: number;
}

interface GithubContributionsProps {
  username?: string;
  className?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Mon', 'Wed', 'Fri'];

const toDateStr = (d: Date) => d.toISOString().split('T')[0];

const GithubContributions: React.FC<GithubContributionsProps> = ({
  username = 'Venkat0629',
  className = ''
}) => {
  const [allContributions, setAllContributions] = useState<RawContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearOffset, setYearOffset] = useState(0); // 0 = current year range, -1 = previous, etc.

  // Fetch all contributions once
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);

        if (!response.ok) {
          throw new Error('Failed to fetch contributions');
        }

        const data = await response.json();

        if (data && data.contributions && Array.isArray(data.contributions)) {
          setAllContributions(data.contributions);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        setError('Unable to load live GitHub contributions.');
        setAllContributions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  // Compute the date range for the current view
  // If today is Feb 13, 2026 and yearOffset=0 → Feb 13, 2025 to Feb 13, 2026
  // If yearOffset=-1 → Feb 13, 2024 to Feb 13, 2025
  const { rangeStart, rangeEnd, rangeLabel } = useMemo(() => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + yearOffset);
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);
    // Adjust start to the nearest previous Sunday for clean week alignment
    startDate.setDate(startDate.getDate() + 1);

    const startMonth = MONTHS[startDate.getMonth()];
    const endMonth = MONTHS[endDate.getMonth()];
    const startYearShort = String(startDate.getFullYear()).slice(-2);
    const endYearShort = String(endDate.getFullYear()).slice(-2);
    const label = `${startMonth} ${startYearShort} — ${endMonth} ${endYearShort}`;

    return { rangeStart: startDate, rangeEnd: endDate, rangeLabel: label };
  }, [yearOffset]);

  // Build contribution map for quick lookup
  const contributionMap = useMemo(() => {
    const map = new Map<string, RawContribution>();
    for (const c of allContributions) {
      map.set(c.date, c);
    }
    return map;
  }, [allContributions]);

  // Build weeks grid and total for the selected range
  const { weeks, totalContributions } = useMemo(() => {
    // Start from the Sunday on or before rangeStart
    const start = new Date(rangeStart);
    const dayOfWeek = start.getDay(); // 0=Sun
    start.setDate(start.getDate() - dayOfWeek);

    const end = new Date(rangeEnd);
    const weeksArr: ContributionWeek[] = [];
    let total = 0;
    const cursor = new Date(start);

    while (cursor <= end) {
      const days: ContributionDay[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = toDateStr(cursor);
        const entry = contributionMap.get(dateStr);
        const isInRange = cursor >= rangeStart && cursor <= end;
        days.push({
          date: dateStr,
          count: isInRange && entry ? entry.count : 0,
          level: isInRange && entry ? entry.level : -1, // -1 marks out-of-range
        });
        if (isInRange && entry) {
          total += entry.count;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      weeksArr.push({ days });
    }

    return { weeks: weeksArr, totalContributions: total };
  }, [rangeStart, rangeEnd, contributionMap]);

  // Derive month labels from the actual weeks data
  const monthPositions = useMemo(() => {
    const positions: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      // Use the first in-range day of the week to determine the month
      const firstDay = week.days.find(d => d.level !== -1) || week.days[0];
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        positions.push({ label: MONTHS[month], weekIndex });
        lastMonth = month;
      }
    });

    return positions;
  }, [weeks]);

  // Check if we can go further back (API usually has ~1-2 years of data)
  const hasOlderData = useMemo(() => {
    if (allContributions.length === 0) return false;
    const oldest = allContributions[allContributions.length - 1]?.date;
    if (!oldest) return false;
    return new Date(oldest) < rangeStart;
  }, [allContributions, rangeStart]);

  const canGoNext = yearOffset < 0;

  const handlePrev = useCallback(() => {
    if (hasOlderData) setYearOffset(prev => prev - 1);
  }, [hasOlderData]);

  const handleNext = useCallback(() => {
    if (canGoNext) setYearOffset(prev => prev + 1);
  }, [canGoNext]);

  const getLevelColor = (level: number) => {
    if (level === -1) return 'bg-transparent'; // Out of range
    const colors = [
      'bg-gray-200 dark:bg-gray-700',
      'bg-green-200 dark:bg-green-900',
      'bg-green-300 dark:bg-green-700',
      'bg-green-400 dark:bg-green-600',
      'bg-green-500 dark:bg-green-500',
    ];
    return colors[level] || colors[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className={`py-12 lg:py-16 px-4 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">GitHub Contributions</h2>
            <p className="text-muted-foreground">Loading contribution data...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="github-contributions" className={`py-12 lg:py-16 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">GitHub Contributions</h2>
          <p className="text-muted-foreground mb-2">
            My open source contributions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-lg p-6 shadow-lg"
        >
          {/* Header: total + period navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Github className="w-4 h-4" />
              <span className="font-medium">{username}</span>
              <span className="mx-1">·</span>
              <span className="text-primary font-semibold">
                {totalContributions} contributions
              </span>
            </div>

            {/* Period navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={!hasOlderData}
                className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                  hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous year"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
                {rangeLabel}
              </span>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                  hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next year"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Month labels — positioned based on actual week data */}
          <div className="flex mb-2" style={{ paddingLeft: '36px' }}>
            {(() => {
              const totalWeeks = weeks.length;
              const labels: React.ReactNode[] = [];
              monthPositions.forEach((pos, i) => {
                const nextWeekIndex = i < monthPositions.length - 1 ? monthPositions[i + 1].weekIndex : totalWeeks;
                const span = nextWeekIndex - pos.weekIndex;
                labels.push(
                  <div
                    key={`${pos.label}-${pos.weekIndex}`}
                    className="text-xs text-muted-foreground"
                    style={{ width: `${(span / totalWeeks) * 100}%` }}
                  >
                    {span >= 2 ? pos.label : ''}
                  </div>
                );
              });
              return labels;
            })()}
          </div>

          {/* Contribution grid */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1" style={{ minWidth: '28px' }}>
              {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                <div key={dayIdx} className="h-[13px] flex items-center justify-end">
                  <span className="text-[10px] text-muted-foreground leading-none">
                    {DAY_LABELS.includes(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIdx])
                      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIdx]
                      : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Contribution squares */}
            <div className="flex gap-[3px] flex-1 overflow-x-auto">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-[13px] h-[13px] rounded-sm ${getLevelColor(day.level)}
                        ${day.level >= 0 ? 'hover:ring-2 hover:ring-primary hover:ring-offset-1 cursor-pointer' : ''}
                        transition-all relative group`}
                      title={day.level >= 0 ? `${formatDate(day.date)}: ${day.count} contributions` : ''}
                    >
                      {day.level >= 0 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                          px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0
                          group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          {formatDate(day.date)}: {day.count} contributions
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend + GitHub link row */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-[13px] h-[13px] rounded-sm ${getLevelColor(level)}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>

            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground
                rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          {error && (
            <div className="mt-4 text-center text-sm text-amber-600 dark:text-amber-400">
              {error}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default GithubContributions;
