import React from 'react';

interface UserInitialsBadgeProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  role?: string;
  className?: string;
  showOnlineDot?: boolean;
}

export const UserInitialsBadge: React.FC<UserInitialsBadgeProps> = ({
  name,
  size = 'md',
  role,
  className = '',
  showOnlineDot = false,
}) => {
  const getInitials = (fullName: string) => {
    if (!fullName) return 'YS';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getGradientByRoleOrName = () => {
    if (role === 'admin' || name.toLowerCase().includes('admin') || name.toLowerCase().includes('om tajane')) {
      return 'from-rose-500 via-pink-600 to-indigo-600 text-white border-rose-400/40 shadow-rose-950/50';
    }
    // Color palettes by first char
    const charCode = (name || 'A').charCodeAt(0) % 4;
    switch (charCode) {
      case 0:
        return 'from-cyan-500 to-blue-600 text-white border-cyan-400/40 shadow-cyan-950/50';
      case 1:
        return 'from-indigo-500 to-purple-600 text-white border-indigo-400/40 shadow-indigo-950/50';
      case 2:
        return 'from-emerald-500 to-teal-600 text-white border-emerald-400/40 shadow-emerald-950/50';
      default:
        return 'from-orange-500 to-amber-600 text-white border-orange-400/40 shadow-orange-950/50';
    }
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] font-bold rounded-lg',
    sm: 'w-7 h-7 text-xs font-bold rounded-lg',
    md: 'w-9 h-9 text-xs font-black rounded-xl',
    lg: 'w-12 h-12 text-sm font-black rounded-2xl',
    xl: 'w-16 h-16 text-xl font-black rounded-3xl',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br ${getGradientByRoleOrName()} border flex items-center justify-center tracking-wider select-none shadow-md font-['Outfit']`}
      >
        {getInitials(name)}
      </div>
      {showOnlineDot && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c1020]" />
      )}
    </div>
  );
};
