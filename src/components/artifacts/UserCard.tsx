import React from 'react';
import { Education, Experience, UserFound } from '@/types';
import { MapPin, Mail, ExternalLink, Briefcase } from 'lucide-react';

function sortExperiences(experiences: Experience[]) {
  if (!Array.isArray(experiences)) return [];
  return experiences.slice().sort((a, b) => {
      const parseDate = (dateStr: string | null) => {
          if (!dateStr) return new Date(0);
          const [year, month, day] = dateStr.split("-").map(Number);
          return new Date(year, month - 1, day || 1);
      };

      const aStart = parseDate(a.startDate);
      const bStart = parseDate(b.startDate);
      const aEnd = parseDate(a.endDate);
      const bEnd = parseDate(b.endDate);

      if (bStart > aStart) return 1;
      if (bStart < aStart) return -1;

      if (bEnd > aEnd) return 1;
      if (bEnd < aEnd) return -1;

      return 0;
  });
}

function sortEducations(educations: Education[]) {
  if (!Array.isArray(educations)) return [];
  return educations.slice().sort((a, b) => {
      const parseDate = (dateStr: string | null) => {
          if (!dateStr) return new Date(0);
          const [year, month, day] = dateStr.split("-").map(Number);
          return new Date(year, month - 1, day || 1);
      };

      const aStart = parseDate(a.enrollmentDate);
      const bStart = parseDate(b.enrollmentDate);
      const aEnd = parseDate(a.graduationDate);
      const bEnd = parseDate(b.graduationDate);

      if (bStart > aStart) return 1;
      if (bStart < aStart) return -1;

      if (bEnd > aEnd) return 1;
      if (bEnd < aEnd) return -1;

      return 0;
  });
}

interface UserCardProps {
  user: UserFound;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {

  const experiences = sortExperiences(user.experiences);
  const educations = sortEducations(user.educations);

  return (
    <div className="glass-effect rounded-xl p-6 border border-gray-200/30 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg group">
      <div className="flex items-start space-x-4">
        {/* pfpURL */}
        <div className="flex-shrink-0">
          {user.pfpUrl ? (
            <img
              src={user.pfpUrl}
              alt={user.firstName + " " + user.lastName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200/50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              {user.firstName + " " + user.lastName}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                {user.firstName + " " + user.lastName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Briefcase className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <p className="text-sm text-gray-600 font-light">{`${experiences[0].jobTitle} @ ${experiences[0].companyName}`}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2">
            {user.experiences[user.experiences.length - 1].location && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-light">{experiences[0].location}</span>
              </div>
            )}
            
            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100/80 text-blue-700 text-xs rounded-full font-light"
                  >
                    {skill.skillName}
                  </span>
                ))}
                {user.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100/80 text-gray-600 text-xs rounded-full font-light">
                    +{user.skills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-200/30">
            {user.email && (
              <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-light">Email</span>
              </button>
            )}
            {/* {user.linkedin && (
              <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-light">LinkedIn</span>
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
