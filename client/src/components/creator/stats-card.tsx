interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'cyan' | 'magenta' | 'purple' | 'yellow';
  trend?: string;
  trendLabel?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  trendLabel 
}: StatsCardProps) {
  const colorClasses = {
    cyan: {
      text: 'text-neon-cyan',
      bg: 'bg-neon-cyan/20',
      icon: 'text-neon-cyan'
    },
    magenta: {
      text: 'text-neon-magenta',
      bg: 'bg-neon-magenta/20',
      icon: 'text-neon-magenta'
    },
    purple: {
      text: 'text-neon-purple',
      bg: 'bg-neon-purple/20',
      icon: 'text-neon-purple'
    },
    yellow: {
      text: 'text-yellow-400',
      bg: 'bg-yellow-400/20',
      icon: 'text-yellow-400'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-cyber-surface p-6 rounded-lg border border-neon-purple/20 neon-border" data-testid={`stats-${title.toLowerCase().replace(' ', '-')}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyber-muted text-sm uppercase tracking-wide">{title}</p>
          <p className={`text-2xl font-bold ${colors.text}`} data-testid={`value-${title.toLowerCase().replace(' ', '-')}`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} ${colors.icon} text-xl`}></i>
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <span className={`${trend.startsWith('+') ? 'text-green-400' : colors.text} text-sm`}>
            {trend}
          </span>
          {trendLabel && (
            <span className="text-cyber-muted text-sm ml-2">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
