
import React from 'react';
import { Professional } from '@/types';
import { MapPin, Mail, ExternalLink, Briefcase } from 'lucide-react';

interface ProfessionalCardProps {
  professional: Professional;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <div className="glass-effect rounded-xl p-6 border border-gray-200/30 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg group">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {professional.avatar ? (
            <img
              src={professional.avatar}
              alt={professional.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200/50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              {professional.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                {professional.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Briefcase className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <p className="text-sm text-gray-600 font-light">{professional.title}</p>
              </div>
              <p className="text-sm text-gray-500 font-light mt-1">{professional.company}</p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2">
            {professional.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-light">{professional.location}</span>
              </div>
            )}
            
            {professional.expertise && professional.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {professional.expertise.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100/80 text-blue-700 text-xs rounded-full font-light"
                  >
                    {skill}
                  </span>
                ))}
                {professional.expertise.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100/80 text-gray-600 text-xs rounded-full font-light">
                    +{professional.expertise.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-200/30">
            {professional.email && (
              <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-light">Email</span>
              </button>
            )}
            {professional.linkedin && (
              <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-light">LinkedIn</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
