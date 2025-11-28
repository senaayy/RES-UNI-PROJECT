const GlassCard = ({ children, className = '' }) => (
  <div className={`glass rounded-2xl p-6 ${className}`}>{children}</div>
);

export default GlassCard;

