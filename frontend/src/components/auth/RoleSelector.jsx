import React from 'react';
import { User, Briefcase, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const roles = [
  { id: 'student', label: 'Student', icon: User },
  { id: 'faculty', label: 'Faculty', icon: Briefcase },
  { id: 'admin', label: 'Admin', icon: ShieldCheck }
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="flex p-1 bg-muted/20 rounded-xl gap-1">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = value === role.id;
        
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
              isActive ? 'text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeRole"
                className="absolute inset-0 bg-primary rounded-lg shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={16} className="relative z-10" />
            <span className="relative z-10">{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}